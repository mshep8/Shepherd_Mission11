/*
    Mary Catherine Shepherd
    IS 413
    Mission 11

    Book.ts

    This TypeScript interface defines the structure of a Book object
    used in the React frontend. It matches the Book model returned
    by the ASP.NET Core API so the frontend knows the shape of the data.
*/

export interface Book {

    // Unique identifier for each book
    bookID: number

    // Title of the book
    title: string

    // Author of the book
    author: string

    // Publisher of the book
    publisher: string

    // ISBN number used to identify the book
    isbn: string

    // Category or classification of the book
    classification: string

    // Category field (synced with classification)
    category?: string

    // Number of pages in the book
    pageCount: number

    // Price of the book
    price: number
}