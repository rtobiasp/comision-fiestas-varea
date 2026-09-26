using Application.Features.Categorias.Dtos;
using Application.Features.Tags.Dtos;
using Domain.Entities;

namespace Application.Features.Eventos.Dtos
{
    internal static class EventoMapper
    {
        public static EventoDto ToDto(Evento evento)
        {
            return new EventoDto(
                evento.Id,
                evento.Titulo,
                evento.Descripcion,
                evento.Lugar,
                evento.FechaInicio,
                evento.FechaFin,
                evento.Publicado,
                evento.Destacado,
                evento.Aforo,
                evento.CreatedAt,
                evento.CreatedBy,
                evento.Categorias
                    .OrderBy(c => c.Nombre)
                    .Select(c => new CategoriaResumenDto(c.Id, c.Nombre))
                    .ToList(),
                evento.Tags
                    .OrderBy(t => t.Nombre)
                    .Select(t => new TagResumenDto(t.Id, t.Nombre))
                    .ToList()
            );
        }
    }
}
