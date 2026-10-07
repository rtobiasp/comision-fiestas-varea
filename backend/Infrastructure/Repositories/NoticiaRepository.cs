using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
namespace Infrastructure.Repositories
{
    public class NoticiaRepository : INoticiaRepository
    {
        private readonly PostgreContext _postgreContext;

        public NoticiaRepository(PostgreContext postgreContext)
        {
            _postgreContext = postgreContext;
        }

        public async Task<Noticia> AddAsync(Noticia noticia, CancellationToken cancellationToken)
        {
            if (noticia.Id == Guid.Empty)
                noticia.Id = Guid.NewGuid();

            var addedNoticia = await _postgreContext.Noticias.AddAsync(noticia, cancellationToken);
            await _postgreContext.SaveChangesAsync(cancellationToken);
            return addedNoticia.Entity;
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var noticia = await this.GetTrackedAsync(id, cancellationToken);
            _postgreContext.Noticias.Remove(noticia);
            await _postgreContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<Noticia>> GetAllAsync(int? offset, int? limit, bool? publicada, string orderBy, bool descending, CancellationToken cancellationToken)
        {
            var query = _postgreContext.Noticias
                .Include(n => n.Categorias)
                .Include(n => n.Tags)
                .AsNoTracking()
                .AsQueryable();

            if (publicada.HasValue)
                query = query.Where(n => n.Publicada == publicada.Value);

            query = ApplyOrdering(query, orderBy, descending);

            return await query
                .Skip(offset ?? 0)
                .Take(limit ?? int.MaxValue)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Noticia>> GetByCategoriaAsync(Guid categoriaId, int? offset, int? limit, bool? publicada, string orderBy, bool descending, CancellationToken cancellationToken)
        {
            var query = _postgreContext.Noticias
                .Include(n => n.Categorias)
                .Include(n => n.Tags)
                .AsNoTracking()
                .Where(n => n.Categorias.Any(c => c.Id == categoriaId));

            if (publicada.HasValue)
                query = query.Where(n => n.Publicada == publicada.Value);

            query = ApplyOrdering(query, orderBy, descending);

            return await query
                .Skip(offset ?? 0)
                .Take(limit ?? int.MaxValue)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Noticia>> GetByTagAsync(Guid tagId, int? offset, int? limit, bool? publicada, string orderBy, bool descending, CancellationToken cancellationToken)
        {
            var query = _postgreContext.Noticias
                .Include(n => n.Categorias)
                .Include(n => n.Tags)
                .AsNoTracking()
                .Where(n => n.Tags.Any(t => t.Id == tagId));

            if (publicada.HasValue)
                query = query.Where(n => n.Publicada == publicada.Value);

            query = ApplyOrdering(query, orderBy, descending);

            return await query
                .Skip(offset ?? 0)
                .Take(limit ?? int.MaxValue)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Noticia>> GetByCategoriaAndTagAsync(Guid categoriaId, Guid tagId, int? offset, int? limit, bool? publicada, string orderBy, bool descending, CancellationToken cancellationToken)
        {
            var query = _postgreContext.Noticias
                .Include(n => n.Categorias)
                .Include(n => n.Tags)
                .AsNoTracking()
                .Where(n => n.Categorias.Any(c => c.Id == categoriaId) && n.Tags.Any(t => t.Id == tagId));

            if (publicada.HasValue)
                query = query.Where(n => n.Publicada == publicada.Value);

            query = ApplyOrdering(query, orderBy, descending);

            return await query
                .Skip(offset ?? 0)
                .Take(limit ?? int.MaxValue)
                .ToListAsync(cancellationToken);
        }

        private static IQueryable<Noticia> ApplyOrdering(IQueryable<Noticia> query, string orderBy, bool descending)
        {
            if (string.Equals(orderBy, "titulo", StringComparison.OrdinalIgnoreCase))
                return descending ? query.OrderByDescending(n => n.Titulo) : query.OrderBy(n => n.Titulo);

            return descending
                ? query.OrderByDescending(n => n.LastModifiedAt ?? n.CreatedAt)
                : query.OrderBy(n => n.LastModifiedAt ?? n.CreatedAt);
        }

        public async Task<Noticia> GetAsync(Guid id, CancellationToken cancellationToken)
        {
            var noticia = await _postgreContext.Noticias
                .Include(n => n.Categorias)
                .Include(n => n.Tags)
                .AsNoTracking()
                .FirstOrDefaultAsync(n => n.Id == id, cancellationToken);

            if (noticia is null)
            {
                throw new KeyNotFoundException("No se han encontrado noticias con los parámetros proporcionados");
            }

            return noticia;
        }

        public async Task<Noticia> GetTrackedAsync(Guid id, CancellationToken cancellationToken)
        {
            var noticia = await _postgreContext.Noticias
                .Include(n => n.Categorias)
                .Include(n => n.Tags)
                .FirstOrDefaultAsync(n => n.Id == id, cancellationToken);

            if (noticia is null)
            {
                throw new KeyNotFoundException("No se han encontrado noticias con los parámetros proporcionados");
            }

            return noticia;
        }

        public async Task UpdateAsync(Noticia noticia, CancellationToken cancellationToken)
        {
            if (noticia is null)
                throw new ArgumentNullException(nameof(noticia), "La noticia no puede ser nula");

            var tracked = _postgreContext.ChangeTracker.Entries<Noticia>()
                .FirstOrDefault(e => e.Entity.Id == noticia.Id);

            if (tracked is null)
                throw new InvalidOperationException("La noticia debe cargarse con GetTrackedAsync antes de actualizarla.");

            await _postgreContext.SaveChangesAsync(cancellationToken);

        }
    }
}
