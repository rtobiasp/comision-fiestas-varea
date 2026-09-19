using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Common.Interfaces
{
    public interface ITagRepository
    {
        public Task<List<Tag>> GetAllAsync(CancellationToken cancellationToken);
        public Task<Tag> GetAsync(Guid id, CancellationToken cancellationToken);
        public Task<Tag> AddAsync(Tag tag, CancellationToken cancellationToken);
        public Task UpdateAsync(Tag tag, CancellationToken cancellationToken);
        public Task DeleteAsync(Guid id, CancellationToken cancellationToken);
    }
}
