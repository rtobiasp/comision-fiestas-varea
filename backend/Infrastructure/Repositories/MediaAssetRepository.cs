using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class MediaAssetRepository : IMediaAssetRepository
    {
        private readonly PostgreContext _postgreContext;

        public MediaAssetRepository(PostgreContext postgreContext)
        {
            _postgreContext = postgreContext;
        }

        public async Task<MediaAsset> AddAsync(MediaAsset mediaAsset, CancellationToken cancellationToken)
        {
            if (mediaAsset.Id == Guid.Empty)
                mediaAsset.Id = Guid.NewGuid();

            var added = await _postgreContext.MediaAssets.AddAsync(mediaAsset, cancellationToken);
            await _postgreContext.SaveChangesAsync(cancellationToken);
            return added.Entity;
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var mediaAsset = await GetTrackedAsync(id, cancellationToken);
            _postgreContext.MediaAssets.Remove(mediaAsset);
            await _postgreContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<MediaAsset>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _postgreContext.MediaAssets
                .OrderByDescending(m => m.CreatedAt)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<List<MediaAsset>> GetPagedAsync(MediaTipo? tipo, int? offset, int? limit, CancellationToken cancellationToken)
        {
            var query = _postgreContext.MediaAssets.AsQueryable();

            if (tipo.HasValue)
                query = query.Where(m => m.Tipo == tipo.Value);

            return await query
                .OrderByDescending(m => m.CreatedAt)
                .Skip(offset ?? 0)
                .Take(limit ?? int.MaxValue)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<MediaAsset> GetAsync(Guid id, CancellationToken cancellationToken)
        {
            var mediaAsset = await _postgreContext.MediaAssets
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);

            if (mediaAsset is null)
            {
                throw new KeyNotFoundException("No se han encontrado archivos multimedia con los parámetros proporcionados");
            }

            return mediaAsset;
        }

        public async Task<MediaAsset> GetTrackedAsync(Guid id, CancellationToken cancellationToken)
        {
            var mediaAsset = await _postgreContext.MediaAssets
                .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);

            if (mediaAsset is null)
            {
                throw new KeyNotFoundException("No se han encontrado archivos multimedia con los parámetros proporcionados");
            }

            return mediaAsset;
        }

        public async Task UpdateAsync(MediaAsset mediaAsset, CancellationToken cancellationToken)
        {
            if (mediaAsset is null)
                throw new ArgumentNullException(nameof(mediaAsset), "El archivo multimedia no puede ser nulo");

            var tracked = _postgreContext.ChangeTracker.Entries<MediaAsset>()
                .FirstOrDefault(e => e.Entity.Id == mediaAsset.Id);

            if (tracked is null)
                throw new InvalidOperationException("El archivo multimedia debe cargarse con GetTrackedAsync antes de actualizarlo.");

            await _postgreContext.SaveChangesAsync(cancellationToken);
        }
    }
}
