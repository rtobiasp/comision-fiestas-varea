using Application.Common.Interfaces;
using Domain.Entities;

namespace Application.Features.Tags.Commands.UpdateTag
{
    public class UpdateTagCommandHandler
    {
        private readonly ITagRepository _tagRepository;

        public UpdateTagCommandHandler(ITagRepository tagRepository)
        {
            _tagRepository = tagRepository;
        }

        public async Task Handle(
            UpdateTagCommand request,
            CancellationToken cancellationToken)
        {
            var existingTag = await _tagRepository.GetAsync(request.Id, cancellationToken);

            existingTag.Nombre = Tag.NormalizeNombre(request.Nombre);

            await _tagRepository.UpdateAsync(existingTag, cancellationToken);
        }
    }
}
