using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;

namespace Infrastructure.Configurations
{
    public class EventoConfiguration : IEntityTypeConfiguration<Evento>
    {
        public void Configure(EntityTypeBuilder<Evento> e)
        {
            e.ToTable("Eventos", "eventos");
            e.HasKey(x => x.Id);

            e.Property(x => x.Id)
                .HasColumnType("uuid")
                .HasDefaultValueSql("gen_random_uuid()")
                .ValueGeneratedOnAdd();

            e.Property(x => x.Titulo)
                .IsRequired()
                .HasMaxLength(200);

            e.Property(x => x.Descripcion)
                .IsRequired();

            e.Property(x => x.Lugar)
                .IsRequired()
                .HasMaxLength(200);

            e.Property(x => x.FechaInicio)
                .IsRequired()
                .HasColumnType("timestamptz");

            e.Property(x => x.FechaFin)
                .IsRequired(false)
                .HasColumnType("timestamptz");

            e.Property(x => x.Publicado)
                .IsRequired()
                .HasDefaultValue(false);

            e.Property(x => x.Destacado)
                .IsRequired()
                .HasDefaultValue(false);

            e.Property(x => x.Aforo)
                .IsRequired(false);

            e.HasMany(x => x.Categorias)
                .WithMany(c => c.Eventos)
                .UsingEntity<Dictionary<string, object>>(
                    "EventoCategoria",
                    j => j.HasOne<Categoria>()
                        .WithMany()
                        .HasForeignKey("CategoriaId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j => j.HasOne<Evento>()
                        .WithMany()
                        .HasForeignKey("EventoId")
                        .OnDelete(DeleteBehavior.Cascade),
                    j =>
                    {
                        j.ToTable("EventoCategorias", "eventos");
                        j.HasKey("EventoId", "CategoriaId");
                        j.Property<Guid>("EventoId").HasColumnType("uuid");
                        j.Property<Guid>("CategoriaId").HasColumnType("uuid");
                        j.HasIndex("CategoriaId");
                    });

            e.HasMany(x => x.Tags)
                .WithMany(t => t.Eventos)
                .UsingEntity<Dictionary<string, object>>(
                    "EventoTag",
                    j => j.HasOne<Tag>()
                        .WithMany()
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j => j.HasOne<Evento>()
                        .WithMany()
                        .HasForeignKey("EventoId")
                        .OnDelete(DeleteBehavior.Cascade),
                    j =>
                    {
                        j.ToTable("EventoTags", "eventos");
                        j.HasKey("EventoId", "TagId");
                        j.Property<Guid>("EventoId").HasColumnType("uuid");
                        j.Property<Guid>("TagId").HasColumnType("uuid");
                        j.HasIndex("TagId");
                    });

            e.ConfigureAuditable();
        }
    }
}
