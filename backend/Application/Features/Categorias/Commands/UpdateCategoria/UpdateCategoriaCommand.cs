using System.Text.Json.Serialization;

namespace Application.Features.Categorias.Commands.UpdateCategoria
{
    public class UpdateCategoriaCommand
    {
        [JsonIgnore]
        public Guid Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
    }
}
