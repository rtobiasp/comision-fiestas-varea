namespace Application.Features.Programaciones.Dtos
{
    public record ProgramacionDto(Guid Id, string Nombre, DateTime CreatedAt, string CreatedBy, DateTime? LastModifiedAt, string? LastModifiedBy, List<DiaProgramacionDto> Dias);
}
