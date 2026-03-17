/*
    Mary Catherine Shepherd
    IS 413
    Mission 11

    BooksController.cs

    This controller handles API requests related to books.
    It retrieves book data from the SQLite database and
    returns it to the React frontend with pagination and sorting.
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
        // Returns books with pagination and optional sorting
        // ------------------------------------------------------------
        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string sortBy = "title")
        {
            // Start with all books in the database
            var query = _bookContext.Books.AsQueryable();

            // Sort books by title if requested
            if (sortBy.ToLower() == "title")
            {
                query = query.OrderBy(b => b.Title);
            }

            // Apply pagination (skip previous pages, then take pageSize results)
            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Get the total number of books in the database
            var totalNumBooks = _bookContext.Books.Count();

            // Create an object containing both the books and total count
            var result = new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            };

            // Return the result as JSON to the frontend
            return Ok(result);
        }
    }
}