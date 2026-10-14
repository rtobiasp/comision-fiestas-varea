using System.Text.Json.Serialization;

namespace Application.Features.Programaciones.Commands.UpdateEventoProgramacion
{
    public class UpdateEventoProgramacionCommand
    {
        [JsonIgnore]
        public Guid Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
    }
}
