using Application.Common.Interfaces;
using Application.Features.Tags.Dtos;

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
            var tags = await _tagRepository.GetAllAsync(cancellationToken);
            return tags.Select(t => new TagDto(
                t.Id,
                t.Nombre,
                t.CreatedAt,
                t.CreatedBy
            )).ToList();
        }
    }
}
