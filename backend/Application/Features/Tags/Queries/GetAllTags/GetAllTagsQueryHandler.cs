using Application.Common.Interfaces;
using Application.Features.Tags.Dtos;
using Domain.Entities;

namespace Application.Features.Tags.Queries.GetAllTags
{
    public class GetAllTagsQueryHandler
    {
        private readonly ITagRepository _tagRepository;

        public GetAllTagsQueryHandler(ITagRepository tagRepository)
        {
            _tagRepository = tagRepository;
        }

        public async Task<List<TagDto>> Handle(
            GetAllTagsQuery request,
            CancellationToken cancellationToken)
        {
            List<Tag> tags;

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                tags = await _tagRepository.SearchAsync(request.Search, cancellationToken);
            }
            else
            {
                tags = await _tagRepository.GetAllAsync(cancellationToken);
            }

            var counts = await _tagRepository.CountNoticiasByTagsAsync(cancellationToken);
            return tags.Select(t => new TagDto(
                t.Id,
                t.Nombre,
                t.CreatedAt,
                t.CreatedBy,
                counts.TryGetValue(t.Id, out var count) ? count : 0
            )).ToList();
        }
    }
}
