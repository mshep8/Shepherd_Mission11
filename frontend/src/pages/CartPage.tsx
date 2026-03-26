import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Tooltip } from 'bootstrap'
import { useCart } from '../context/CartContext'

function CartPage() {
    const navigate = useNavigate()
    const {
        items,
        total,
        decreaseQuantity,
        increaseQuantity,
        removeFromCart,
        clearCart,
        lastBookListState,
    } = useCart()

    useEffect(() => {
        const tooltipElements = Array.from(
            document.querySelectorAll('[data-bs-toggle="tooltip"]')
        )
        const tooltips = tooltipElements.map((el) => new Tooltip(el))

        return () => {
            tooltips.forEach((t) => t.dispose())
        }
    }, [items.length])

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="mb-0">Shopping Cart</h1>
                <Link className="btn btn-outline-secondary" to="/">
                    Back to Books
                </Link>
            </div>

            {items.length === 0 ? (
                <div className="alert alert-info">
                    Your cart is empty. Add a few books to get started.
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th className="text-center">Quantity</th>
                                    <th className="text-end">Price</th>
                                    <th className="text-end">Subtotal</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => {
                                    const subtotal = item.quantity * item.book.price
                                    return (
                                        <tr key={`${item.book.bookId}-${item.book.isbn}`}>
                                            <td>
                                                <div className="fw-semibold">{item.book.title}</div>
                                                <div className="text-muted small">
                                                    {item.book.author}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div
                                                    className="btn-group"
                                                    role="group"
                                                    aria-label={`Quantity controls for ${item.book.title}`}
                                                >
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() =>
                                                            decreaseQuantity(item.book.bookId)
                                                        }
                                                    >
                                                        -
                                                    </button>
                                                    <button
                                                        className="btn btn-light"
                                                        disabled
                                                    >
                                                        {item.quantity}
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() =>
                                                            increaseQuantity(item.book.bookId)
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="text-end">
                                                ${item.book.price.toFixed(2)}
                                            </td>
                                            <td className="text-end">${subtotal.toFixed(2)}</td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() =>
                                                        removeFromCart(item.book.bookId)
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex justify-content-end">
                        <div className="card p-3 cart-total-card">
                            <h5 className="mb-2">Order Total</h5>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Total</span>
                                <strong>${total.toFixed(2)}</strong>
                            </div>
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div className="mt-4 d-flex gap-2 flex-wrap">
                <button
                    className="btn btn-primary"
                    data-bs-toggle="tooltip"
                    data-bs-title="Return to where you last added a book"
                    onClick={() => navigate('/', { state: lastBookListState ?? undefined })}
                >
                    Continue Shopping
                </button>
                <Link to="/" className="btn btn-outline-primary">
                    Browse All Books
                </Link>
            </div>
        </div>
    )
}

export default CartPage
