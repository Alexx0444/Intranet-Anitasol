'use client'

import React from 'react'

// las props estan tipadas para que typescript nos avise si mandamos algo malo
interface BuscadorCrudProps {
    valor: string
    placeholder: string
    onChange: (valor: string) => void
}

// caja de busqueda reutilizable pa los tres modulos
export function BuscadorCrud({ valor, placeholder, onChange }: BuscadorCrudProps) {
    return (
        <div className="buscador-crud">
            <input
                type="text"
                placeholder={placeholder}
                value={valor}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}