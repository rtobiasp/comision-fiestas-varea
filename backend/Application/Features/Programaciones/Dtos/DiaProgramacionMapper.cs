using Domain.Entities;

namespace Application.Features.Programaciones.Dtos
{
    internal static class DiaProgramacionMapper
    {
        public static DiaProgramacionDto ToDto(DiaProgramacion dia)
        {
            return new DiaProgramacionDto(
                dia.Id,
                dia.Fecha,
                dia.Eventos.OrderBy(e => e.FechaInicio).Select(EventoProgramacionMapper.ToDto).ToList());
        }
    }
}
