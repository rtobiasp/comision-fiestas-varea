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

            // La auditoría (CreatedAt/CreatedBy) la rellena AuditableEntityInterceptor.
            await _postgreContext.Noticias.AddAsync(noticia);
            await _postgreContext.SaveChangesAsync();
        }

        public Task DeleteAsync(string id)
        {
            var formated_id = Guid.Empty;
            try
            {
                formated_id = Guid.Parse(id);
            }
            catch (Exception e)
            {
                throw new Exception("El id no es valido: " + e);
            }

            var noticia = this.GetAsync(id).Result;

            if (noticia != null)
            {
                var result = _postgreContext.Noticias.Remove(noticia);
                _postgreContext.SaveChanges();
            }
            else {
                throw new Exception("No se han encontrado noticias con los parámetros proporcionados");
            }

            return Task.CompletedTask;

        }

        public async Task<List<Noticia>> GetAllAsync()
        {
            return await _postgreContext.Noticias.ToListAsync();
        }

        public async Task<Noticia> GetAsync(string id)
        {
            var formated_id = Guid.Empty;
            try {

                formated_id = Guid.Parse(id);

            } catch(Exception e) {
                throw new Exception("El id no es valido: " + e);
            }

            var noticia = await _postgreContext.Noticias.FirstOrDefaultAsync(n => n.Id == formated_id);

            if (noticia is null)
            {
                throw new Exception("No se han encontrado noticias con los parámetros proporcionados");
            }

            return noticia;
        }

        public Task UpdateAsync(Noticia noticia)
        {
            if (noticia is null)
                throw new Exception("La noticia no puede ser nula");

            var existingNoticia = _postgreContext.Noticias.FirstOrDefault(n => n.Id == noticia.Id);

            if (existingNoticia is null)
                throw new Exception("No se han encontrado noticias con los parámetros proporcionados");
            

            _postgreContext.Entry(existingNoticia).CurrentValues.SetValues(noticia);
            _postgreContext.SaveChanges();

            return Task.CompletedTask;
        }
    }
}
