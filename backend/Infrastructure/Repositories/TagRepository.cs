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

        public async Task<List<Tag>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _postgreContext.Tags.AsNoTracking().ToListAsync(cancellationToken);
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
