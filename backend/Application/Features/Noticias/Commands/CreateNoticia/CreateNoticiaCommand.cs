using Domain.Entities;

namespace Application.Features.Noticias.Commands.CreateNoticia
{
    public class CreateNoticiaCommand {
        public string Titulo { get; set; } = string.Empty;
        public string? Subtitulo { get; set; }
        public string Contenido { get; set; } = string.Empty;
        public string? ImagenPortada { get; set; }
        public bool Publicada { get; set; } = false;
        public bool Fijada { get; set; } = false;
        public List<Guid> CategoriaIds { get; set; } = new();
        public List<Guid> TagIds { get; set; } = new();
    }
}
