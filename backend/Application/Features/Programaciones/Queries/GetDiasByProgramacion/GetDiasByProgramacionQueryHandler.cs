using Application.Common.Interfaces;
using Application.Features.Programaciones.Dtos;

namespace Application.Features.Programaciones.Queries.GetDiasByProgramacion
{
    public class GetDiasByProgramacionQueryHandler
    {
        private readonly IDiaProgramacionRepository _diaRepository;
        private readonly IProgramacionRepository _programacionRepository;

        public GetDiasByProgramacionQueryHandler(
            IDiaProgramacionRepository diaRepository,
            IProgramacionRepository programacionRepository)
        {
            _diaRepository = diaRepository;
            _programacionRepository = programacionRepository;
        }

        public async Task<List<DiaProgramacionDto>> Handle(
            GetDiasByProgramacionQuery request,
            CancellationToken cancellationToken)
        {
            if (!await _programacionRepository.ExistsAsync(request.ProgramacionId, cancellationToken))
            {
                throw new KeyNotFoundException("No se han encontrado programaciones con los parámetros proporcionados");
            }

            var descending = !string.Equals(request.Direction, "asc", StringComparison.OrdinalIgnoreCase);

            var dias = await _diaRepository.GetByProgramacionAsync(
                request.ProgramacionId, request.Offset, request.Limit, descending, cancellationToken);

            return dias.Select(DiaProgramacionMapper.ToDto).ToList();
        }
    }
}
