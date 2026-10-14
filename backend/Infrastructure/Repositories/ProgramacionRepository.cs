using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ProgramacionRepository : IProgramacionRepository
    {
        private readonly PostgreContext _postgreContext;

        public ProgramacionRepository(PostgreContext postgreContext)
        {
            _postgreContext = postgreContext;
        }

        public async Task<Programacion> AddAsync(Programacion programacion, CancellationToken cancellationToken)
        {
            if (programacion.Id == Guid.Empty)
                programacion.Id = Guid.NewGuid();

            var addedProgramacion = await _postgreContext.Programaciones.AddAsync(programacion, cancellationToken);
            await _postgreContext.SaveChangesAsync(cancellationToken);
            return addedProgramacion.Entity;
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var programacion = await this.GetTrackedAsync(id, cancellationToken);
            _postgreContext.Programaciones.Remove(programacion);
            await _postgreContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<Programacion>> GetAllAsync(int? offset, int? limit, string orderBy, bool descending, CancellationToken cancellationToken)
        {
            var query = _postgreContext.Programaciones
                .Include(p => p.Dias)
                    .ThenInclude(d => d.Eventos)
                .AsNoTracking()
                .AsQueryable();

            query = ApplyOrdering(query, orderBy, descending);

            return await query
                .Skip(offset ?? 0)
                .Take(limit ?? int.MaxValue)
                .ToListAsync(cancellationToken);
        }

        private static IQueryable<Programacion> ApplyOrdering(IQueryable<Programacion> query, string orderBy, bool descending)
        {
            if (string.Equals(orderBy, "nombre", StringComparison.OrdinalIgnoreCase))
                return descending ? query.OrderByDescending(p => p.Nombre) : query.OrderBy(p => p.Nombre);

            return descending
                ? query.OrderByDescending(p => p.LastModifiedAt ?? p.CreatedAt)
                : query.OrderBy(p => p.LastModifiedAt ?? p.CreatedAt);
        }

        public async Task<Programacion> GetAsync(Guid id, CancellationToken cancellationToken)
        {
            var programacion = await _postgreContext.Programaciones
                .Include(p => p.Dias)
                    .ThenInclude(d => d.Eventos)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

            if (programacion is null)
            {
                throw new KeyNotFoundException("No se han encontrado programaciones con los parámetros proporcionados");
            }

            return programacion;
        }

        public async Task<Programacion> GetTrackedAsync(Guid id, CancellationToken cancellationToken)
        {
            var programacion = await _postgreContext.Programaciones
                .Include(p => p.Dias)
                    .ThenInclude(d => d.Eventos)
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

            if (programacion is null)
            {
                throw new KeyNotFoundException("No se han encontrado programaciones con los parámetros proporcionados");
            }

            return programacion;
        }

        public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _postgreContext.Programaciones.AnyAsync(p => p.Id == id, cancellationToken);
        }

        public async Task UpdateAsync(Programacion programacion, CancellationToken cancellationToken)
        {
            if (programacion is null)
                throw new ArgumentNullException(nameof(programacion), "La programación no puede ser nula");

            var tracked = _postgreContext.ChangeTracker.Entries<Programacion>()
                .FirstOrDefault(e => e.Entity.Id == programacion.Id);

            if (tracked is null)
                throw new InvalidOperationException("La programación debe cargarse con GetTrackedAsync antes de actualizarla.");

            await _postgreContext.SaveChangesAsync(cancellationToken);
        }
    }
}
