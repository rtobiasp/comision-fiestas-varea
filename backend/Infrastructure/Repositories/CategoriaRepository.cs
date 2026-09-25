using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repositories
{
    public class CategoriaRepository : ICategoriaRepository
    {
        private readonly PostgreContext _postgreContext;

        public CategoriaRepository(PostgreContext postgreContext)
        {
            _postgreContext = postgreContext;
        }

        public async Task<Categoria> AddAsync(Categoria categoria, CancellationToken cancellationToken)
        {
            if (categoria.Id == Guid.Empty)
                categoria.Id = Guid.NewGuid();

            var addedCategoria = await _postgreContext.Categorias.AddAsync(categoria, cancellationToken);
            await _postgreContext.SaveChangesAsync(cancellationToken);

            return addedCategoria.Entity;
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var categoria = await this.GetAsync(id, cancellationToken);
            _postgreContext.Categorias.Remove(categoria);
            await _postgreContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<Categoria>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _postgreContext.Categorias.AsNoTracking().ToListAsync(cancellationToken);
        }

        public async Task<Categoria> GetAsync(Guid id, CancellationToken cancellationToken)
        {
            var categoria = await _postgreContext.Categorias.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

            if (categoria is null)
            {
                throw new KeyNotFoundException("No se han encontrado categorías con los parámetros proporcionados");
            }

            return categoria;
        }

        public async Task<List<Categoria>> GetByIdsAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken)
        {
            var distinctIds = ids.Distinct().ToList();

            if (distinctIds.Count == 0)
                return new List<Categoria>();

            return await _postgreContext.Categorias
                .Where(c => distinctIds.Contains(c.Id))
                .ToListAsync(cancellationToken);
        }

        public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _postgreContext.Categorias.AnyAsync(c => c.Id == id, cancellationToken);
        }

        public async Task<bool> HasNoticiasAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _postgreContext.Categorias
                .AnyAsync(c => c.Id == id && c.Noticias.Any(), cancellationToken);
        }

        public async Task<int> CountNoticiasAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _postgreContext.Categorias
                .Where(c => c.Id == id)
                .Select(c => c.Noticias.Count)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<Dictionary<Guid, int>> CountNoticiasByCategoriasAsync(CancellationToken cancellationToken)
        {
            return await _postgreContext.Categorias
                .Select(c => new { c.Id, Count = c.Noticias.Count })
                .ToDictionaryAsync(x => x.Id, x => x.Count, cancellationToken);
        }

        public async Task UpdateAsync(Categoria categoria, CancellationToken cancellationToken)
        {
            if (categoria is null)
                throw new ArgumentNullException(nameof(categoria), "La categoría no puede ser nula");

            var existingCategoria = await _postgreContext.Categorias.FirstOrDefaultAsync(c => c.Id == categoria.Id, cancellationToken);

            if (existingCategoria is null)
                throw new KeyNotFoundException("No se han encontrado categorías con los parámetros proporcionados");


            _postgreContext.Entry(existingCategoria).CurrentValues.SetValues(categoria);
            await _postgreContext.SaveChangesAsync(cancellationToken);

        }
    }
}
