'use client'

// barra de navegacion pa los tres modulos con el nombre del usuario logueado

import React from 'react'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { ProtectedRoute } from '../../components/ProtectedRoute'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { usuario, logout } = useAuth()

    return (
        <ProtectedRoute>
            <div className="dashboard-wrapper">
                <nav>
                    <Link href="/dashboard/insumos">Insumos</Link>
                    <Link href="/dashboard/menu">Menu</Link>
                    <Link href="/dashboard/pedidos">Pedidos</Link>
                    {usuario && (
                        <span className="nav-usuario">
                            {usuario.nombre} — {usuario.rol}
                        </span>
                    )}
                    <button onClick={logout}>Cerrar sesion</button>
                </nav>
                <main className="dashboard-contenido">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    )
}