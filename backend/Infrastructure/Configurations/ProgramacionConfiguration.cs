using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class ProgramacionConfiguration : IEntityTypeConfiguration<Programacion>
    {
        public void Configure(EntityTypeBuilder<Programacion> builder)
        {
            builder.ToTable("Programaciones", "programacion");
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                .HasColumnType("uuid")
                .HasDefaultValueSql("gen_random_uuid()")
                .ValueGeneratedOnAdd();

            builder.Property(p => p.Nombre)
                .IsRequired()
                .HasMaxLength(200);

            builder.ConfigureAuditable();
        }
    }
}
