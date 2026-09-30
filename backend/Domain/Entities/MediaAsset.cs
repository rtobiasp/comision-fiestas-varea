using Domain.Interfaces;

namespace Domain.Entities
{
    public class MediaAsset : IAuditableEntity
    {
        public Guid Id { get; set; }
        public string NombreOriginal { get; set; } = string.Empty;
        public string StorageKey { get; set; } = string.Empty;
        public string UrlRelativa { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public MediaTipo Tipo { get; set; } = MediaTipo.Imagen;
        public long TamanoBytes { get; set; }
        public int? Ancho { get; set; }
        public int? Alto { get; set; }
        public int? DuracionSeg { get; set; }
        public string? AltText { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime? LastModifiedAt { get; set; }
        public string? LastModifiedBy { get; set; }

        // Constructor para EF Core
        public MediaAsset()
        {
        }

        public MediaAsset(string nombreOriginal, string storageKey, string urlRelativa, string contentType, MediaTipo tipo, long tamanoBytes)
        {
            NombreOriginal = nombreOriginal;
            StorageKey = storageKey;
            UrlRelativa = urlRelativa;
            ContentType = contentType;
            Tipo = tipo;
            TamanoBytes = tamanoBytes;
        }
    }
}
