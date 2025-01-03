namespace Ice_Cream.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly string _uploadsFolder;
        private readonly string _imageBaseUrl;

        public FileService(IWebHostEnvironment environment) //, IHttpContextAccessor httpContextAccessor
        {
            if (environment.WebRootPath == null)
            {
                // If WebRootPath is null, use ContentRootPath/wwwroot
                var webRootPath = Path.Combine(environment.ContentRootPath, "wwwroot");
                Directory.CreateDirectory(webRootPath);
                _uploadsFolder = Path.Combine(webRootPath, "uploads");
            }
            else
            {
                _uploadsFolder = Path.Combine(environment.WebRootPath, "uploads");
            }

            // Create uploads directory if it doesn't exist
            if (!Directory.Exists(_uploadsFolder))
            {
                Directory.CreateDirectory(_uploadsFolder);
            }

            //// Setup uploads folder
            //_uploadsFolder = Path.Combine(environment.WebRootPath ??
            //    Path.Combine(environment.ContentRootPath, "wwwroot"), "uploads");

            //if (!Directory.Exists(_uploadsFolder))
            //{
            //    Directory.CreateDirectory(_uploadsFolder);
            //}

            //// Create base URL for images
            //var request = httpContextAccessor.HttpContext?.Request;
            //var baseUrl = $"{request?.Scheme}://{request?.Host}";
            //_imageBaseUrl = baseUrl;
        }

        public async Task<string> SaveImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Invalid file");

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(_uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/{fileName}";
        }

        public async Task<List<string>> SaveImagesAsync(ICollection<IFormFile> files)
        {
            var paths = new List<string>();
            foreach (var file in files)
            {
                paths.Add(await SaveImageAsync(file));
            }
            return paths;
        }

        //public void DeleteImage(string imagePath)
        //{
        //    if (string.IsNullOrEmpty(imagePath)) return;

        //    var fullPath = Path.Combine(_environment.WebRootPath, imagePath.TrimStart('/'));
        //    if (File.Exists(fullPath))
        //    {
        //        File.Delete(fullPath);
        //    }
        //}

        public void DeleteImage(string imagePath)
        {
            try
            {
                if (string.IsNullOrEmpty(imagePath)) return;

                // Clean the image path
                imagePath = imagePath.TrimStart('/');
                var fullPath = Path.Combine(_uploadsFolder, "..", imagePath);

                // Normalize the path to prevent directory traversal
                fullPath = Path.GetFullPath(fullPath);

                // Verify the path is under wwwroot for security
                if (!fullPath.StartsWith(_uploadsFolder.Replace("uploads", "")))
                {
                    throw new InvalidOperationException("Invalid file path");
                }

                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                }
            }
            catch (Exception ex)
            {
                // Log the error
                Console.WriteLine($"Error deleting image: {ex.Message}");
                // You might want to throw or handle the error differently
                throw;
            }
        }
    }
}
