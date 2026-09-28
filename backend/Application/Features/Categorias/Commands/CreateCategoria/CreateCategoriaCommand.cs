using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Categorias.Commands.CreateCategoria
{
    public class CreateCategoriaCommand
    {
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public Guid? CategoriaPadreId { get; set; }
    }
}
