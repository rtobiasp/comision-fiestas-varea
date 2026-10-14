using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace Infrastructure.Configurations
{
    public class DiaProgramacionConfiguration : IEntityTypeConfiguration<DiaProgramacion>
    {
        public void Configure(EntityTypeBuilder<DiaProgramacion> builder)
        {
            builder.ToTable("DiasProgramacion", "programacion");
            builder.HasKey(d => d.Id);

            builder.Property(d => d.Id)
                .HasColumnType("uuid")
                .HasDefaultValueSql("gen_random_uuid()")
                .ValueGeneratedOnAdd();

            builder.Property(d => d.Fecha)
                .IsRequired()
                .HasColumnType("date");

            builder.Property<Guid>("ProgramacionId")
                .HasColumnType("uuid")
                .IsRequired();

            builder.HasOne<Programacion>()
                .WithMany(p => p.Dias)
                .HasForeignKey("ProgramacionId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            builder.HasIndex("ProgramacionId");
            builder.HasIndex("ProgramacionId", "Fecha")
                .IsUnique();
        }
    }
}
