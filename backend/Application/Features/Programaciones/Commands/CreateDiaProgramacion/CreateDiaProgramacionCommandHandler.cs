using Application.Common.Interfaces;
using Application.Features.Programaciones.Dtos;

namespace Application.Features.Programaciones.Commands.CreateDiaProgramacion
{
    public class CreateDiaProgramacionCommandHandler
    {
        private readonly IDiaProgramacionRepository _diaRepository;
        private readonly IProgramacionRepository _programacionRepository;

        public CreateDiaProgramacionCommandHandler(
            IDiaProgramacionRepository diaRepository,
            IProgramacionRepository programacionRepository)
        {
            _diaRepository = diaRepository;
            _programacionRepository = programacionRepository;
        }

        public async Task<DiaProgramacionDto> Handle(
            CreateDiaProgramacionCommand request,
            CancellationToken cancellationToken)
        {
            if (!await _programacionRepository.ExistsAsync(request.ProgramacionId, cancellationToken))
            {
                throw new KeyNotFoundException("No se han encontrado programaciones con los parámetros proporcionados");
            }

            var dia = new Domain.Entities.DiaProgramacion
            {
                Fecha = request.Fecha.Kind == DateTimeKind.Unspecified
                    ? DateTime.SpecifyKind(request.Fecha, DateTimeKind.Utc)
                    : request.Fecha.ToUniversalTime(),
            };

            var newDia = await _diaRepository.AddAsync(request.ProgramacionId, dia, cancellationToken);
            return DiaProgramacionMapper.ToDto(newDia);
        }
    }
}
