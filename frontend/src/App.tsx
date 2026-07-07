import { Routes, Route, Navigate } from 'react-router'
import { useAuth } from './context/AuthContext'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { ParkingListPage } from './pages/ParkingListPage'
import { RefreshCw } from 'lucide-react'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background text-foreground'>
        <div className='flex flex-col items-center gap-3'>
          <RefreshCw className='w-8 h-8 animate-spin text-primary' />
          <span className='font-medium'>Initializing session...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to='/login' replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ParkingListPage />} />
      </Route>
      {/* Catch-all redirects to root */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

export default App
