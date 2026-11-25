import { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { AuthProvider } from '@/context/AuthContext'
import { router } from './routes'

export default function App() {
  useEffect(() => {
    document.title = "Finwise"
  }, [])

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
