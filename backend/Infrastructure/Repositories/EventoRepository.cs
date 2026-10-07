using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class EventoRepository : IEventoRepository
    {
        private readonly PostgreContext _postgreContext;

        public EventoRepository(PostgreContext postgreContext)
        {
            _postgreContext = postgreContext;
        }

        public async Task<Evento> AddAsync(Evento evento, CancellationToken cancellationToken)
        {
            if (evento.Id == Guid.Empty)
                evento.Id = Guid.NewGuid();

            if (evento.FechaInicio.Kind != DateTimeKind.Utc)
                evento.FechaInicio = DateTime.SpecifyKind(evento.FechaInicio, DateTimeKind.Utc);

            if (evento.FechaFin.HasValue && evento.FechaFin.Value.Kind != DateTimeKind.Utc)
                evento.FechaFin = DateTime.SpecifyKind(evento.FechaFin.Value, DateTimeKind.Utc);

            var addedEvento = await _postgreContext.Eventos.AddAsync(evento, cancellationToken);
            await _postgreContext.SaveChangesAsync(cancellationToken);
            return addedEvento.Entity;
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var evento = await this.GetTrackedAsync(id, cancellationToken);
            _postgreContext.Eventos.Remove(evento);
            await _postgreContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<Evento>> GetAllAsync(int? offset, int? limit, bool? publicada, string orderBy, bool descending, CancellationToken cancellationToken)
        {
            var query = _postgreContext.Eventos
                .Include(x => x.Categorias)
                .Include(x => x.Tags)
                .AsNoTracking()
                .AsQueryable();

            if (publicada.HasValue)
                query = query.Where(x => x.Publicada == publicada.Value);

            query = ApplyOrdering(query, orderBy, descending);

            return await query
                .Skip(offset ?? 0)
                .Take(limit ?? int.MaxValue)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Evento>> GetByCategoriaAsync(Guid categoriaId, int? offset, int? limit, bool? publicada, string orderBy, bool descending, CancellationToken cancellationToken)
        {
            var query = _postgreContext.Eventos
                .Include(x => x.Categorias)
                .Include(x => x.Tags)
                .AsNoTracking()
                .Where(x => x.Categorias.Any(c => c.Id == categoriaId));

            if (publicada.HasValue)
                query = query.Where(x => x.Publicada == publicada.Value);

            query = ApplyOrdering(query, orderBy, descending);

            return await query
                .Skip(offset ?? 0)
                .Take(limit ?? int.MaxValue)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Evento>> GetByTagAsync(Guid tagId, int? offset, int? limit, bool? publicada, string orderBy, bool descending, CancellationToken cancellationToken)
        {
            var query = _postgreContext.Eventos
                .Include(x => x.Categorias)
                .Include(x => x.Tags)
                .AsNoTracking()
                .Where(x => x.Tags.Any(t => t.Id == tagId));

            if (publicada.HasValue)
                query = query.Where(x => x.Publicada == publicada.Value);

            query = ApplyOrdering(query, orderBy, descending);

            return await query
                .Skip(offset ?? 0)
                .Take(limit ?? int.MaxValue)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Evento>> GetByCategoriaAndTagAsync(Guid categoriaId, Guid tagId, int? offset, int? limit, bool? publicada, string orderBy, bool descending, CancellationToken cancellationToken)
        {
            var query = _postgreContext.Eventos
                .Include(x => x.Categorias)
                .Include(x => x.Tags)
                .AsNoTracking()
                .Where(x => x.Categorias.Any(c => c.Id == categoriaId) && x.Tags.Any(t => t.Id == tagId));

            if (publicada.HasValue)
                query = query.Where(x => x.Publicada == publicada.Value);

            query = ApplyOrdering(query, orderBy, descending);

            return await query
                .Skip(offset ?? 0)
                .Take(limit ?? int.MaxValue)
                .ToListAsync(cancellationToken);
        }

        private static IQueryable<Evento> ApplyOrdering(IQueryable<Evento> query, string orderBy, bool descending)
        {
            if (string.Equals(orderBy, "titulo", StringComparison.OrdinalIgnoreCase))
                return descending ? query.OrderByDescending(x => x.Titulo) : query.OrderBy(x => x.Titulo);

            return descending
                ? query.OrderByDescending(x => x.LastModifiedAt ?? x.CreatedAt)
                : query.OrderBy(x => x.LastModifiedAt ?? x.CreatedAt);
        }

        public async Task<Evento> GetAsync(Guid id, CancellationToken cancellationToken)
        {
            var evento = await _postgreContext.Eventos
                .Include(x => x.Categorias)
                .Include(x => x.Tags)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

            if (evento is null)
            {
                throw new KeyNotFoundException("No se han encontrado eventos con los parámetros proporcionados");
            }

            return evento;
        }

        public async Task<Evento> GetTrackedAsync(Guid id, CancellationToken cancellationToken)
        {
            var evento = await _postgreContext.Eventos
                .Include(x => x.Categorias)
                .Include(x => x.Tags)
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

            if (evento is null)
            {
                throw new KeyNotFoundException("No se han encontrado eventos con los parámetros proporcionados");
            }

            return evento;
        }

        public async Task UpdateAsync(Evento evento, CancellationToken cancellationToken)
        {
            if (evento is null)
                throw new ArgumentNullException(nameof(evento), "El evento no puede ser nulo");

            var tracked = _postgreContext.ChangeTracker.Entries<Evento>()
                .FirstOrDefault(e => e.Entity.Id == evento.Id);

            if (tracked is null)
                throw new InvalidOperationException("El evento debe cargarse con GetTrackedAsync antes de actualizarlo.");

            await _postgreContext.SaveChangesAsync(cancellationToken);
        }
    }
}
