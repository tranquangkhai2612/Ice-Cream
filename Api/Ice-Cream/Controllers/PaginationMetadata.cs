namespace Ice_Cream.Controllers
{
    internal class PaginationMetadata
    {
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public object TotalCount { get; set; }
        public int TotalPages { get; set; }
    }
}