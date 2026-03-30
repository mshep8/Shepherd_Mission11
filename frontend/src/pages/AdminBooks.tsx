/*
    Mary Catherine Shepherd
    IS 413
    Mission 11

    AdminBooks.tsx

    This page allows administrators to add, update, and delete books
    from the bookstore database.
*/

import { useState, useEffect } from 'react'
import type { Book } from '../types/Book'
import { useNavigate } from 'react-router-dom'
import '../styles/AdminBooks.css'

function AdminBooks() {
    const [books, setBooks] = useState<Book[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        classification: '',
        pageCount: 0,
        price: 0
    })

    // Fetch all books and categories on component mount
    useEffect(() => {
        fetchBooks()
        fetchCategories()
    }, [])

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:5002/api/books/AllBooks?pageSize=100')
            const data = await response.json()
            setBooks(data.books || [])
            setLoading(false)
        } catch (err) {
            setError('Failed to load books')
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5002/api/books/Categories')
            const data = await response.json()
            setCategories(data || [])
        } catch (err) {
            console.error('Failed to load categories')
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'pageCount' ? parseFloat(value) : value
        }))
    }

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.title || !formData.author || !formData.publisher || !formData.isbn || !formData.classification) {
            setError('Please fill in all required fields')
            return
        }

        try {
            const response = await fetch('http://localhost:5002/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: formData.title,
                    author: formData.author,
                    publisher: formData.publisher,
                    isbn: formData.isbn,
                    classification: formData.classification,
                    pageCount: formData.pageCount,
                    price: formData.price
                })
            })

            if (response.ok) {
                setFormData({
                    title: '',
                    author: '',
                    publisher: '',
                    isbn: '',
                    classification: '',
                    pageCount: 0,
                    price: 0
                })
                setIsAdding(false)
                setError('')
                fetchBooks()
            } else {
                setError('Failed to add book')
            }
        } catch (err) {
            setError('Error adding book: ' + (err instanceof Error ? err.message : 'Unknown error'))
        }
    }

    const handleEditBook = (book: Book) => {
        setSelectedBook(book)
        setFormData({
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            isbn: book.isbn,
            classification: book.classification,
            pageCount: book.pageCount,
            price: book.price
        })
    }

    const handleUpdateBook = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedBook) return

        try {
            const response = await fetch(`http://localhost:5002/api/books/${selectedBook.bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bookId: selectedBook.bookId,
                    title: formData.title,
                    author: formData.author,
                    publisher: formData.publisher,
                    isbn: formData.isbn,
                    classification: formData.classification,
                    pageCount: formData.pageCount,
                    price: formData.price
                })
            })

            if (response.ok) {
                setSelectedBook(null)
                setFormData({
                    title: '',
                    author: '',
                    publisher: '',
                    isbn: '',
                    classification: '',
                    pageCount: 0,
                    price: 0
                })
                setError('')
                fetchBooks()
            } else {
                const errorData = await response.json()
                setError('Failed to update book: ' + (errorData.message || 'Unknown error'))
            }
        } catch (err) {
            setError('Error updating book: ' + (err instanceof Error ? err.message : 'Unknown error'))
        }
    }

    const handleDeleteBook = async (bookId: number) => {
        if (!window.confirm('Are you sure you want to delete this book?')) {
            return
        }

        try {
            const response = await fetch(`http://localhost:5002/api/books/${bookId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setError('')
                fetchBooks()
            } else {
                setError('Failed to delete book')
            }
        } catch (err) {
            setError('Error deleting book: ' + (err instanceof Error ? err.message : 'Unknown error'))
        }
    }

    const handleCancel = () => {
        setSelectedBook(null)
        setIsAdding(false)
        setFormData({
            title: '',
            author: '',
            publisher: '',
            isbn: '',
            classification: '',
            pageCount: 0,
            price: 0
        })
    }

    if (loading) {
        return <div className="admin-container"><p>Loading books...</p></div>
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Bookstore Admin Panel</h1>
                <button className="back-btn" onClick={() => navigate('/')}>Back to Store</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="admin-content">
                {/* Form Section */}
                <div className="form-section">
                    <h2>{selectedBook ? 'Edit Book' : isAdding ? 'Add New Book' : 'Book Management'}</h2>
                    
                    {!isAdding && !selectedBook && (
                        <button className="add-btn btn-primary" onClick={() => setIsAdding(true)}>
                            + Add New Book
                        </button>
                    )}

                    {(isAdding || selectedBook) && (
                        <form onSubmit={selectedBook ? handleUpdateBook : handleAddBook} className="book-form">
                            <div className="form-group">
                                <label htmlFor="title">Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="author">Author *</label>
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="publisher">Publisher *</label>
                                <input
                                    type="text"
                                    id="publisher"
                                    name="publisher"
                                    value={formData.publisher}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="isbn">ISBN *</label>
                                <input
                                    type="text"
                                    id="isbn"
                                    name="isbn"
                                    value={formData.isbn}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="classification">Classification *</label>
                                <select
                                    id="classification"
                                    name="classification"
                                    value={formData.classification}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="pageCount">Page Count</label>
                                    <input
                                        type="number"
                                        id="pageCount"
                                        name="pageCount"
                                        value={formData.pageCount}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price">Price ($)</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-buttons">
                                <button type="submit" className="submit-btn btn-primary">
                                    {selectedBook ? 'Update Book' : 'Add Book'}
                                </button>
                                <button type="button" className="cancel-btn btn-secondary" onClick={handleCancel}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Books Table Section */}
                <div className="books-section">
                    <h2>Books in Inventory ({books.length})</h2>
                    
                    {books.length === 0 ? (
                        <p>No books in inventory</p>
                    ) : (
                        <div className="books-table-wrapper">
                            <table className="books-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Publisher</th>
                                        <th>ISBN</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.map(book => (
                                        <tr key={book.bookId}>
                                            <td>{book.title}</td>
                                            <td>{book.author}</td>
                                            <td>{book.publisher}</td>
                                            <td>{book.isbn}</td>
                                            <td>{book.classification}</td>
                                            <td>${book.price.toFixed(2)}</td>
                                            <td className="actions">
                                                <button
                                                    className="edit-btn btn-warning"
                                                    onClick={() => handleEditBook(book)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="delete-btn btn-danger"
                                                    onClick={() => handleDeleteBook(book.bookId)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminBooks
