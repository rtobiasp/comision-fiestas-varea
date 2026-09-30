using Application.Common.Interfaces;
using Application.Features.Media.Dtos;

namespace Application.Features.Media.Queries.GetMediaById
{
    public class GetMediaByIdQueryHandler
    {
        private readonly IMediaAssetRepository _mediaAssetRepository;

        public GetMediaByIdQueryHandler(IMediaAssetRepository mediaAssetRepository)
        {
            _mediaAssetRepository = mediaAssetRepository;
        }

        public async Task<MediaDto> Handle(
            GetMediaByIdQuery request,
            CancellationToken cancellationToken)
        {
            var mediaAsset = await _mediaAssetRepository.GetAsync(request.Id, cancellationToken);
            return MediaMapper.ToDto(mediaAsset);
        }
    }
}
