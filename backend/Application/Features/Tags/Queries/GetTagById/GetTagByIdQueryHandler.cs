using Application.Common.Interfaces;
using Domain.Entities;

namespace Application.Features.Tags.Queries.GetTagById
{
    public class GetTagByIdQueryHandler
    {
        private readonly ITagRepository _tagRepository;

        public GetTagByIdQueryHandler(ITagRepository tagRepository)
        {
            _tagRepository = tagRepository;
        }

        public async Task<Tag> Handle(
            GetTagByIdQuery request,
            CancellationToken cancellationToken)
        {
            return await _tagRepository.GetAsync(request.Id, cancellationToken);
        }
    }
}
