using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repositories
{
    public class TagRepository : ITagRepository
    {
        private readonly PostgreContext _postgreContext;

        public TagRepository(PostgreContext postgreContext)
        {
            _postgreContext = postgreContext;
        }

        public async Task<Tag> AddAsync(Tag tag, CancellationToken cancellationToken)
        {
            if (tag.Id == Guid.Empty)
                tag.Id = Guid.NewGuid();

            var addedTag = await _postgreContext.Tags.AddAsync(tag, cancellationToken);
            await _postgreContext.SaveChangesAsync(cancellationToken);

            return addedTag.Entity;
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var tag = await this.GetAsync(id, cancellationToken);
            _postgreContext.Tags.Remove(tag);
            await _postgreContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<Tag>> GetAllAsync(string orderBy, bool descending, CancellationToken cancellationToken)
        {
            var query = _postgreContext.Tags.AsNoTracking().AsQueryable();

            query = ApplyOrdering(query, orderBy, descending);

            return await query.ToListAsync(cancellationToken);
        }

        public async Task<Tag> GetAsync(Guid id, CancellationToken cancellationToken)
        {
            var tag = await _postgreContext.Tags.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

            if (tag is null)
            {
                throw new KeyNotFoundException("No se han encontrado tags con los parámetros proporcionados");
            }

            return tag;
        }

        public async Task<List<Tag>> GetByIdsAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken)
        {
            var distinctIds = ids.Distinct().ToList();

            if (distinctIds.Count == 0)
                return new List<Tag>();

            return await _postgreContext.Tags
                .Where(t => distinctIds.Contains(t.Id))
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Tag>> SearchAsync(string prefix, string orderBy, bool descending, CancellationToken cancellationToken)
        {
            var normalized = Tag.NormalizeNombre(prefix);

            var query = _postgreContext.Tags
                .AsNoTracking()
                .Where(t => t.Nombre.StartsWith(normalized));

            query = ApplyOrdering(query, orderBy, descending);

            return await query.ToListAsync(cancellationToken);
        }

        private static IQueryable<Tag> ApplyOrdering(IQueryable<Tag> query, string orderBy, bool descending)
        {
            if (string.Equals(orderBy, "titulo", StringComparison.OrdinalIgnoreCase))
                return descending ? query.OrderByDescending(t => t.Nombre) : query.OrderBy(t => t.Nombre);

            return descending
                ? query.OrderByDescending(t => t.LastModifiedAt ?? t.CreatedAt)
                : query.OrderBy(t => t.LastModifiedAt ?? t.CreatedAt);
        }

        public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _postgreContext.Tags.AnyAsync(t => t.Id == id, cancellationToken);
        }

        public async Task<bool> HasNoticiasAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _postgreContext.Tags
                .AnyAsync(t => t.Id == id && t.Noticias.Any(), cancellationToken);
        }

        public async Task<int> CountNoticiasAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _postgreContext.Tags
                .Where(t => t.Id == id)
                .Select(t => t.Noticias.Count)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<Dictionary<Guid, int>> CountNoticiasByTagsAsync(CancellationToken cancellationToken)
        {
            return await _postgreContext.Tags
                .Select(t => new { t.Id, Count = t.Noticias.Count })
                .ToDictionaryAsync(x => x.Id, x => x.Count, cancellationToken);
        }

        public async Task UpdateAsync(Tag tag, CancellationToken cancellationToken)
        {
            if (tag is null)
                throw new ArgumentNullException(nameof(tag), "El tag no puede ser nulo");

            var existingTag = await _postgreContext.Tags.FirstOrDefaultAsync(t => t.Id == tag.Id, cancellationToken);

            if (existingTag is null)
                throw new KeyNotFoundException("No se han encontrado tags con los parámetros proporcionados");

            _postgreContext.Entry(existingTag).CurrentValues.SetValues(tag);
            await _postgreContext.SaveChangesAsync(cancellationToken);
        }
    }
}
