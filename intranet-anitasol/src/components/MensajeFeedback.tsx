'use client'

import React from 'react'

// las props estan tipadas y solo acepta ok o error pa no mandar cualquier string
interface MensajeFeedbackProps {
    tipo: 'ok' | 'error'
    mensaje: string
}

// si no hay mensaje no muestra nada pa no dejar espacios vacios raros
export function MensajeFeedback({ tipo, mensaje }: MensajeFeedbackProps) {
    if (!mensaje) return null
    return (
        <p className={tipo === 'ok' ? 'ok-texto' : 'error-texto'}>
            {mensaje}
        </p>
    )
}