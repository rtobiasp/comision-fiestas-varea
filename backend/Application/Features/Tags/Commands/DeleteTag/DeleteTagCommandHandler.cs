using Application.Common.Interfaces;

namespace Application.Features.Tags.Commands.DeleteTag
{
    public class DeleteTagCommandHandler
    {
        private readonly ITagRepository _tagRepository;

        public DeleteTagCommandHandler(ITagRepository tagRepository)
        {
            _tagRepository = tagRepository;
        }

        public async Task Handle(
            DeleteTagCommand request,
            CancellationToken cancellationToken)
        {
            await _tagRepository.DeleteAsync(request.Id, cancellationToken);
        }
    }
}
