using Domain.Entities;

namespace Application.Features.Programaciones.Dtos
{
    internal static class ProgramacionMapper
    {
        public static ProgramacionDto ToDto(Programacion programacion)
        {
            return new ProgramacionDto(
                programacion.Id,
                programacion.Nombre,
                programacion.CreatedAt,
                programacion.CreatedBy,
                programacion.LastModifiedAt,
                programacion.LastModifiedBy,
                programacion.Dias.OrderBy(d => d.Fecha).Select(DiaProgramacionMapper.ToDto).ToList());
        }
    }
}
