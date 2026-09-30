using Application.Common.Interfaces;
using Domain.Entities;

namespace Infrastructure.Repositories
{
    public class MediaAssetRepository : IMediaAssetRepository
    {
        public Task<MediaAsset> AddAsync(MediaAsset mediaAsset, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<List<MediaAsset>> GetAllAsync(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<MediaAsset> GetAsync(Guid id, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<MediaAsset> GetTrackedAsync(Guid id, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(MediaAsset mediaAsset, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
