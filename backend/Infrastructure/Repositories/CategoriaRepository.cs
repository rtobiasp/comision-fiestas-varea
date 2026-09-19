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
