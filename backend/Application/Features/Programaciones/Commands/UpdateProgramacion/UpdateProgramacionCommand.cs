using System.Text.Json.Serialization;

namespace Application.Features.Programaciones.Commands.UpdateProgramacion
{
    public class UpdateProgramacionCommand
    {
        [JsonIgnore]
        public Guid Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
    }
}
