using Ice_Cream.DTO;
using Ice_Cream.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ice_Cream.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookService _BookService;
        private readonly IFileService _fileService;
        private readonly ILogger<BookController> _logger;

        public BookController(IBookService BookService, IFileService fileService, ILogger<BookController> logger)
        {
            _BookService = BookService;
            _fileService = fileService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetBooks()
        {
            var Books = await _BookService.GetAllBooksAsync();
            return Ok(Books);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookDTO>> GetBook(int id)
        {
            var Book = await _BookService.GetBookByIdAsync(id);
            if (Book == null)
                return NotFound();
            return Ok(Book);
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<BookDTO>> CreateBook([FromForm] CreateBookFormDTO createBookFormDto)
        {
            try
            {
                // Handle thumbnail
                string? imagePath = null;
                if (createBookFormDto.BookImage != null)
                {
                    imagePath = await _fileService.SaveImageAsync(createBookFormDto.BookImage);
                }

                var createBookDTO = new CreateBookDTO
                {
                    BookName = createBookFormDto.BookName,
                    BookDescription = createBookFormDto.BookDescription,
                    BookImage = imagePath,
                    Price = createBookFormDto.Price

                };

                var Book = await _BookService.CreateBookAsync(createBookDTO);
                return CreatedAtAction(nameof(GetBook), new { id = Book.Id }, Book);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult> UpdateBook(int id, [FromForm] UpdateBookFormDTO updateBookFormDto)
        {
            if (id != updateBookFormDto.Id)
                return BadRequest();

            try
            {
                var existingBook = await _BookService.GetBookByIdAsync(id);
                if (existingBook == null)
                    return NotFound();

                // Handle thumbnail
                string? imagePath = existingBook.BookImage;
                if (updateBookFormDto.BookImage != null)
                {
                    // Delete old thumbnail
                    if (!string.IsNullOrEmpty(existingBook.BookImage))
                    {
                        _fileService.DeleteImage(existingBook.BookImage);
                    }
                    imagePath = await _fileService.SaveImageAsync(updateBookFormDto.BookImage);
                }

                var updateBookDTO = new UpdateBookDTO
                {
                    Id = id,
                    BookName = updateBookFormDto.BookName,
                    BookDescription = updateBookFormDto.BookDescription,
                    BookImage = imagePath,
                    Price = updateBookFormDto.Price
                };

                var success = await _BookService.UpdateBookAsync(updateBookDTO);
                if (!success)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBook(int id)
        {
            var success = await _BookService.DeleteBookAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
