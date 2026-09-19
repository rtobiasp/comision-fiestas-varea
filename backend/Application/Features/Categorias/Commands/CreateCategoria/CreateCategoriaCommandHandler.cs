using Application.Common.Interfaces;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Categorias.Commands.CreateCategoria
{
    public class CreateCategoriaCommandHandler
    {
        private readonly ICategoriaRepository _categoriaRepository;

        public CreateCategoriaCommandHandler(ICategoriaRepository categoriaRepository)
        {
            _categoriaRepository = categoriaRepository;
        }

        public async Task<Categoria> Handle(CreateCategoriaCommand command, CancellationToken cancellationToken)
        {
            var categoria = new Categoria
            {
                Nombre = command.Nombre,
                Descripcion = command.Descripcion,
            };

            await _categoriaRepository.AddAsync(categoria, cancellationToken);
            return categoria;
        }
    }
}
