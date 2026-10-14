using System.Text.Json.Serialization;

namespace Application.Features.Programaciones.Commands.UpdateDiaProgramacion
{
    public class UpdateDiaProgramacionCommand
    {
        [JsonIgnore]
        public Guid Id { get; set; }
        public DateTime Fecha { get; set; }
    }
}
