using Application.Interfaces;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repositories
{
    public class NoticiaRepository : INoticiaRepository
    {

        private static readonly List<Noticia> _noticias = new (){
            new Noticia(Guid.NewGuid(), "Noticia 1", "Contenido de la noticia 1", "Autor 1"),
            new Noticia(Guid.NewGuid(), "Noticia 2", "Contenido de la noticia 2", "Autor 2"),
            new Noticia(Guid.NewGuid(), "Noticia 3", "Contenido de la noticia 3", "Autor 3")
        };
        public Task AddAsync(Noticia noticia)
        {
            _noticias.Add(noticia);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<List<Noticia>> GetAllAsync()
        {
            var noticias = _noticias;
            return Task.FromResult(noticias);
        }

        public Task<Noticia> GetAsync(Guid id)
        {
            return Task.FromResult(_noticias.FirstOrDefault(n => n.Id == id));
        }
    }
}
