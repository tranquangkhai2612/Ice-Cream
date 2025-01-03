namespace Ice_Cream.Services
{
    public interface IFileService
    {
        Task<string> SaveImageAsync(IFormFile file);
        Task<List<string>> SaveImagesAsync(ICollection<IFormFile> files);
        void DeleteImage(string imagePath);
    }
}
