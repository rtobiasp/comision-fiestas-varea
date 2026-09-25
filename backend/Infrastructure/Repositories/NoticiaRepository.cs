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

        public async Task<List<Noticia>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _postgreContext.Noticias
                .Include(n => n.Categorias)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Noticia>> GetByCategoriaAsync(Guid categoriaId, CancellationToken cancellationToken)
        {
            return await _postgreContext.Noticias
                .Include(n => n.Categorias)
                .AsNoTracking()
                .Where(n => n.Categorias.Any(c => c.Id == categoriaId))
                .ToListAsync(cancellationToken);
        }

        public async Task<Noticia> GetAsync(Guid id, CancellationToken cancellationToken)
        {
            var noticia = await _postgreContext.Noticias
                .Include(n => n.Categorias)
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

            // La entidad debe venir tracked de GetTrackedAsync, con sus escalares
            // ya modificados y la colección Categorias ya sincronizada por el
            // handler (entidades Categoria tracked del mismo DbContext). Aquí solo
            // se persiste: un SetValues ciego rompería la relación N:N porque no
            // toca navegaciones, y re-adjuntar una entidad detached marcaría las
            // categorías como Added (duplicados en el INSERT).
            var tracked = _postgreContext.ChangeTracker.Entries<Noticia>()
                .FirstOrDefault(e => e.Entity.Id == noticia.Id);

            if (tracked is null)
                throw new InvalidOperationException("La noticia debe cargarse con GetTrackedAsync antes de actualizarla.");

            await _postgreContext.SaveChangesAsync(cancellationToken);

        }
    }
}
