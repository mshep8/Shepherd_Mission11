import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Book } from '../types/Book'

export interface CartItem {
    book: Book
    quantity: number
}

export interface BookListViewState {
    pageNum: number
    pageSize: number
    selectedCategory: string
    sortAsc: boolean
}

interface CartContextType {
    items: CartItem[]
    lastBookListState: BookListViewState | null
    addToCart: (book: Book, returnState: BookListViewState) => void
    decreaseQuantity: (bookId: number) => void
    increaseQuantity: (bookId: number) => void
    removeFromCart: (bookId: number) => void
    clearCart: () => void
    rememberBookListState: (state: BookListViewState) => void
    itemCount: number
    total: number
}

const CART_STORAGE_KEY = 'bookstore-cart'
const BOOK_LIST_STATE_KEY = 'bookstore-last-list-state'

const CartContext = createContext<CartContextType | undefined>(undefined)

function getStoredCart(): CartItem[] {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY)
    if (!raw) {
        return []
    }

    try {
        return JSON.parse(raw) as CartItem[]
    } catch {
        return []
    }
}

function getStoredListState(): BookListViewState | null {
    const raw = sessionStorage.getItem(BOOK_LIST_STATE_KEY)
    if (!raw) {
        return null
    }

    try {
        return JSON.parse(raw) as BookListViewState
    } catch {
        return null
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(getStoredCart)
    const [lastBookListState, setLastBookListState] = useState<BookListViewState | null>(
        getStoredListState
    )

    useEffect(() => {
        sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }, [items])

    useEffect(() => {
        if (!lastBookListState) {
            sessionStorage.removeItem(BOOK_LIST_STATE_KEY)
            return
        }
        sessionStorage.setItem(BOOK_LIST_STATE_KEY, JSON.stringify(lastBookListState))
    }, [lastBookListState])

    const addToCart = useCallback((book: Book, returnState: BookListViewState) => {
        setLastBookListState(returnState)
        setItems((prev) => {
            const existing = prev.find((i) => i.book.bookId === book.bookId)
            if (existing) {
                return prev.map((i) =>
                    i.book.bookId === book.bookId ? { ...i, quantity: i.quantity + 1 } : i
                )
            }

            return [...prev, { book, quantity: 1 }]
        })
    }, [])

    const increaseQuantity = useCallback((bookId: number) => {
        setItems((prev) =>
            prev.map((i) =>
                i.book.bookId === bookId ? { ...i, quantity: i.quantity + 1 } : i
            )
        )
    }, [])

    const decreaseQuantity = useCallback((bookId: number) => {
        setItems((prev) =>
            prev.flatMap((i) => {
                if (i.book.bookId !== bookId) {
                    return [i]
                }
                if (i.quantity <= 1) {
                    return []
                }
                return [{ ...i, quantity: i.quantity - 1 }]
            })
        )
    }, [])

    const removeFromCart = useCallback((bookId: number) => {
        setItems((prev) => prev.filter((i) => i.book.bookId !== bookId))
    }, [])

    const clearCart = useCallback(() => {
        setItems([])
    }, [])

    const rememberBookListState = useCallback((state: BookListViewState) => {
        setLastBookListState(state)
    }, [])

    const itemCount = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    )
    const total = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity * item.book.price, 0),
        [items]
    )

    const value = useMemo(
        () => ({
            items,
            lastBookListState,
            addToCart,
            decreaseQuantity,
            increaseQuantity,
            removeFromCart,
            clearCart,
            rememberBookListState,
            itemCount,
            total,
        }),
        [
            items,
            lastBookListState,
            addToCart,
            decreaseQuantity,
            increaseQuantity,
            removeFromCart,
            clearCart,
            rememberBookListState,
            itemCount,
            total,
        ]
    )

    return (
        <CartContext.Provider
            value={value}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
