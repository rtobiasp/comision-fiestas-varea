using Application.Features.Categorias.Dtos;
using Application.Features.Tags.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Eventos.Dtos
{
    public record EventoDto(Guid Id, string Titulo, string Descripcion, string Lugar, DateTime FechaInicio, DateTime? FechaFin, string? ImagenPortada, bool Publicada, bool Fijada, int? Aforo, DateTime CreatedAt, string CreatedBy, DateTime? LastModifiedAt, string? LastModifiedBy, List<CategoriaResumenDto> Categorias, List<TagResumenDto> Tags);
}
