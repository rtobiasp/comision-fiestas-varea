using Application.Common.Interfaces;
using Application.Features.Programaciones.Dtos;

namespace Application.Features.Programaciones.Queries.GetDiaProgramacionById
{
    public class GetDiaProgramacionByIdQueryHandler
    {
        private readonly IDiaProgramacionRepository _diaRepository;

        public GetDiaProgramacionByIdQueryHandler(IDiaProgramacionRepository diaRepository)
        {
            _diaRepository = diaRepository;
        }

        public async Task<DiaProgramacionDto> Handle(
            GetDiaProgramacionByIdQuery request,
            CancellationToken cancellationToken)
        {
            var dia = await _diaRepository.GetAsync(request.Id, cancellationToken);
            return DiaProgramacionMapper.ToDto(dia);
        }
    }
}
