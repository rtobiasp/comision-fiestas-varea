using System.Text.Json.Serialization;

namespace Application.Features.Tags.Commands.UpdateTag
{
    public class UpdateTagCommand
    {
        [JsonIgnore]
        public Guid Id { get; set; }
        public string Nombre { get; set; }
    }
}
