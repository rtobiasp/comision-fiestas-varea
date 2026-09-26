using Application.Features.Categorias.Dtos;
using Application.Features.Tags.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Eventos.Dtos
{
    public record EventoDto(Guid Id, string Titulo, string Descripcion, string Lugar, DateTime FechaInicio, DateTime? FechaFin, bool Publicado, bool Destacado, int? Aforo, DateTime CreatedAt, string CreatedBy, List<CategoriaResumenDto> Categorias, List<TagResumenDto> Tags);
}
