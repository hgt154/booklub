import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import { Layout } from './components/Layout'
import  HomePage  from './pages/HomePage'
import { BookstoresListPage } from './pages/BookstoresListPage'
import SearchPage from './pages/SearchPage'
import BookstorePage from './pages/BookstorePage'
import BookPage from './pages/BookPage'
import CommunityPage from './pages/CommunityPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  useEffect(() => {
    supabase.from('bookstores').select('*').then(({ data, error }) => {
      console.log('bookstores:', data, error)
    })
  }, [])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/bookstores" element={<BookstoresListPage />} />
        <Route path="/bookstores/:id" element={<BookstorePage />} />
        <Route path="/books/:id" element={<BookPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  )
}