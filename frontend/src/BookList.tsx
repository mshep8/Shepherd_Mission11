import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Tooltip } from 'bootstrap'
import type { Book } from './types/Book'
import { useCart } from './context/CartContext'

interface BooksApiResponse {
    books?: Book[]
    Books?: Book[]
    totalNumBooks?: number
    TotalNumBooks?: number
}

function BookList() {
    const navigate = useNavigate()
    const location = useLocation()
    const { addToCart, itemCount, total, lastBookListState, rememberBookListState } = useCart()
    const restoredState = (location.state as typeof lastBookListState) ?? lastBookListState

    const [books, setBooks] = useState<Book[]>([])
    const [pageSize, setPageSize] = useState(restoredState?.pageSize ?? 5)
    const [pageNum, setPageNum] = useState(restoredState?.pageNum ?? 1)
    const [totalPages, setTotalPages] = useState(0)
    const [sortAsc, setSortAsc] = useState(restoredState?.sortAsc ?? true)
    const [categories, setCategories] = useState<string[]>([])
    const [showCategories, setShowCategories] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(
        restoredState?.selectedCategory ?? ''
    )

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5002/api/Books/Categories')
                const data = await response.json()
                setCategories(data)
            } catch {
                setErrorMessage('Could not load categories. Make sure the backend API is running.')
            }
        }

        fetchCategories()
    }, [])

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const params = new URLSearchParams({
                    pageSize: String(pageSize),
                    pageNum: String(pageNum),
                    category: selectedCategory,
                })
                const response = await fetch(
                    `http://localhost:5002/api/Books/AllBooks?${params.toString()}`
                )

                const data = (await response.json()) as BooksApiResponse

                const returnedBooks = data.books ?? data.Books ?? []
                const totalBooks = data.totalNumBooks ?? data.TotalNumBooks ?? 0

                setBooks(returnedBooks)
                setTotalPages(Math.max(1, Math.ceil(totalBooks / pageSize)))
                setErrorMessage('')
            } catch {
                setBooks([])
                setTotalPages(1)
                setErrorMessage('Could not load books. Make sure the backend API is running.')
            }
        }

        fetchBooks()
    }, [pageSize, pageNum, selectedCategory])

    useEffect(() => {
        rememberBookListState({
            pageNum,
            pageSize,
            selectedCategory,
            sortAsc,
        })
    }, [pageNum, pageSize, selectedCategory, sortAsc, rememberBookListState])

    useEffect(() => {
        const tooltipElements = Array.from(
            document.querySelectorAll('[data-bs-toggle="tooltip"]')
        )
        const tooltips = tooltipElements.map((el) => new Tooltip(el))

        return () => {
            tooltips.forEach((t) => t.dispose())
        }
    }, [books, categories, itemCount, total])

    const sortedBooks = [...books].sort((a, b) =>
        sortAsc
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
    )

    const handleAddToCart = (book: Book) => {
        addToCart(book, {
            pageNum,
            pageSize,
            selectedCategory,
            sortAsc,
        })

        navigate('/cart')
    }

    return (
        <>
            <div className="container py-4">
            <div className="row g-4">
                <aside className="col-lg-3">
                    <h1 className="h2 mb-3">Bookstore</h1>

                    <div className="card mb-3">
                        <div className="card-body">
                            <button
                                className="btn btn-sm btn-outline-secondary w-100 mb-2"
                                type="button"
                                aria-expanded={showCategories}
                                aria-controls="categoryFilters"
                                onClick={() => setShowCategories((prev) => !prev)}
                            >
                                {showCategories ? 'Hide Categories' : 'Show Categories'}
                            </button>

                            <div
                                id="categoryFilters"
                                className={`collapse ${showCategories ? 'show' : ''}`}
                            >
                                <button
                                    className={`btn me-2 mb-2 ${selectedCategory === '' ? 'btn-dark' : 'btn-outline-dark'}`}
                                    onClick={() => {
                                        setSelectedCategory('')
                                        setPageNum(1)
                                    }}
                                >
                                    All
                                </button>

                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        className={`btn me-2 mb-2 ${selectedCategory === cat ? 'btn-dark' : 'btn-outline-dark'}`}
                                        onClick={() => {
                                            setSelectedCategory(cat)
                                            setPageNum(1)
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Cart Summary</h5>
                            <p className="mb-1">
                                <strong>Items:</strong> {itemCount}
                            </p>
                            <p className="mb-3">
                                <strong>Total:</strong> ${total.toFixed(2)}
                            </p>
                            <Link className="btn btn-primary w-100" to="/cart">
                                View Cart
                            </Link>
                            <button
                                className="btn btn-outline-secondary w-100 mt-2"
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#cartInfoModal"
                            >
                                Cart Help
                            </button>
                        </div>
                    </div>
                </aside>

                <main className="col-lg-9">
                    {errorMessage && (
                        <div className="alert alert-warning" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <p className="mb-0">
                            <strong>Selected Category:</strong> {selectedCategory || 'All'}
                        </p>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setSortAsc(!sortAsc)}
                        >
                            Sort by Title {sortAsc ? '↓' : '↑'}
                        </button>
                    </div>

                    {sortedBooks.map((b) => (
                        <div key={`${b.bookId}-${b.isbn}`} className="card mb-3">
                            <div className="card-body">
                                <div className="row g-3 align-items-center">
                                    <div className="col-md-8">
                                        <h3 className="h5 card-title">{b.title}</h3>
                                        <ul className="list-unstyled mb-0">
                                            <li><strong>Author:</strong> {b.author}</li>
                                            <li><strong>Publisher:</strong> {b.publisher}</li>
                                            <li><strong>ISBN:</strong> {b.isbn}</li>
                                            <li><strong>Classification:</strong> {b.classification}</li>
                                            <li><strong>Pages:</strong> {b.pageCount}</li>
                                        </ul>
                                    </div>
                                    <div className="col-md-4 text-md-end">
                                        <p className="fs-5 fw-semibold mb-2">
                                            ${b.price.toFixed(2)}
                                        </p>
                                        <button
                                            className="btn btn-success"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            data-bs-title="Adds this book and opens your cart"
                                            onClick={() => handleAddToCart(b)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <nav aria-label="Book pagination" className="mt-4">
                        <button
                            className="btn btn-primary me-2"
                            disabled={pageNum === 1}
                            onClick={() => setPageNum(pageNum - 1)}
                        >
                            Previous
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                className={`btn me-2 ${pageNum === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setPageNum(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="btn btn-primary"
                            disabled={pageNum === totalPages}
                            onClick={() => setPageNum(pageNum + 1)}
                        >
                            Next
                        </button>
                    </nav>

                    <div className="mt-3 d-flex align-items-center gap-2">
                        <label htmlFor="pageSize" className="form-label mb-0">
                            Results per page:
                        </label>
                        <select
                            id="pageSize"
                            className="form-select page-size-select"
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
                    </div>
                </main>
            </div>
        </div>

            <div
                className="modal fade"
                id="cartInfoModal"
                tabIndex={-1}
                aria-labelledby="cartInfoModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="cartInfoModalLabel">
                                Shopping Cart Tips
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            Add books from this page, then adjust quantity in the cart. Your cart
                            is saved for this browser session while you navigate.
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BookList