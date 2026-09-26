using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;

namespace Infrastructure.Configurations
{
    public class NotificacionConfiguration : IEntityTypeConfiguration<Notificacion>
    {
        public void Configure(EntityTypeBuilder<Notificacion> e)
        {
            e.ToTable("Notificaciones", "notificaciones");
            e.HasKey(x => x.Id);

            e.Property(x => x.Id)
                .HasColumnType("uuid")
                .HasDefaultValueSql("gen_random_uuid()")
                .ValueGeneratedOnAdd();

            e.Property(x => x.Titulo)
                .IsRequired()
                .HasMaxLength(200);

            // Sin HasMaxLength: el HTML se mapea a text (sin límite físico).
            // El tope real lo impone FluentValidation (MaximumLength 100000).
            e.Property(x => x.Mensaje)
                .IsRequired();

            e.Property(x => x.Nivel)
                .IsRequired()
                .HasMaxLength(20)
                .HasDefaultValue(NivelNotificacion.Info);

            e.Property(x => x.FechaCaducidad)
                .IsRequired(false)
                .HasColumnType("timestamptz");

            e.Property(x => x.Publicada)
                .IsRequired()
                .HasDefaultValue(false);

            e.Property(x => x.Fijada)
                .IsRequired()
                .HasDefaultValue(false);

            e.HasMany(x => x.Categorias)
                .WithMany(c => c.Notificaciones)
                .UsingEntity<Dictionary<string, object>>(
                    "NotificacionCategoria",
                    j => j.HasOne<Categoria>()
                        .WithMany()
                        .HasForeignKey("CategoriaId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j => j.HasOne<Notificacion>()
                        .WithMany()
                        .HasForeignKey("NotificacionId")
                        .OnDelete(DeleteBehavior.Cascade),
                    j =>
                    {
                        j.ToTable("NotificacionCategorias", "notificaciones");
                        j.HasKey("NotificacionId", "CategoriaId");
                        j.Property<Guid>("NotificacionId").HasColumnType("uuid");
                        j.Property<Guid>("CategoriaId").HasColumnType("uuid");
                        j.HasIndex("CategoriaId");
                    });

            e.HasMany(x => x.Tags)
                .WithMany(t => t.Notificaciones)
                .UsingEntity<Dictionary<string, object>>(
                    "NotificacionTag",
                    j => j.HasOne<Tag>()
                        .WithMany()
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j => j.HasOne<Notificacion>()
                        .WithMany()
                        .HasForeignKey("NotificacionId")
                        .OnDelete(DeleteBehavior.Cascade),
                    j =>
                    {
                        j.ToTable("NotificacionTags", "notificaciones");
                        j.HasKey("NotificacionId", "TagId");
                        j.Property<Guid>("NotificacionId").HasColumnType("uuid");
                        j.Property<Guid>("TagId").HasColumnType("uuid");
                        j.HasIndex("TagId");
                    });

            e.ConfigureAuditable();
        }
    }
}
