using Domain.Entities;
using System.Text.Json.Serialization;

namespace Application.Features.Notificaciones.Commands.UpdateNotificacion
{
    public class UpdateNotificacionCommand
    {
        [JsonIgnore]
        public Guid Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Mensaje { get; set; } = string.Empty;
        public string Nivel { get; set; } = NivelNotificacion.Info;
        public DateTime? FechaCaducidad { get; set; }
        public bool Publicada { get; set; }
        public bool Fijada { get; set; }
        public List<Guid> CategoriaIds { get; set; } = new();
        public List<Guid> TagIds { get; set; } = new();
    }
}
