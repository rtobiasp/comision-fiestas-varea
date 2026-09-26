using Domain.Interfaces;
using System.Text.Json.Serialization;

namespace Domain.Entities
{
    public class Notificacion : IAuditableEntity
    {
        public Guid Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Mensaje { get; set; } = string.Empty;
        public string Nivel { get; set; } = NivelNotificacion.Info;
        public DateTime? FechaCaducidad { get; set; }
        public bool Publicada { get; set; } = false;
        public bool Fijada { get; set; } = false;
        [JsonIgnore]
        public ICollection<Categoria> Categorias { get; set; } = new List<Categoria>();
        [JsonIgnore]
        public ICollection<Tag> Tags { get; set; } = new List<Tag>();
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime? LastModifiedAt { get; set; }
        public string? LastModifiedBy { get; set; }

        // Constructor para EF Core
        public Notificacion()
        {
        }

        public Notificacion(string titulo, string mensaje, string nivel)
        {
            Titulo = titulo;
            Mensaje = mensaje;
            Nivel = nivel;
        }
    }
}
