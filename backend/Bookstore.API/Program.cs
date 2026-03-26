/*
    Mary Catherine Shepherd
    IS 413
    Mission 11

    Program.cs

    This file configures the backend ASP.NET Core API.
    It sets up services such as controllers, Swagger, the SQLite database,
    and CORS so the React frontend can communicate with the API.
*/

using Microsoft.EntityFrameworkCore;
using Bookstore.API.Data;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------------------------------------
// Add services to the container
// ------------------------------------------------------------

// Enables controller support for building API endpoints
builder.Services.AddControllers();

// Allows Swagger to discover API endpoints automatically
builder.Services.AddEndpointsApiExplorer();

// Adds Swagger generation for API documentation/testing
builder.Services.AddSwaggerGen();


// ------------------------------------------------------------
// Database configuration
// ------------------------------------------------------------

// Registers the BookstoreDbContext and connects it to the SQLite database
builder.Services.AddDbContext<BookstoreDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));


// ------------------------------------------------------------
// CORS configuration
// ------------------------------------------------------------

// Allows local React frontend ports (for Vite auto-port changes) to call this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
            origin.StartsWith("http://localhost:") || origin.StartsWith("http://127.0.0.1:")
        )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


var app = builder.Build();


// ------------------------------------------------------------
// Configure the HTTP request pipeline
// ------------------------------------------------------------

// Enables Swagger only when running in development mode
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enables CORS policy so frontend requests are allowed
app.UseCors("AllowFrontend");

// Redirects HTTP requests to HTTPS
app.UseHttpsRedirection();

// Enables authorization middleware (not heavily used in this project)
app.UseAuthorization();

// Maps controller endpoints to routes
app.MapControllers();

// Starts the web application
app.Run();
