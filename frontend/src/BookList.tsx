/*
    Mary Catherine Shepherd
    IS 413
    Mission 11

    BookList.tsx

    This React component retrieves book data from the ASP.NET Core API
    and displays it on the webpage. It also implements pagination,
    sorting by title, and the ability to change the number of results
    displayed per page.
*/

import { useEffect, useState } from 'react'
import type { Book } from './types/Book'

function BookList() {

    // Stores the books returned from the API
    const [books, setBooks] = useState<Book[]>([])

    // Number of books displayed per page
    const [pageSize, setPageSize] = useState(5)

    // Current page number
    const [pageNum, setPageNum] = useState(1)

    // Total number of pages based on database results
    const [totalPages, setTotalPages] = useState(0)

    // Determines whether sorting is ascending or descending
    const [sortAsc, setSortAsc] = useState(true)


    // ------------------------------------------------------------
    // Fetch book data from the API whenever page size or page changes
    // ------------------------------------------------------------
    useEffect(() => {
        const fetchBooks = async () => {

            // Call the backend API with pagination parameters
            const response = await fetch(
                `http://localhost:5002/api/Books/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}`
            )

            // Convert the response to JSON
            const data = await response.json()

            // Store returned books in state
            setBooks(data.books)

            // Calculate total number of pages
            setTotalPages(Math.ceil(data.totalNumBooks / pageSize))
        }

        fetchBooks()

    }, [pageSize, pageNum])


    // ------------------------------------------------------------
    // Sort books by title (ascending or descending)
    // ------------------------------------------------------------
    const sortedBooks = [...books].sort((a, b) =>
        sortAsc
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    )


    return (
        <>
        <h1>Bookstore</h1>

        {/* Button toggles sorting order for book titles */}
        <button
            className="btn btn-secondary mb-3"
            onClick={() => setSortAsc(!sortAsc)}
        >
            Sort by Title {sortAsc ? "↓" : "↑"}
        </button>


        {/* Display each book in a Bootstrap card */}
        {sortedBooks.map((b) => (
            <div key={b.bookId} className="card mb-3">
            <div className="card-body">

                <h3 className="card-title">{b.title}</h3>

                <ul className="list-unstyled">
                <li><strong>Author:</strong> {b.author}</li>
                <li><strong>Publisher:</strong> {b.publisher}</li>
                <li><strong>ISBN:</strong> {b.isbn}</li>
                <li><strong>Classification:</strong> {b.classification}</li>
                <li><strong>Pages:</strong> {b.pageCount}</li>
                <li><strong>Price:</strong> ${b.price}</li>
                </ul>

            </div>
            </div>
        ))}

        <br />


        {/* Previous page button */}
        <button
            className="btn btn-primary me-2"
            disabled={pageNum === 1}
            onClick={() => setPageNum(pageNum - 1)}
        >
            Previous
        </button>


        {/* Generate page number buttons dynamically */}
        {[...Array(totalPages)].map((_, i) => (
            <button
            key={i + 1}
            className="btn btn-outline-primary me-2"
            onClick={() => setPageNum(i + 1)}
            >
            {i + 1}
            </button>
        ))}


        {/* Next page button */}
        <button
            className="btn btn-primary"
            disabled={pageNum === totalPages}
            onClick={() => setPageNum(pageNum + 1)}
        >
            Next
        </button>

        <br />
        <br />


        {/* Dropdown allows user to change number of books per page */}
        <label>
            Results per page:
            <select
            value={pageSize}
            onChange={(p) => {
                setPageSize(Number(p.target.value))
                setPageNum(1)
            }}
            >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            </select>
        </label>

        </>
    )
}

export default BookList