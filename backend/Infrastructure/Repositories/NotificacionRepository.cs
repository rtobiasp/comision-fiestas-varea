using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class NotificacionRepository : INotificacionRepository
    {
        private readonly PostgreContext _postgreContext;

        public NotificacionRepository(PostgreContext postgreContext)
        {
            _postgreContext = postgreContext;
        }

        public async Task<Notificacion> AddAsync(Notificacion notificacion, CancellationToken cancellationToken)
        {
            if (notificacion.Id == Guid.Empty)
                notificacion.Id = Guid.NewGuid();

            if (notificacion.FechaCaducidad.HasValue && notificacion.FechaCaducidad.Value.Kind != DateTimeKind.Utc)
                notificacion.FechaCaducidad = DateTime.SpecifyKind(notificacion.FechaCaducidad.Value, DateTimeKind.Utc);

            var addedNotificacion = await _postgreContext.Notificaciones.AddAsync(notificacion, cancellationToken);
            await _postgreContext.SaveChangesAsync(cancellationToken);
            return addedNotificacion.Entity;
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var notificacion = await this.GetTrackedAsync(id, cancellationToken);
            _postgreContext.Notificaciones.Remove(notificacion);
            await _postgreContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<Notificacion>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _postgreContext.Notificaciones
                .Include(x => x.Categorias)
                .Include(x => x.Tags)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Notificacion>> GetByCategoriaAsync(Guid categoriaId, CancellationToken cancellationToken)
        {
            return await _postgreContext.Notificaciones
                .Include(x => x.Categorias)
                .Include(x => x.Tags)
                .AsNoTracking()
                .Where(x => x.Categorias.Any(c => c.Id == categoriaId))
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Notificacion>> GetByTagAsync(Guid tagId, CancellationToken cancellationToken)
        {
            return await _postgreContext.Notificaciones
                .Include(x => x.Categorias)
                .Include(x => x.Tags)
                .AsNoTracking()
                .Where(x => x.Tags.Any(t => t.Id == tagId))
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Notificacion>> GetByCategoriaAndTagAsync(Guid categoriaId, Guid tagId, CancellationToken cancellationToken)
        {
            return await _postgreContext.Notificaciones
                .Include(x => x.Categorias)
                .Include(x => x.Tags)
                .AsNoTracking()
                .Where(x => x.Categorias.Any(c => c.Id == categoriaId) && x.Tags.Any(t => t.Id == tagId))
                .ToListAsync(cancellationToken);
        }

        public async Task<Notificacion> GetAsync(Guid id, CancellationToken cancellationToken)
        {
            var notificacion = await _postgreContext.Notificaciones
                .Include(x => x.Categorias)
                .Include(x => x.Tags)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

            if (notificacion is null)
            {
                throw new KeyNotFoundException("No se han encontrado notificaciones con los parámetros proporcionados");
            }

            return notificacion;
        }

        public async Task<Notificacion> GetTrackedAsync(Guid id, CancellationToken cancellationToken)
        {
            var notificacion = await _postgreContext.Notificaciones
                .Include(x => x.Categorias)
                .Include(x => x.Tags)
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

            if (notificacion is null)
            {
                throw new KeyNotFoundException("No se han encontrado notificaciones con los parámetros proporcionados");
            }

            return notificacion;
        }

        public async Task UpdateAsync(Notificacion notificacion, CancellationToken cancellationToken)
        {
            if (notificacion is null)
                throw new ArgumentNullException(nameof(notificacion), "La notificación no puede ser nula");

            var tracked = _postgreContext.ChangeTracker.Entries<Notificacion>()
                .FirstOrDefault(e => e.Entity.Id == notificacion.Id);

            if (tracked is null)
                throw new InvalidOperationException("La notificación debe cargarse con GetTrackedAsync antes de actualizarla.");

            await _postgreContext.SaveChangesAsync(cancellationToken);
        }
    }
}
