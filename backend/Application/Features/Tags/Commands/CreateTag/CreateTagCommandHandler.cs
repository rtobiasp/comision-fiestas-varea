using Application.Common.Interfaces;
using Application.Features.Tags.Dtos;
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

        public async Task<TagDto> Handle(CreateTagCommand command, CancellationToken cancellationToken)
        {
            var tag = new Tag
            {
                Nombre = command.Nombre,
            };

            await _tagRepository.AddAsync(tag, cancellationToken);
            return new TagDto(
                tag.Id,
                tag.Nombre,
                tag.CreatedAt,
                tag.CreatedBy
            );
        }
    }
}
