using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Common.Interfaces
{
    public interface INoticiaRepository
    {
        Task<Noticia> GetAsync(string id);
        Task<List<Noticia>> GetAllAsync();
        Task<Noticia> AddAsync(Noticia noticia);
        Task DeleteAsync(string id);
        Task UpdateAsync(Noticia noticia);
    }
}
