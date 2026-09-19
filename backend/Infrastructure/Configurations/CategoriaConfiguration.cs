using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Configurations
{
    internal class CategoriaConfiguration : IEntityTypeConfiguration<Categoria>
    {
        public void Configure(EntityTypeBuilder<Categoria> builder)
        {
            builder.ToTable("Categorias", "contenido");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Id)
                .HasColumnType("uuid")
                .HasDefaultValueSql("gen_random_uuid()")
                .ValueGeneratedOnAdd();

            builder.Property(c => c.Nombre)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(c => c.Descripcion)
                .HasMaxLength(250);

            builder.ConfigureAuditable();
        }
    }
}
