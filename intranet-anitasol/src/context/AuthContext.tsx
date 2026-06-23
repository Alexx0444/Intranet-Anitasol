'use client'

// maneja la sesion del usuario en toda la app usando contexto global

import React, { createContext, useContext, useState, useCallback } from 'react'
import { UsuarioSesion } from '../types'

interface AuthContextType {
    usuario: UsuarioSesion | null
    login: (nombre: string, rol: string) => void
    logout: () => void
}

const SESION_KEY = 'anitasol_sesion'
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// lee la sesion guardada en localStorage antes del primer render pa no perder la sesion al recargar
function leerSesionInicial(): UsuarioSesion | null {
    if (typeof window === 'undefined') return null
    try {
        const raw = localStorage.getItem(SESION_KEY)
        return raw ? (JSON.parse(raw) as UsuarioSesion) : null
    } catch {
        return null
    }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // inicializacion lazy pa leer localStorage una sola vez sin necesitar useEffect
    const [usuario, setUsuario] = useState<UsuarioSesion | null>(leerSesionInicial)

    // guarda la sesion en localStorage y actualiza el estado global
    const login = useCallback((nombre: string, rol: string) => {
        const sesion: UsuarioSesion = { nombre, rol }
        localStorage.setItem(SESION_KEY, JSON.stringify(sesion))
        setUsuario(sesion)
    }, [])

    // borra la sesion de localStorage y limpia el estado
    const logout = useCallback(() => {
        localStorage.removeItem(SESION_KEY)
        setUsuario(null)
    }, [])

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
    return ctx
}