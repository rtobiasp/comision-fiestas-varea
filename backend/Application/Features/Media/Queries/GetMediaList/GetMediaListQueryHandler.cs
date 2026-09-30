using Application.Common.Interfaces;
using Application.Features.Media.Dtos;

namespace Application.Features.Media.Queries.GetMediaList
{
    public class GetMediaListQueryHandler
    {
        private readonly IMediaAssetRepository _mediaAssetRepository;

        public GetMediaListQueryHandler(IMediaAssetRepository mediaAssetRepository)
        {
            _mediaAssetRepository = mediaAssetRepository;
        }

        public async Task<List<MediaDto>> Handle(
            GetMediaListQuery request,
            CancellationToken cancellationToken)
        {
            var assets = await _mediaAssetRepository.GetPagedAsync(
                request.Tipo, request.Offset, request.Limit, cancellationToken);

            return assets.Select(MediaMapper.ToDto).ToList();
        }
    }
}
