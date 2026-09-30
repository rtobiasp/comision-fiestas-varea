using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Common.Interfaces
{
    public interface IMediaAssetRepository
    {
        Task<MediaAsset> GetAsync(Guid id, CancellationToken cancellationToken);
        Task<List<MediaAsset>> GetAllAsync(CancellationToken cancellationToken);
        Task<List<MediaAsset>> GetPagedAsync(MediaTipo? tipo, int? offset, int? limit, CancellationToken cancellationToken);
        Task<MediaAsset> GetTrackedAsync(Guid id, CancellationToken cancellationToken);
        Task<MediaAsset> AddAsync(MediaAsset mediaAsset, CancellationToken cancellationToken);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken);
        Task UpdateAsync(MediaAsset mediaAsset, CancellationToken cancellationToken);

    }
}
