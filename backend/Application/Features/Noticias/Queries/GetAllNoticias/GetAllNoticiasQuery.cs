namespace Application.Features.Noticias.Queries.GetAllNoticias
{
    public class GetAllNoticiasQuery
    {
        public Guid? CategoriaId { get; set; }
        public Guid? TagId { get; set; }
        public int? Offset { get; set; }
        public int? Limit { get; set; }
        public string? OrderBy { get; set; }
        public string? Direction { get; set; }
        public bool? Publicada { get; set; }
    }
}
