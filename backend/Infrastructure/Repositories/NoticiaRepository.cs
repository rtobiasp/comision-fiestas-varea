using Application.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repositories
{
    public class NoticiaRepository : INoticiaRepository
    {
        private readonly PostgreContext _postgreContext;

        public NoticiaRepository(PostgreContext postgreContext)
        {
            _postgreContext = postgreContext;
        }

        public async Task AddAsync(Noticia noticia)
        {
            if (noticia.Id == Guid.Empty)
                noticia.Id = Guid.NewGuid();

            if (noticia.FechaPublicacion == default)
                noticia.FechaPublicacion = DateTime.UtcNow;
            else if (noticia.FechaPublicacion.Kind != DateTimeKind.Utc)
                noticia.FechaPublicacion = DateTime.SpecifyKind(noticia.FechaPublicacion, DateTimeKind.Utc);

            await _postgreContext.Noticias.AddAsync(noticia);
            await _postgreContext.SaveChangesAsync();
        }

        public Task DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<Noticia>> GetAllAsync()
        {
            return await _postgreContext.Noticias.ToListAsync();
        }

        public async Task<Noticia> GetAsync(Guid id)
        {
            var noticia = await _postgreContext.Noticias.FirstOrDefaultAsync(n => n.Id == id);

            if (noticia is null)
            {
                throw new Exception("No hay noticia");
            }

            return noticia;
        }
    }
}
