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
            if (command.CategoriaPadreId.HasValue)
            {
                // Valida que la categoría padre exista (404 si no) antes de crear la hija.
                await _categoriaRepository.GetAsync(command.CategoriaPadreId.Value, cancellationToken);
            }

            var categoria = new Categoria
            {
                Nombre = command.Nombre,
                Descripcion = command.Descripcion,
                CategoriaPadreId = command.CategoriaPadreId,
            };

            await _categoriaRepository.AddAsync(categoria, cancellationToken);
            return categoria;
        }
    }
}
