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
    }
}