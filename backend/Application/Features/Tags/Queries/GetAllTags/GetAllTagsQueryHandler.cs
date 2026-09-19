using Application.Common.Interfaces;
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

        public async Task<List<Tag>> Handle(
            GetAllTagsQuery request,
            CancellationToken cancellationToken)
        {
            var tags = await _tagRepository.GetAllAsync(cancellationToken);
            return tags;
        }
    }
}
