using Application.Common.Interfaces;
using Application.Features.Programaciones.Dtos;

namespace Application.Features.Programaciones.Queries.GetAllProgramaciones
{
    public class GetAllProgramacionesQueryHandler
    {
        private readonly IProgramacionRepository _programacionRepository;

        public GetAllProgramacionesQueryHandler(IProgramacionRepository programacionRepository)
        {
            _programacionRepository = programacionRepository;
        }

        public async Task<List<ProgramacionDto>> Handle(
            GetAllProgramacionesQuery request,
            CancellationToken cancellationToken)
        {
            var orderBy = string.Equals(request.OrderBy, "nombre", StringComparison.OrdinalIgnoreCase) ? "nombre" : "fecha";
            var descending = !string.Equals(request.Direction, "asc", StringComparison.OrdinalIgnoreCase);

            var programaciones = await _programacionRepository.GetAllAsync(
                request.Offset, request.Limit, orderBy, descending, cancellationToken);

            return programaciones.Select(ProgramacionMapper.ToDto).ToList();
        }
    }
}
