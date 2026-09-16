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
