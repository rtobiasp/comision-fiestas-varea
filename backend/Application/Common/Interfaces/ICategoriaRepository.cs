using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Common.Interfaces
{
    public interface ICategoriaRepository
    {
        public Task<List<Categoria>> GetAllAsync(string orderBy, bool descending, CancellationToken cancellationToken);
        public Task<Categoria> GetAsync(Guid id, CancellationToken cancellationToken);
        public Task<List<Categoria>> GetByIdsAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken);
        public Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken);
        public Task<bool> HasNoticiasAsync(Guid id, CancellationToken cancellationToken);
        public Task<int> CountNoticiasAsync(Guid id, CancellationToken cancellationToken);
        public Task<Dictionary<Guid, int>> CountNoticiasByCategoriasAsync(CancellationToken cancellationToken);
        public Task<Categoria> AddAsync(Categoria categoria, CancellationToken cancellationToken);
        public Task UpdateAsync(Categoria categoria, CancellationToken cancellationToken);
        public Task DeleteAsync(Guid id, CancellationToken cancellationToken);
    }
}
