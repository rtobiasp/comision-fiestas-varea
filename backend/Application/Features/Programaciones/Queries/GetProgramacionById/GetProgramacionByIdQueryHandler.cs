using Application.Common.Interfaces;
using Application.Features.Programaciones.Dtos;

namespace Application.Features.Programaciones.Queries.GetProgramacionById
{
    public class GetProgramacionByIdQueryHandler
    {
        private readonly IProgramacionRepository _programacionRepository;

        public GetProgramacionByIdQueryHandler(IProgramacionRepository programacionRepository)
        {
            _programacionRepository = programacionRepository;
        }

        public async Task<ProgramacionDto> Handle(
            GetProgramacionByIdQuery request,
            CancellationToken cancellationToken)
        {
            var programacion = await _programacionRepository.GetAsync(request.Id, cancellationToken);
            return ProgramacionMapper.ToDto(programacion);
        }
    }
}
