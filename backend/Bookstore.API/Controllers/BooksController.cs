/*
    Mary Catherine Shepherd
    IS 413
    Mission 12

    BooksController.cs

    This controller handles API requests related to books.
    It retrieves book data from the SQLite database and
    returns it to the React frontend with pagination,
    sorting, and category filtering.
*/

using Microsoft.AspNetCore.Mvc;
using Bookstore.API.Data;

namespace Bookstore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        // Database context used to interact with the Books table
        private BookstoreDbContext _bookContext;

        // Constructor that injects the database context
        public BooksController(BookstoreDbContext temp)
        {
            _bookContext = temp;
        }

        // ------------------------------------------------------------
        // GET: api/Books/AllBooks
        // Returns books with pagination, sorting, and category filtering
        // ------------------------------------------------------------
        [HttpGet("AllBooks")]
        public IActionResult GetBooks(string? category, int pageSize = 5, int pageNum = 1, string sortBy = "title")
        {
            // Start with all books in the database
            var query = _bookContext.Books.AsQueryable();

            // Filter by category if one is selected
            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(b => b.Classification == category);
            }

            // Sort books by title if requested
            if (sortBy.ToLower() == "title")
            {
                query = query.OrderBy(b => b.Title);
            }

            // Count books after filtering so pagination adjusts correctly
            var totalNumBooks = query.Count();

            // Apply pagination
            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Return both the books and the total count
            var result = new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            };

            return Ok(result);
        }

        // ------------------------------------------------------------
        // GET: api/Books/Categories
        // Returns a distinct list of book categories
        // ------------------------------------------------------------
        [HttpGet("Categories")]
        public IActionResult GetCategories()
        {
            var categories = _bookContext.Books
                .Select(b => b.Classification)
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            return Ok(categories);
        }

        // ------------------------------------------------------------
        // POST: api/Books
        // Creates a new book in the database
        // ------------------------------------------------------------
        [HttpPost]
        public IActionResult CreateBook([FromBody] Book book)
        {
            if (book == null)
            {
                return BadRequest("Book cannot be null");
            }

            // Ensure both Classification and Category are set to the same value
            if (string.IsNullOrEmpty(book.Category))
            {
                book.Category = book.Classification;
            }

            _bookContext.Books.Add(book);
            _bookContext.SaveChanges();

            return CreatedAtAction(nameof(GetBooks), new { id = book.BookID }, book);
        }

        // ------------------------------------------------------------
        // PUT: api/Books/{id}
        // Updates an existing book in the database
        // ------------------------------------------------------------
        [HttpPut("{id}")]
        public IActionResult UpdateBook(int id, [FromBody] Book book)
        {
            if (book == null)
            {
                return BadRequest("Book cannot be null");
            }

            var existingBook = _bookContext.Books.Find(id);
            if (existingBook == null)
            {
                return NotFound($"Book with id {id} not found");
            }

            existingBook.Title = book.Title;
            existingBook.Author = book.Author;
            existingBook.Publisher = book.Publisher;
            existingBook.ISBN = book.ISBN;
            existingBook.Classification = book.Classification;
            existingBook.Category = book.Classification;  // Keep both fields in sync
            existingBook.Price = book.Price;

            _bookContext.SaveChanges();

            return Ok(existingBook);
        }

        // ------------------------------------------------------------
        // DELETE: api/Books/{id}
        // Deletes a book from the database
        // ------------------------------------------------------------
        [HttpDelete("{id}")]
        public IActionResult DeleteBook(int id)
        {
            var book = _bookContext.Books.Find(id);
            if (book == null)
            {
                return NotFound($"Book with id {id} not found");
            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return Ok(new { message = $"Book with id {id} deleted successfully" });
        }
    }
}