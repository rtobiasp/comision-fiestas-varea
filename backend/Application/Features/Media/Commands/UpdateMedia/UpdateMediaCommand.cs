using System.Text.Json.Serialization;

namespace Application.Features.Media.Commands.UpdateMedia
{
    public class UpdateMediaCommand
    {
        [JsonIgnore]
        public Guid Id { get; set; }
        public string NombreOriginal { get; set; } = string.Empty;
        public string? AltText { get; set; }
    }
}
