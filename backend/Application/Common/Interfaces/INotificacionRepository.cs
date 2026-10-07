using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Common.Interfaces
{
    public interface INotificacionRepository
    {
        Task<Notificacion> GetAsync(Guid id, CancellationToken cancellationToken);
        Task<List<Notificacion>> GetAllAsync(int? offset, int? limit, CancellationToken cancellationToken);
        Task<List<Notificacion>> GetByCategoriaAsync(Guid categoriaId, int? offset, int? limit, CancellationToken cancellationToken);
        Task<List<Notificacion>> GetByTagAsync(Guid tagId, int? offset, int? limit, CancellationToken cancellationToken);
        Task<List<Notificacion>> GetByCategoriaAndTagAsync(Guid categoriaId, Guid tagId, int? offset, int? limit, CancellationToken cancellationToken);
        Task<Notificacion> GetTrackedAsync(Guid id, CancellationToken cancellationToken);
        Task<Notificacion> AddAsync(Notificacion notificacion, CancellationToken cancellationToken);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken);
        Task UpdateAsync(Notificacion notificacion, CancellationToken cancellationToken);
    }
}
