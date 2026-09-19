using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    /// <summary>
    /// Mapeo EF compartido para <see cref="IAuditableEntity"/>.
    /// Mantiene CreatedAt/CreatedBy/LastModifiedAt/LastModifiedBy idénticos
    /// en todas las entidades sin duplicar la configuración fluida.
    /// </summary>
    public static class AuditableConfigurationExtensions
    {
        public static void ConfigureAuditable<T>(this EntityTypeBuilder<T> builder)
            where T : class, IAuditableEntity
        {
            builder.Property(c => c.CreatedAt)
                .IsRequired()
                .HasColumnType("timestamptz")
                .HasDefaultValueSql("now()");

            builder.Property(c => c.CreatedBy)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(c => c.LastModifiedAt)
                .HasColumnType("timestamptz");

            builder.Property(c => c.LastModifiedBy)
                .HasMaxLength(100);
        }
    }
}
