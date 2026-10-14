using Application.Common.Interfaces;
using Application.Features.Programaciones.Dtos;

namespace Application.Features.Programaciones.Commands.CreateProgramacion
{
    public class CreateProgramacionCommandHandler
    {
        private readonly IProgramacionRepository _programacionRepository;

        public CreateProgramacionCommandHandler(IProgramacionRepository programacionRepository)
        {
            _programacionRepository = programacionRepository;
        }

        public async Task<ProgramacionDto> Handle(
            CreateProgramacionCommand request,
            CancellationToken cancellationToken)
        {
            var programacion = new Domain.Entities.Programacion
            {
                Nombre = request.Nombre,
            };

            var newProgramacion = await _programacionRepository.AddAsync(programacion, cancellationToken);
            return ProgramacionMapper.ToDto(newProgramacion);
        }
    }
}
