using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;

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

            // Sin HasMaxLength: el contenido HTML de Tiptap se mapea a text
            // (sin límite físico). El tope real lo impone FluentValidation
            // (MaximumLength 100000) como protección.
            e.Property(n => n.Contenido)
                .IsRequired();

            e.Property(n => n.Subtitulo)
                .IsRequired(false)
                .HasMaxLength(300);

            e.Property(n => n.ImagenPortada)
                .IsRequired(false)
                .HasMaxLength(2048);

            e.Property(n => n.Publicada)
                .IsRequired()
                .HasDefaultValue(false);

            e.Property(n => n.Fijada)
                .IsRequired()
                .HasDefaultValue(false);

            e.HasMany(n => n.Categorias)
                .WithMany(c => c.Noticias)
                .UsingEntity<Dictionary<string, object>>(
                    "NoticiaCategoria",
                    j => j.HasOne<Categoria>()
                        .WithMany()
                        .HasForeignKey("CategoriaId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j => j.HasOne<Noticia>()
                        .WithMany()
                        .HasForeignKey("NoticiaId")
                        .OnDelete(DeleteBehavior.Cascade),
                    j =>
                    {
                        j.ToTable("NoticiaCategorias", "contenido");
                        j.HasKey("NoticiaId", "CategoriaId");
                        j.Property<Guid>("NoticiaId").HasColumnType("uuid");
                        j.Property<Guid>("CategoriaId").HasColumnType("uuid");
                        j.HasIndex("CategoriaId");
                    });

            e.HasMany(n => n.Tags)
                .WithMany(t => t.Noticias)
                .UsingEntity<Dictionary<string, object>>(
                    "NoticiaTag",
                    j => j.HasOne<Tag>()
                        .WithMany()
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j => j.HasOne<Noticia>()
                        .WithMany()
                        .HasForeignKey("NoticiaId")
                        .OnDelete(DeleteBehavior.Cascade),
                    j =>
                    {
                        j.ToTable("NoticiaTags", "contenido");
                        j.HasKey("NoticiaId", "TagId");
                        j.Property<Guid>("NoticiaId").HasColumnType("uuid");
                        j.Property<Guid>("TagId").HasColumnType("uuid");
                        j.HasIndex("TagId");
                    });

            e.ConfigureAuditable();
        }
    }
}