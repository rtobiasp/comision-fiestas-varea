using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class EventoProgramacionRepository : IEventoProgramacionRepository
    {
        private readonly PostgreContext _postgreContext;

        public EventoProgramacionRepository(PostgreContext postgreContext)
        {
            _postgreContext = postgreContext;
        }

        public async Task<EventoProgramacion> AddAsync(Guid diaId, EventoProgramacion evento, CancellationToken cancellationToken)
        {
            if (evento.Id == Guid.Empty)
                evento.Id = Guid.NewGuid();

            if (evento.FechaInicio.Kind != DateTimeKind.Utc)
                evento.FechaInicio = DateTime.SpecifyKind(evento.FechaInicio, DateTimeKind.Utc);

            var addedEvento = await _postgreContext.EventosProgramacion.AddAsync(evento, cancellationToken);
            _postgreContext.Entry(addedEvento.Entity).Property("DiaProgramacionId").CurrentValue = diaId;
            await _postgreContext.SaveChangesAsync(cancellationToken);
            return addedEvento.Entity;
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var evento = await this.GetTrackedAsync(id, cancellationToken);
            _postgreContext.EventosProgramacion.Remove(evento);
            await _postgreContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<EventoProgramacion>> GetByDiaAsync(Guid diaId, int? offset, int? limit, bool descending, CancellationToken cancellationToken)
        {
            var query = _postgreContext.EventosProgramacion
                .AsNoTracking()
                .Where(e => EF.Property<Guid>(e, "DiaProgramacionId") == diaId);

            query = descending ? query.OrderByDescending(e => e.FechaInicio) : query.OrderBy(e => e.FechaInicio);

            return await query
                .Skip(offset ?? 0)
                .Take(limit ?? int.MaxValue)
                .ToListAsync(cancellationToken);
        }

        public async Task<EventoProgramacion> GetAsync(Guid id, CancellationToken cancellationToken)
        {
            var evento = await _postgreContext.EventosProgramacion
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

            if (evento is null)
            {
                throw new KeyNotFoundException("No se han encontrado eventos de la programación con los parámetros proporcionados");
            }

            return evento;
        }

        public async Task<EventoProgramacion> GetTrackedAsync(Guid id, CancellationToken cancellationToken)
        {
            var evento = await _postgreContext.EventosProgramacion
                .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

            if (evento is null)
            {
                throw new KeyNotFoundException("No se han encontrado eventos de la programación con los parámetros proporcionados");
            }

            return evento;
        }

        public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _postgreContext.EventosProgramacion.AnyAsync(e => e.Id == id, cancellationToken);
        }

        public async Task UpdateAsync(EventoProgramacion evento, CancellationToken cancellationToken)
        {
            if (evento is null)
                throw new ArgumentNullException(nameof(evento), "El evento no puede ser nulo");

            var tracked = _postgreContext.ChangeTracker.Entries<EventoProgramacion>()
                .FirstOrDefault(e => e.Entity.Id == evento.Id);

            if (tracked is null)
                throw new InvalidOperationException("El evento debe cargarse con GetTrackedAsync antes de actualizarlo.");

            await _postgreContext.SaveChangesAsync(cancellationToken);
        }
    }
}
