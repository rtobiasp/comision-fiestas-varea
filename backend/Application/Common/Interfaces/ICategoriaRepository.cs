using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Common.Interfaces
{
    public interface ICategoriaRepository
    {
        public Task<List<Categoria>> GetAllAsync(CancellationToken cancellationToken);
        public Task<Categoria> GetAsync(Guid id, CancellationToken cancellationToken);
        public Task<Categoria> AddAsync(Categoria categoria, CancellationToken cancellationToken);
        public Task UpdateAsync(Categoria categoria, CancellationToken cancellationToken);
        public Task DeleteAsync(Guid id, CancellationToken cancellationToken);
    }
}
