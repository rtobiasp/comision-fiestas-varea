using Application.Features.Categorias.Dtos;
using Application.Features.Tags.Dtos;
using Domain.Entities;

namespace Application.Features.Notificaciones.Dtos
{
    internal static class NotificacionMapper
    {
        public static NotificacionDto ToDto(Notificacion notificacion)
        {
            return new NotificacionDto(
                notificacion.Id,
                notificacion.Titulo,
                notificacion.Mensaje,
                notificacion.Nivel,
                notificacion.FechaCaducidad,
                notificacion.Publicada,
                notificacion.Fijada,
                notificacion.CreatedAt,
                notificacion.CreatedBy,
                notificacion.LastModifiedAt,
                notificacion.LastModifiedBy,
                notificacion.Categorias
                    .OrderBy(c => c.Nombre)
                    .Select(c => new CategoriaResumenDto(c.Id, c.Nombre))
                    .ToList(),
                notificacion.Tags
                    .OrderBy(t => t.Nombre)
                    .Select(t => new TagResumenDto(t.Id, t.Nombre))
                    .ToList()
            );
        }
    }
}
