using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Categorias.Dtos
{
    public record CategoriaDto(Guid Id, string Nombre, string Descripcion, Guid? CategoriaPadreId, DateTime CreatedAt, string CreatedBy, int NoticiasCount);
}
