using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces
{
    public interface INoticiaRepository
    {
        Task<Noticia> GetAsync(Guid id);
        Task<List<Noticia>> GetAllAsync();
        Task AddAsync(Noticia noticia);
        Task DeleteAsync(Guid id);
    }
}
