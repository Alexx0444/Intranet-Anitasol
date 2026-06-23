'use client'

// si no hay sesion activa te manda al login de una
// el flag listo evita que next explote por diferencias entre servidor y cliente

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

// props tipadas pa que typescript no se queje con los children
interface ProtectedRouteProps {
    children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { usuario } = useAuth()
    const router = useRouter()
    const [listo, setListo] = useState(false)

    // primer efecto marca que ya estamos en el cliente y no en el servidor
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setListo(true)
    }, [])

    // segundo efecto revisa si hay sesion y si no hay te redirige al login
    useEffect(() => {
        if (listo && !usuario) {
            router.push('/login')
        }
    }, [listo, usuario, router])

    // mientras carga o no hay usuario no renderiza nada pa evitar el parpadeo
    if (!listo) return null
    if (!usuario) return null

    return <>{children}</>
}