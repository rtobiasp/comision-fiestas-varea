using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Common.Interfaces
{
    public interface IEventoProgramacionRepository
    {
        Task<EventoProgramacion> GetAsync(Guid id, CancellationToken cancellationToken);
        Task<List<EventoProgramacion>> GetByDiaAsync(Guid diaId, int? offset, int? limit, bool descending, CancellationToken cancellationToken);
        Task<EventoProgramacion> GetTrackedAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken);
        Task<EventoProgramacion> AddAsync(Guid diaId, EventoProgramacion evento, CancellationToken cancellationToken);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken);
        Task UpdateAsync(EventoProgramacion evento, CancellationToken cancellationToken);
    }
}
