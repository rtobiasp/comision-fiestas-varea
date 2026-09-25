using Application.Common.Interfaces;
using Application.Features.Tags.Dtos;

namespace Application.Features.Tags.Queries.GetTagById
{
    public class GetTagByIdQueryHandler
    {
        private readonly ITagRepository _tagRepository;

        public GetTagByIdQueryHandler(ITagRepository tagRepository)
        {
            _tagRepository = tagRepository;
        }

        public async Task<TagDto> Handle(
            GetTagByIdQuery request,
            CancellationToken cancellationToken)
        {
            var tag = await _tagRepository.GetAsync(request.Id, cancellationToken);
            return new TagDto(
                tag.Id,
                tag.Nombre,
                tag.CreatedAt,
                tag.CreatedBy
            );
        }
    }
}
