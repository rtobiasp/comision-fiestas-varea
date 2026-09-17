using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Common.Interfaces
{
    public interface INoticiaRepository
    {
        Task<Noticia> GetAsync(Guid id, CancellationToken cancellationToken);
        Task<List<Noticia>> GetAllAsync(CancellationToken cancellationToken);
        Task<Noticia> AddAsync(Noticia noticia, CancellationToken cancellationToken);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken);
        Task UpdateAsync(Noticia noticia, CancellationToken cancellationToken);
    }
}
