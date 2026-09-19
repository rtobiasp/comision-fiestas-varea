using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    internal class TagConfiguration : IEntityTypeConfiguration<Tag>
    {
        public void Configure(EntityTypeBuilder<Tag> builder)
        {
            builder.ToTable("Tags", "contenido");

            builder.HasKey(t => t.Id);

            builder.Property(t => t.Id)
                .HasColumnType("uuid")
                .HasDefaultValueSql("gen_random_uuid()")
                .ValueGeneratedOnAdd();

            builder.Property(t => t.Nombre)
                .IsRequired()
                .HasMaxLength(100);

            builder.HasIndex(t => t.Nombre)
                .IsUnique();

            builder.ConfigureAuditable();
        }
    }
}
