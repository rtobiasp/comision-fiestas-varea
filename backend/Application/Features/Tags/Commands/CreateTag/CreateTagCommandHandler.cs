using Application.Common.Interfaces;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Tags.Commands.CreateTag
{
    public class CreateTagCommandHandler
    {
        private readonly ITagRepository _tagRepository;

        public CreateTagCommandHandler(ITagRepository tagRepository)
        {
            _tagRepository = tagRepository;
        }

        public async Task<Tag> Handle(CreateTagCommand command, CancellationToken cancellationToken)
        {
            var tag = new Tag
            {
                Nombre = command.Nombre,
            };

            await _tagRepository.AddAsync(tag, cancellationToken);
            return tag;
        }
    }
}
