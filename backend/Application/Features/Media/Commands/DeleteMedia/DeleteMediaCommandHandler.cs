using Application.Common.Interfaces;

namespace Application.Features.Media.Commands.DeleteMedia
{
    public class DeleteMediaCommandHandler
    {
        private readonly IMediaAssetRepository _mediaAssetRepository;
        private readonly IStorageService _storageService;

        public DeleteMediaCommandHandler(
            IMediaAssetRepository mediaAssetRepository,
            IStorageService storageService)
        {
            _mediaAssetRepository = mediaAssetRepository;
            _storageService = storageService;
        }

        public async Task Handle(
            DeleteMediaCommand request,
            CancellationToken cancellationToken)
        {
            var mediaAsset = await _mediaAssetRepository.GetTrackedAsync(request.Id, cancellationToken);
            await _mediaAssetRepository.DeleteAsync(request.Id, cancellationToken);
            await _storageService.DeleteAsync(mediaAsset.StorageKey, cancellationToken);
        }
    }
}
