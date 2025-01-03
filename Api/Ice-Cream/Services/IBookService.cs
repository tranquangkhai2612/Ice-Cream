using Ice_Cream.DTO;

namespace Ice_Cream.Services
{
    public interface IBookService
    {
        Task<IEnumerable<BookDTO>> GetAllBooksAsync();
        Task<BookDTO?> GetBookByIdAsync(int id);
        Task<BookDTO> CreateBookAsync(CreateBookDTO createBookDTO);
        Task<bool> UpdateBookAsync(UpdateBookDTO updateBookDTO);
        Task<bool> DeleteBookAsync(int id);

    }
}
