using Domain.Interfaces;

namespace Domain.Entities
{
    public class Noticia : IAuditableEntity
    {
        public Guid Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string? Subtitulo { get; set; }
        public string Contenido { get; set; } = string.Empty;
        public bool Publicada { get; set; } = false;
        public bool Fijada { get; set; } = false;
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime? LastModifiedAt { get; set; }
        public string? LastModifiedBy { get; set; }

        // Constructor para EF Core
        public Noticia()
        {
        }

        public Noticia(string titulo, string contenido)
        {
            Titulo = titulo;
            Contenido = contenido;
        }

    }
}
