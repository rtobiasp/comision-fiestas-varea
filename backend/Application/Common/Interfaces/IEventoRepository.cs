using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Common.Interfaces
{
    public interface IEventoRepository
    {
        Task<Evento> GetAsync(Guid id, CancellationToken cancellationToken);
        Task<List<Evento>> GetAllAsync(int? offset, int? limit, bool? publicada, string orderBy, bool descending, CancellationToken cancellationToken);
        Task<List<Evento>> GetByCategoriaAsync(Guid categoriaId, int? offset, int? limit, bool? publicada, string orderBy, bool descending, CancellationToken cancellationToken);
        Task<List<Evento>> GetByTagAsync(Guid tagId, int? offset, int? limit, bool? publicada, string orderBy, bool descending, CancellationToken cancellationToken);
        Task<List<Evento>> GetByCategoriaAndTagAsync(Guid categoriaId, Guid tagId, int? offset, int? limit, bool? publicada, string orderBy, bool descending, CancellationToken cancellationToken);
        Task<Evento> GetTrackedAsync(Guid id, CancellationToken cancellationToken);
        Task<Evento> AddAsync(Evento evento, CancellationToken cancellationToken);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken);
        Task UpdateAsync(Evento evento, CancellationToken cancellationToken);
    }
}
