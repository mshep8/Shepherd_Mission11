// Trigger redeploy: 2026-03-31
/*
    Mary Catherine Shepherd
    IS 413
    Mission 11

    App.tsx

    This file is the main entry component for the React application.
    It loads and displays the BookList component, which retrieves
    and displays books from the backend API.
*/

import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import BookList from './BookList'
import CartPage from './pages/CartPage'
import AdminBooks from './pages/AdminBooks'
import { CartProvider } from './context/CartContext'

function App() {
    return (
        <BrowserRouter>
            <CartProvider>
                <Routes>
                    <Route path="/" element={<BookList />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/adminbooks" element={<AdminBooks />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </CartProvider>
        </BrowserRouter>
    )

}

export default App
