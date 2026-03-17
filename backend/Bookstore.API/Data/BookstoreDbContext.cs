/*
    Mary Catherine Shepherd
    IS 413
    Mission 11

    BookstoreDbContext.cs

    This class represents the database context for the application.
    It connects the ASP.NET Core API to the SQLite database and
    allows Entity Framework to interact with the Books table.
*/

using Microsoft.EntityFrameworkCore;

namespace Bookstore.API.Data
{
    // DbContext manages the connection between the application and the database
    public class BookstoreDbContext : DbContext
    {
        // Constructor that receives configuration options from Program.cs
        public BookstoreDbContext(DbContextOptions<BookstoreDbContext> options)
            : base(options)
        {
        }

        // Represents the Books table in the database
        // Entity Framework uses this to query and store book records
        public DbSet<Book> Books { get; set; }
    }
}