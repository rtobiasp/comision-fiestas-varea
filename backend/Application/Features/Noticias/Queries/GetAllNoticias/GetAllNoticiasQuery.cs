namespace Application.Features.Noticias.Queries.GetAllNoticias
{
    public class GetAllNoticiasQuery
    {
        public Guid? CategoriaId { get; set; }
        public Guid? TagId { get; set; }
        public int? Offset { get; set; }
        public int? Limit { get; set; }
    }
}
