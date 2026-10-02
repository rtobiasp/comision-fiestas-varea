using Application.Common.Interfaces;
using Domain.Entities;

namespace Application.Features.Media.Commands.UpdateMedia
{
    public class UpdateMediaCommandHandler
    {
        private readonly IMediaAssetRepository _mediaAssetRepository;

        public UpdateMediaCommandHandler(IMediaAssetRepository mediaAssetRepository)
        {
            _mediaAssetRepository = mediaAssetRepository;
        }

        public async Task Handle(
            UpdateMediaCommand request,
            CancellationToken cancellationToken)
        {
            var existingMedia = await _mediaAssetRepository.GetTrackedAsync(request.Id, cancellationToken);

            // La extensión no se puede cambiar: el título es solo la referencia
            // en BD y debe seguir describiendo el fichero real.
            var extensionNueva = Path.GetExtension(request.NombreOriginal.Trim());
            var extensionActual = Path.GetExtension(existingMedia.NombreOriginal);
            if (!string.Equals(extensionNueva, extensionActual, StringComparison.OrdinalIgnoreCase))
            {
                throw new FluentValidation.ValidationException(
                    [new FluentValidation.Results.ValidationFailure("NombreOriginal", "La extensión del archivo no se puede cambiar.")]);
            }

            existingMedia.NombreOriginal = request.NombreOriginal.Trim();
            existingMedia.AltText = string.IsNullOrWhiteSpace(request.AltText)
                ? null
                : request.AltText.Trim();

            if (existingMedia.Tipo == MediaTipo.Imagen && existingMedia.AltText is null)
            {
                throw new FluentValidation.ValidationException(
                    [new FluentValidation.Results.ValidationFailure("AltText", "El texto alternativo es obligatorio en imágenes.")]);
            }

            await _mediaAssetRepository.UpdateAsync(existingMedia, cancellationToken);
        }
    }
}
