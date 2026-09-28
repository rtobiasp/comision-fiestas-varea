using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Common.Interfaces
{
    public interface INoticiaRepository
    {
        Task<Noticia> GetAsync(Guid id, CancellationToken cancellationToken);
        Task<List<Noticia>> GetAllAsync(int? offset, int? limit, CancellationToken cancellationToken);
        Task<List<Noticia>> GetByCategoriaAsync(Guid categoriaId, int? offset, int? limit, CancellationToken cancellationToken);
        Task<List<Noticia>> GetByTagAsync(Guid tagId, int? offset, int? limit, CancellationToken cancellationToken);
        Task<List<Noticia>> GetByCategoriaAndTagAsync(Guid categoriaId, Guid tagId, int? offset, int? limit, CancellationToken cancellationToken);
        Task<Noticia> GetTrackedAsync(Guid id, CancellationToken cancellationToken);
        Task<Noticia> AddAsync(Noticia noticia, CancellationToken cancellationToken);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken);
        Task UpdateAsync(Noticia noticia, CancellationToken cancellationToken);
    }
}
