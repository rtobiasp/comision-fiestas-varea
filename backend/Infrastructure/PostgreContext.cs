using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure
{
    public class PostgreContext : DbContext
    {
        public DbSet<Noticia> Noticias => Set<Noticia>();
        public DbSet<Categoria> Categorias => Set<Categoria>();
        public DbSet<Tag> Tags => Set<Tag>();
        public DbSet<Evento> Eventos => Set<Evento>();
        public DbSet<Notificacion> Notificaciones => Set<Notificacion>();
        public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();
        public DbSet<Programacion> Programaciones => Set<Programacion>();
        public DbSet<DiaProgramacion> DiasProgramacion => Set<DiaProgramacion>();
        public DbSet<EventoProgramacion> EventosProgramacion => Set<EventoProgramacion>();

        public PostgreContext(DbContextOptions<PostgreContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(PostgreContext).Assembly);
        }
                    
    }
}
