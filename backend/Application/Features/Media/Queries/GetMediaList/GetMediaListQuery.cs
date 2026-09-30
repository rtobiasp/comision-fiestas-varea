using Domain.Entities;

namespace Application.Features.Media.Queries.GetMediaList
{
    public class GetMediaListQuery
    {
        public MediaTipo? Tipo { get; set; }
        public int? Offset { get; set; }
        public int? Limit { get; set; }
    }
}
