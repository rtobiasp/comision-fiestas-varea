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
            if (await _tagRepository.HasNoticiasAsync(request.Id, cancellationToken))
            {
                throw new InvalidOperationException("No se puede eliminar el tag porque tiene noticias asociadas.");
            }

            await _tagRepository.DeleteAsync(request.Id, cancellationToken);
        }
    }
}
