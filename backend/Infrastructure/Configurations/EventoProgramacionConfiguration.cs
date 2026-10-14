using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Configurations
{
    public class EventoProgramacionConfiguration : IEntityTypeConfiguration<EventoProgramacion>
    {
        public void Configure(EntityTypeBuilder<EventoProgramacion> builder)
        {
            builder.ToTable("EventosProgramacion", "programacion");
            builder.HasKey(e => e.Id);

            builder.Property(e => e.Id)
                .HasColumnType("uuid")
                .HasDefaultValueSql("gen_random_uuid()")
                .ValueGeneratedOnAdd();

            builder.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(e => e.Descripcion)
                .IsRequired();

            builder.Property(e => e.FechaInicio)
                .IsRequired()
                .HasColumnType("timestamptz");

            builder.Property<Guid>("DiaProgramacionId")
                .HasColumnType("uuid")
                .IsRequired();

            builder.HasOne<DiaProgramacion>()
                .WithMany(d => d.Eventos)
                .HasForeignKey("DiaProgramacionId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            builder.HasIndex("DiaProgramacionId");
            builder.HasIndex("DiaProgramacionId", "FechaInicio");
        }
    }
}
