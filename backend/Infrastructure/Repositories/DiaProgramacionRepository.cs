using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class DiaProgramacionRepository : IDiaProgramacionRepository
    {
        private readonly PostgreContext _postgreContext;

        public DiaProgramacionRepository(PostgreContext postgreContext)
        {
            _postgreContext = postgreContext;
        }

        public async Task<DiaProgramacion> AddAsync(Guid programacionId, DiaProgramacion dia, CancellationToken cancellationToken)
        {
            if (dia.Id == Guid.Empty)
                dia.Id = Guid.NewGuid();

            if (dia.Fecha.Kind != DateTimeKind.Utc)
                dia.Fecha = DateTime.SpecifyKind(dia.Fecha, DateTimeKind.Utc);

            foreach (var evento in dia.Eventos)
            {
                if (evento.Id == Guid.Empty)
                    evento.Id = Guid.NewGuid();

                if (evento.FechaInicio.Kind != DateTimeKind.Utc)
                    evento.FechaInicio = DateTime.SpecifyKind(evento.FechaInicio, DateTimeKind.Utc);
            }

            var addedDia = await _postgreContext.DiasProgramacion.AddAsync(dia, cancellationToken);
            _postgreContext.Entry(addedDia.Entity).Property("ProgramacionId").CurrentValue = programacionId;
            await _postgreContext.SaveChangesAsync(cancellationToken);
            return addedDia.Entity;
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var dia = await this.GetTrackedAsync(id, cancellationToken);
            _postgreContext.DiasProgramacion.Remove(dia);
            await _postgreContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<DiaProgramacion>> GetByProgramacionAsync(Guid programacionId, int? offset, int? limit, bool descending, CancellationToken cancellationToken)
        {
            var query = _postgreContext.DiasProgramacion
                .Include(d => d.Eventos)
                .AsNoTracking()
                .Where(d => EF.Property<Guid>(d, "ProgramacionId") == programacionId);

            query = descending ? query.OrderByDescending(d => d.Fecha) : query.OrderBy(d => d.Fecha);

            return await query
                .Skip(offset ?? 0)
                .Take(limit ?? int.MaxValue)
                .ToListAsync(cancellationToken);
        }

        public async Task<DiaProgramacion> GetAsync(Guid id, CancellationToken cancellationToken)
        {
            var dia = await _postgreContext.DiasProgramacion
                .Include(d => d.Eventos)
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

            if (dia is null)
            {
                throw new KeyNotFoundException("No se han encontrado días con los parámetros proporcionados");
            }

            return dia;
        }

        public async Task<DiaProgramacion> GetTrackedAsync(Guid id, CancellationToken cancellationToken)
        {
            var dia = await _postgreContext.DiasProgramacion
                .Include(d => d.Eventos)
                .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);

            if (dia is null)
            {
                throw new KeyNotFoundException("No se han encontrado días con los parámetros proporcionados");
            }

            return dia;
        }

        public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _postgreContext.DiasProgramacion.AnyAsync(d => d.Id == id, cancellationToken);
        }

        public async Task UpdateAsync(DiaProgramacion dia, CancellationToken cancellationToken)
        {
            if (dia is null)
                throw new ArgumentNullException(nameof(dia), "El día no puede ser nulo");

            var tracked = _postgreContext.ChangeTracker.Entries<DiaProgramacion>()
                .FirstOrDefault(e => e.Entity.Id == dia.Id);

            if (tracked is null)
                throw new InvalidOperationException("El día debe cargarse con GetTrackedAsync antes de actualizarlo.");

            await _postgreContext.SaveChangesAsync(cancellationToken);
        }
    }
}
