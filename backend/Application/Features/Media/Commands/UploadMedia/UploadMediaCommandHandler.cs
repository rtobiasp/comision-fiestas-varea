using Application.Common.Interfaces;
using Application.Features.Media.Dtos;
using Domain.Entities;
using SixLabors.ImageSharp;

namespace Application.Features.Media.Commands.UploadMedia
{
    public class UploadMediaCommandHandler
    {
        private readonly IStorageService _storageService;
        private readonly IMediaAssetRepository _mediaAssetRepository;

        public UploadMediaCommandHandler(
            IStorageService storageService,
            IMediaAssetRepository mediaAssetRepository)
        {
            _storageService = storageService;
            _mediaAssetRepository = mediaAssetRepository;
        }

        public async Task<MediaDto> Handle(
            UploadMediaCommand request,
            CancellationToken cancellationToken)
        {
            var contenido = request.Contenido;
            MemoryStream? buffer = null;

            if (!contenido.CanSeek)
            {
                buffer = new MemoryStream();
                await contenido.CopyToAsync(buffer, cancellationToken);
                buffer.Seek(0, SeekOrigin.Begin);
                contenido = buffer;
            }

            try
            {
                VerificarFirma(contenido, request.ContentType);

                var tipo = InferirTipo(request.ContentType);
                var extension = Path.GetExtension(request.NombreOriginal).ToLowerInvariant();

                int? ancho = null;
                int? alto = null;
                int? duracionSeg = null;

                if (tipo == MediaTipo.Imagen)
                {
                    try
                    {
                        var info = await Image.IdentifyAsync(contenido, cancellationToken);
                        if (info is null)
                            throw new InvalidOperationException("Formato de imagen no reconocido.");
                        ancho = info.Width;
                        alto = info.Height;
                    }
                    catch (Exception ex) when (ex is not FluentValidation.ValidationException)
                    {
                        throw new FluentValidation.ValidationException(
                            [new FluentValidation.Results.ValidationFailure("Contenido", "La imagen está corrupta o no se pudo leer.")]);
                    }

                    contenido.Seek(0, SeekOrigin.Begin);
                }

                if (tipo == MediaTipo.Video)
                {
                    try
                    {
                        contenido.Seek(0, SeekOrigin.Begin);
                        var abstraction = new StreamAbstraction($"video{extension}", contenido);
                        using var tfile = TagLib.File.Create(
                            abstraction, request.ContentType, TagLib.ReadStyle.Average);
                        var segundos = (int)Math.Round(tfile.Properties.Duration.TotalSeconds);
                        if (segundos <= 0)
                            throw new InvalidOperationException("Duración de vídeo no válida.");
                        duracionSeg = segundos;
                    }
                    catch (Exception ex) when (ex is not FluentValidation.ValidationException)
                    {
                        throw new FluentValidation.ValidationException(
                            [new FluentValidation.Results.ValidationFailure("Contenido", "El vídeo está corrupto o no se pudo leer su duración.")]);
                    }

                    contenido.Seek(0, SeekOrigin.Begin);
                }

                var (storageKey, urlRelativa, bytes) = await _storageService.SaveAsync(
                    contenido, request.NombreOriginal, request.ContentType, extension, cancellationToken);

                var mediaAsset = new MediaAsset(
                    request.NombreOriginal, storageKey, urlRelativa, request.ContentType, tipo, bytes)
                {
                    AltText = string.IsNullOrWhiteSpace(request.AltText) ? null : request.AltText.Trim(),
                    Ancho = ancho,
                    Alto = alto,
                    DuracionSeg = duracionSeg
                };

                MediaAsset creado;
                try
                {
                    creado = await _mediaAssetRepository.AddAsync(mediaAsset, cancellationToken);
                }
                catch
                {
                    try
                    {
                        await _storageService.DeleteAsync(storageKey, cancellationToken);
                    }
                    catch
                    {
                    }

                    throw;
                }

                return MediaMapper.ToDto(creado);
            }
            finally
            {
                buffer?.Dispose();
            }
        }

        /// <summary>
        /// Adaptador de un <see cref="Stream"/> ya abierto a <see cref="TagLib.File.IFileAbstraction"/>.
        /// No cierra el stream: su ciclo de vida lo lleva el controller.
        /// </summary>
        private sealed class StreamAbstraction : TagLib.File.IFileAbstraction
        {
            private readonly Stream _stream;

            public StreamAbstraction(string name, Stream stream)
            {
                Name = name;
                _stream = stream;
            }

            public string Name { get; }

            public Stream ReadStream => _stream;

            public Stream WriteStream => _stream;

            public void CloseStream(Stream stream)
            {
            }
        }

        private static MediaTipo InferirTipo(string contentType)
        {
            if (UploadMediaCommandValidator.EsImagen(contentType))
                return MediaTipo.Imagen;

            if (contentType == UploadMediaCommandValidator.PdfMime)
                return MediaTipo.Pdf;

            return MediaTipo.Video;
        }

        /// <summary>
        /// Verifica la firma (magic bytes) del contenido frente al MIME declarado.
        /// Deja el stream posicionado al inicio.
        /// </summary>
        private static void VerificarFirma(Stream contenido, string contentType)
        {
            Span<byte> cabecera = stackalloc byte[12];
            contenido.Seek(0, SeekOrigin.Begin);
            var leidos = contenido.Read(cabecera);

            bool valida = contentType switch
            {
                // JPEG: FF D8 FF
                "image/jpeg" => leidos >= 3 && cabecera[0] == 0xFF && cabecera[1] == 0xD8 && cabecera[2] == 0xFF,
                // PNG: 89 50 4E 47 0D 0A 1A 0A
                "image/png" => leidos >= 8 && cabecera[0] == 0x89 && cabecera[1] == 0x50 && cabecera[2] == 0x4E && cabecera[3] == 0x47
                    && cabecera[4] == 0x0D && cabecera[5] == 0x0A && cabecera[6] == 0x1A && cabecera[7] == 0x0A,
                // GIF87a / GIF89a
                "image/gif" => leidos >= 6 && cabecera[0] == (byte)'G' && cabecera[1] == (byte)'I' && cabecera[2] == (byte)'F'
                    && cabecera[3] == (byte)'8' && (cabecera[4] == (byte)'7' || cabecera[4] == (byte)'9') && cabecera[5] == (byte)'a',
                // WEBP: RIFF....WEBP
                "image/webp" => leidos >= 12 && cabecera[0] == (byte)'R' && cabecera[1] == (byte)'I' && cabecera[2] == (byte)'F' && cabecera[3] == (byte)'F'
                    && cabecera[8] == (byte)'W' && cabecera[9] == (byte)'E' && cabecera[10] == (byte)'B' && cabecera[11] == (byte)'P',
                // PDF: %PDF
                "application/pdf" => leidos >= 4 && cabecera[0] == (byte)'%' && cabecera[1] == (byte)'P' && cabecera[2] == (byte)'D' && cabecera[3] == (byte)'F',
                // MP4: ....ftyp
                "video/mp4" => leidos >= 8 && cabecera[4] == (byte)'f' && cabecera[5] == (byte)'t' && cabecera[6] == (byte)'y' && cabecera[7] == (byte)'p',
                // WebM/Matroska: 1A 45 DF A3
                "video/webm" => leidos >= 4 && cabecera[0] == 0x1A && cabecera[1] == 0x45 && cabecera[2] == 0xDF && cabecera[3] == 0xA3,
                _ => false
            };

            contenido.Seek(0, SeekOrigin.Begin);

            if (!valida)
                throw new FluentValidation.ValidationException(
                    [new FluentValidation.Results.ValidationFailure("Contenido", "El contenido del archivo no coincide con su tipo declarado.")]);
        }
    }
}
