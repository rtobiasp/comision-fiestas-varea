using Application.Common.Validation;
using FluentValidation;

namespace Application.Features.Media.Commands.UploadMedia
{
    public class UploadMediaCommandValidator : AbstractValidator<UploadMediaCommand>
    {
        internal static readonly string[] ImagenMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        internal static readonly string[] ImagenExtensiones = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
        internal const string PdfMime = "application/pdf";
        internal static readonly string[] VideoMimes = ["video/mp4", "video/webm"];
        internal static readonly string[] VideoExtensiones = [".mp4", ".webm"];

        internal const long MaxImagenBytes = 5 * 1024 * 1024;
        internal const long MaxPdfBytes = 15 * 1024 * 1024;
        internal const long MaxVideoBytes = 50 * 1024 * 1024;

        public UploadMediaCommandValidator()
        {
            RuleFor(x => x.Contenido)
                .NotNull().WithMessage("El contenido del archivo es obligatorio.");

            RuleFor(x => x.NombreOriginal)
                .NotEmpty().WithMessage("El nombre original es obligatorio.")
                .MaximumLength(255).WithMessage("El nombre original no puede exceder los 255 caracteres.")
                .IsPlainText();

            RuleFor(x => x.ContentType)
                .NotEmpty().WithMessage("El content type es obligatorio.")
                .Must(ct => EsMimeSoportado(ct)).WithMessage("Tipo de archivo no soportado. Solo imágenes (jpeg/png/webp/gif), PDF y vídeo (mp4/webm).");

            RuleFor(x => x)
                .Must(cmd => ExtensionCoherente(cmd.NombreOriginal, cmd.ContentType))
                .WithMessage("La extensión del archivo no coincide con su content type.")
                .When(cmd => EsMimeSoportado(cmd.ContentType) && !string.IsNullOrWhiteSpace(cmd.NombreOriginal));

            RuleFor(x => x.TamanoBytes)
                .GreaterThan(0).WithMessage("El archivo está vacío.")
                .Must((cmd, tamano) => tamano <= TopePara(cmd.ContentType))
                .WithMessage(cmd => $"El archivo supera el tamaño máximo para su tipo ({TopePara(cmd.ContentType) / (1024 * 1024)} MB).")
                .When(cmd => EsMimeSoportado(cmd.ContentType));

            RuleFor(x => x.AltText)
                .NotEmpty().WithMessage("El texto alternativo es obligatorio en imágenes.")
                .MaximumLength(300).WithMessage("El texto alternativo no puede exceder los 300 caracteres.")
                .IsPlainText()
                .When(x => EsImagen(x.ContentType));

            RuleFor(x => x.AltText)
                .MaximumLength(300).WithMessage("El texto alternativo no puede exceder los 300 caracteres.")
                .IsPlainText()
                .When(x => !EsImagen(x.ContentType) && !string.IsNullOrWhiteSpace(x.AltText));
        }

        internal static bool EsMimeSoportado(string contentType) =>
            EsImagen(contentType) || contentType == PdfMime || VideoMimes.Contains(contentType);

        internal static bool EsImagen(string contentType) =>
            ImagenMimes.Contains(contentType);

        internal static bool EsVideo(string contentType) =>
            VideoMimes.Contains(contentType);

        internal static bool ExtensionCoherente(string nombreOriginal, string contentType)
        {
            var ext = Path.GetExtension(nombreOriginal).ToLowerInvariant();

            if (EsImagen(contentType))
                return ImagenExtensiones.Contains(ext);

            if (contentType == PdfMime)
                return ext == ".pdf";

            if (EsVideo(contentType))
                return VideoExtensiones.Contains(ext);

            return false;
        }

        internal static long TopePara(string contentType)
        {
            if (EsImagen(contentType))
                return MaxImagenBytes;

            if (contentType == PdfMime)
                return MaxPdfBytes;

            return MaxVideoBytes;
        }
    }
}
