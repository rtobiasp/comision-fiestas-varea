using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class NoticiaConfiguration : IEntityTypeConfiguration<Noticia>
    {
        public void Configure(EntityTypeBuilder<Noticia> e)
        {
            e.ToTable("Noticias", "contenido");
            e.HasKey(n => n.Id);

            e.Property(n => n.Id)
                .HasColumnType("uuid")
                .HasDefaultValueSql("gen_random_uuid()")
                .ValueGeneratedOnAdd();

            e.Property(n => n.Titulo)
                .IsRequired()
                .HasMaxLength(200);

            e.Property(n => n.Contenido)
                .IsRequired()
                .HasMaxLength(2000);

            e.Property(n => n.Subtitulo)
                .IsRequired(false)
                .HasMaxLength(300);

            e.Property(n => n.Publicada)
                .IsRequired()
                .HasDefaultValue(false);

            e.Property(n => n.Fijada)
                .IsRequired()
                .HasDefaultValue(false);

            e.ConfigureAuditable();
        }
    }
}