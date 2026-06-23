import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#26272d',
            color: '#e5e7eb',
            border: '1px solid #3a3b42',
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#26272d' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#26272d' },
          },
        }}
      />
    </>
  )
}
