using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class MediaAssetConfiguration : IEntityTypeConfiguration<MediaAsset>
    {
        public void Configure(EntityTypeBuilder<MediaAsset> builder)
        {
            builder.ToTable("MediaAssets", "contenido");
            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id)
                .HasColumnType("uuid")
                .HasDefaultValueSql("gen_random_uuid()")
                .ValueGeneratedOnAdd();
            builder.Property(m => m.NombreOriginal)
                .IsRequired()
                .HasMaxLength(255);
            builder.Property(m => m.StorageKey)
                .IsRequired()
                .HasMaxLength(500);
            builder.Property(m => m.UrlRelativa)
                .IsRequired()
                .HasMaxLength(500);
            builder.Property(m => m.ContentType)
                .IsRequired()
                .HasMaxLength(100);
            builder.Property(m => m.Tipo)
                .IsRequired()
                .HasDefaultValue(MediaTipo.Imagen);
            builder.Property(m => m.TamanoBytes)
                .IsRequired()
                .HasDefaultValue(0L);
            builder.Property(m => m.Ancho)
                .IsRequired(false);
            builder.Property(m => m.Alto)
                .IsRequired(false);
            builder.Property(m => m.DuracionSeg)
                .IsRequired(false);
            builder.Property(m => m.AltText)
                .IsRequired(false)
                .HasMaxLength(300);

            builder.HasIndex(m => m.StorageKey)
                .IsUnique();

            builder.HasIndex(m => m.Tipo);
            builder.HasIndex(m => m.CreatedAt);

            builder.ConfigureAuditable();
        }
    }
}