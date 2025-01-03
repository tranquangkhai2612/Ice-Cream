using AutoMapper;
using Ice_Cream.DB;
using Ice_Cream.DTO;
using Ice_Cream.Models;
using Microsoft.EntityFrameworkCore;

namespace Ice_Cream.Services
{
    public class BookService : IBookService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public BookService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BookDTO>> GetAllBooksAsync()
        {
            var Books = await _context.Books
                .OrderByDescending(r => r.BookDate)
                .ToListAsync();
            return _mapper.Map<IEnumerable<BookDTO>>(Books);
        }

        public async Task<BookDTO?> GetBookByIdAsync(int id)
        {
            var Book = await _context.Books.FindAsync(id);
            return Book != null ? _mapper.Map<BookDTO>(Book) : null;
        }

        public async Task<BookDTO> CreateBookAsync(CreateBookDTO createBookDTO)
        {
            var Book = _mapper.Map<Book>(createBookDTO);
            Book.BookDate = DateTime.UtcNow;

            _context.Books.Add(Book);
            await _context.SaveChangesAsync();
            return _mapper.Map<BookDTO>(Book);
        }

        public async Task<bool> UpdateBookAsync(UpdateBookDTO updateBookDTO)
        {
            var Book = await _context.Books.FindAsync(updateBookDTO.Id);
            if (Book == null)
                return false;

            _mapper.Map(updateBookDTO, Book);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteBookAsync(int id)
        {
            var Book = await _context.Books.FindAsync(id);
            if (Book == null)
                return false;

            _context.Books.Remove(Book);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
