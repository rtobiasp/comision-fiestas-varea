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
        public Task<List<Tag>> GetByIdsAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken);
        public Task<List<Tag>> SearchAsync(string prefix, CancellationToken cancellationToken);
        public Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken);
        public Task<bool> HasNoticiasAsync(Guid id, CancellationToken cancellationToken);
        public Task<int> CountNoticiasAsync(Guid id, CancellationToken cancellationToken);
        public Task<Dictionary<Guid, int>> CountNoticiasByTagsAsync(CancellationToken cancellationToken);
        public Task<Tag> AddAsync(Tag tag, CancellationToken cancellationToken);
        public Task UpdateAsync(Tag tag, CancellationToken cancellationToken);
        public Task DeleteAsync(Guid id, CancellationToken cancellationToken);
    }
}
