using Domain.Entities;
using MediatR;

namespace Application.Features.Noticias.Queries.GetAllNoticias
{
    public class GetAllNoticiasQuery : IRequest<List<Noticia>>
    {

    }
}
