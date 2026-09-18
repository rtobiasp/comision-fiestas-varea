using System.Text.Json.Serialization;

namespace Application.Features.Noticias.Commands.UpdateNoticia
{
    // Mensaje Wolverine: clase simple sin interfaces.
    public class UpdateNoticiaCommand
    {
        [JsonIgnore]
        public Guid Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string? Subtitulo { get; set; }
        public string Contenido { get; set; } = string.Empty;
        public bool Publicada { get; set; }
        public bool Fijada { get; set; }
    }
}
