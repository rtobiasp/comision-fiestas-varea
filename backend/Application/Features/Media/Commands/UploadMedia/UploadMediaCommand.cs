namespace Application.Features.Media.Commands.UploadMedia
{
    public class UploadMediaCommand
    {
        public Stream Contenido { get; set; } = Stream.Null;
        public string NombreOriginal { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long TamanoBytes { get; set; }
        public string? AltText { get; set; }
    }
}
