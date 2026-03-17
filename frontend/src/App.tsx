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
import BookList from './BookList'

function App() {

  // Render the BookList component for the application
  return (
    <>
      <BookList />
    </>
  )

}

export default App
