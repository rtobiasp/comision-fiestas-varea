using Domain.Interfaces;
using System.Text.Json.Serialization;

namespace Domain.Entities
{
    public class Evento : IAuditableEntity
    {
        public Guid Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Lugar { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public string? ImagenPortada { get; set; }
        public bool Publicada { get; set; } = false;
        public bool Fijada { get; set; } = false;
        public int? Aforo { get; set; }
        [JsonIgnore]
        public ICollection<Categoria> Categorias { get; set; } = new List<Categoria>();
        [JsonIgnore]
        public ICollection<Tag> Tags { get; set; } = new List<Tag>();
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime? LastModifiedAt { get; set; }
        public string? LastModifiedBy { get; set; }

        // Constructor para EF Core
        public Evento()
        {
        }

        public Evento(string titulo, string descripcion, string lugar, DateTime fechaInicio)
        {
            Titulo = titulo;
            Descripcion = descripcion;
            Lugar = lugar;
            FechaInicio = fechaInicio;
        }
    }
}
