import './App.css'
import { Routes, Route } from 'react-router-dom'
import Landing from './routes/landing/page'
import Login from './routes/login/page'
import RegisterPage from './routes/register/page'
import DashboardPage from './routes/dashboard/page' 
import TransactionsPage from './routes/transactions/page'
import {ProtectedRoute} from './components/protectedRoute'
import ProfilePage from './routes/profile/page'
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    </Routes>
    <Analytics></Analytics>
    </>
  )
}

export default App
