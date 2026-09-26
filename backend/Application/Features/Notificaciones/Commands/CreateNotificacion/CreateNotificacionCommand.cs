using Domain.Entities;

namespace Application.Features.Notificaciones.Commands.CreateNotificacion
{
    public class CreateNotificacionCommand
    {
        public string Titulo { get; set; } = string.Empty;
        public string Mensaje { get; set; } = string.Empty;
        public string Nivel { get; set; } = NivelNotificacion.Info;
        public DateTime? FechaCaducidad { get; set; }
        public bool Fijada { get; set; } = false;
        public List<Guid> CategoriaIds { get; set; } = new();
        public List<Guid> TagIds { get; set; } = new();
    }
}
