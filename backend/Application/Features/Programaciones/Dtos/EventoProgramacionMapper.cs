using Domain.Entities;

namespace Application.Features.Programaciones.Dtos
{
    internal static class EventoProgramacionMapper
    {
        public static EventoProgramacionDto ToDto(EventoProgramacion evento)
        {
            return new EventoProgramacionDto(evento.Id, evento.Nombre, evento.Descripcion, evento.FechaInicio);
        }
    }
}
