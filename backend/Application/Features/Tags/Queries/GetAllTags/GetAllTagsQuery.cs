namespace Application.Features.Tags.Queries.GetAllTags
{
    public class GetAllTagsQuery
    {
        public string? Search { get; set; }
        public string? OrderBy { get; set; }
        public string? Direction { get; set; }
    }
}
