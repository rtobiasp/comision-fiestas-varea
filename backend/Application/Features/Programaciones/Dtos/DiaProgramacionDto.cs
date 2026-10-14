namespace Application.Features.Programaciones.Dtos
{
    public record DiaProgramacionDto(Guid Id, DateTime Fecha, List<EventoProgramacionDto> Eventos);
}
