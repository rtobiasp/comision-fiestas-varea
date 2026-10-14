using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Common.Interfaces
{
    public interface IDiaProgramacionRepository
    {
        Task<DiaProgramacion> GetAsync(Guid id, CancellationToken cancellationToken);
        Task<List<DiaProgramacion>> GetByProgramacionAsync(Guid programacionId, int? offset, int? limit, bool descending, CancellationToken cancellationToken);
        Task<DiaProgramacion> GetTrackedAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken);
        Task<DiaProgramacion> AddAsync(Guid programacionId, DiaProgramacion dia, CancellationToken cancellationToken);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken);
        Task UpdateAsync(DiaProgramacion dia, CancellationToken cancellationToken);
    }
}
