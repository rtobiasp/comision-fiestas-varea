using Application.Features.Categorias.Dtos;
using Application.Features.Tags.Dtos;

namespace Application.Features.Notificaciones.Dtos
{
    public record NotificacionDto(Guid Id, string Titulo, string Mensaje, string Nivel, DateTime? FechaCaducidad, bool Publicada, bool Fijada, DateTime CreatedAt, string CreatedBy, List<CategoriaResumenDto> Categorias, List<TagResumenDto> Tags);
}
