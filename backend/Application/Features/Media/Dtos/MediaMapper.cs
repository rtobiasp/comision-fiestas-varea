using Domain.Entities;

namespace Application.Features.Media.Dtos
{
    internal static class MediaMapper
    {
        public static MediaDto ToDto(MediaAsset mediaAsset)
        {
            return new MediaDto(
                mediaAsset.Id,
                mediaAsset.NombreOriginal,
                mediaAsset.UrlRelativa,
                mediaAsset.ContentType,
                mediaAsset.Tipo,
                mediaAsset.TamanoBytes,
                mediaAsset.Ancho,
                mediaAsset.Alto,
                mediaAsset.DuracionSeg,
                mediaAsset.AltText,
                mediaAsset.CreatedAt
            );
        }
    }
}
