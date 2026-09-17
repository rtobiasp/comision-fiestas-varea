using Application.Common.Interfaces;
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

        public async Task<Noticia> AddAsync(Noticia noticia, CancellationToken cancellationToken)
        {
            if (noticia.Id == Guid.Empty)
                noticia.Id = Guid.NewGuid();

            var addedNoticia = await _postgreContext.Noticias.AddAsync(noticia, cancellationToken);
            await _postgreContext.SaveChangesAsync(cancellationToken);
            return addedNoticia.Entity;
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var noticia = await this.GetAsync(id, cancellationToken);
            _postgreContext.Noticias.Remove(noticia);
            await _postgreContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<Noticia>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _postgreContext.Noticias.AsNoTracking().ToListAsync(cancellationToken);
        }

        public async Task<Noticia> GetAsync(Guid id, CancellationToken cancellationToken)
        {
            var noticia = await _postgreContext.Noticias.FirstOrDefaultAsync(n => n.Id == id, cancellationToken);

            if (noticia is null)
            {
                throw new KeyNotFoundException("No se han encontrado noticias con los parámetros proporcionados");
            }

            return noticia;
        }

        public async Task UpdateAsync(Noticia noticia, CancellationToken cancellationToken)
        {
            if (noticia is null)
                throw new ArgumentNullException(nameof(noticia), "La noticia no puede ser nula");

            var existingNoticia = await _postgreContext.Noticias.FirstOrDefaultAsync(n => n.Id == noticia.Id, cancellationToken);

            if (existingNoticia is null)
                throw new KeyNotFoundException("No se han encontrado noticias con los parámetros proporcionados");


            _postgreContext.Entry(existingNoticia).CurrentValues.SetValues(noticia);
            await _postgreContext.SaveChangesAsync(cancellationToken);

        }
    }
}
