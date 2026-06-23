'use client'

// formulario de ingreso pa el personal de la cafeteria

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

// usuarios validos hardcodeados porque no hay backend
const USUARIOS_VALIDOS = [
    { username: 'admin', password: 'admin123', nombre: 'Admin', rol: 'Administrador' },
]

interface ErroresLogin {
    usuario?: string
    password?: string
    general?: string
}

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errores, setErrores] = useState<ErroresLogin>({})
    const { login } = useAuth()
    const router = useRouter()

    const validar = (): boolean => {
        const nuevosErrores: ErroresLogin = {}
        if (!username.trim()) nuevosErrores.usuario = 'El usuario es obligatorio'
        if (!password.trim()) nuevosErrores.password = 'La contrasena es obligatoria'
        setErrores(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validar()) return

        const usuarioEncontrado = USUARIOS_VALIDOS.find(
            (u) => u.username === username && u.password === password
        )

        if (usuarioEncontrado) {
            login(usuarioEncontrado.nombre, usuarioEncontrado.rol)
            router.push('/dashboard/insumos')
        } else {
            setErrores({ general: 'Credenciales incorrectas. Intente nuevamente' })
        }
    }

    return (
        <main className="main-login">
            <div className="tarjeta-sesion">
                <h2>Ingreso Intranet Anitasol</h2>

                {errores.general && <p className="sesion-error-general">{errores.general}</p>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value)
                                setErrores((prev) => ({ ...prev, usuario: undefined, general: undefined }))
                            }}
                        />
                        {errores.usuario && <span className="error-texto">{errores.usuario}</span>}
                    </div>

                    <div>
                        <label>Contrasena</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setErrores((prev) => ({ ...prev, password: undefined, general: undefined }))
                            }}
                        />
                        {errores.password && <span className="error-texto">{errores.password}</span>}
                    </div>

                    <button type="submit">Ingresar</button>
                </form>
            </div>
        </main>
    )
}