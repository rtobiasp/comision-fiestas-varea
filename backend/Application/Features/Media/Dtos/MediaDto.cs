using Domain.Entities;

namespace Application.Features.Media.Dtos
{
    public record MediaDto(Guid Id, string NombreOriginal, string Url, string ContentType, MediaTipo Tipo, long TamanoBytes, int? Ancho, int? Alto, int? DuracionSeg, string? AltText, DateTime CreatedAt);
}
