// envuelve toda la app con el proveedor de autenticacion pa que todos accedan a la sesion

import './globals.css'
import { AuthProvider } from '../context/AuthContext'

export const metadata = {
  title: 'Intranet Anitasol',
  description: 'Sistema de gestion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}