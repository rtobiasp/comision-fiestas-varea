using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Common.Interfaces
{
    public interface IProgramacionRepository
    {
        Task<Programacion> GetAsync(Guid id, CancellationToken cancellationToken);
        Task<List<Programacion>> GetAllAsync(int? offset, int? limit, string orderBy, bool descending, CancellationToken cancellationToken);
        Task<Programacion> GetTrackedAsync(Guid id, CancellationToken cancellationToken);
        Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken);
        Task<Programacion> AddAsync(Programacion programacion, CancellationToken cancellationToken);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken);
        Task UpdateAsync(Programacion programacion, CancellationToken cancellationToken);
    }
}
