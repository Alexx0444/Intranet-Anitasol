'use client'

// pagina de detalle de un insumo especifico
// lee el id de la url con useParams y busca el insumo en localStorage

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Insumo } from '../../../../types'

export default function InsumoDetallePage() {
    const params = useParams()
    const id = params?.id as string | undefined
    const router = useRouter()

    // undefined significa que todavia esta cargando y null que no se encontro el insumo
    const [insumo, setInsumo] = useState<Insumo | null | undefined>(undefined)

    // busca el insumo en localStorage usando el id de la url
    useEffect(() => {
        if (!id) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setInsumo(null)
            return
        }
        try {
            const datos = localStorage.getItem('anitasol_insumos')
            const lista: Insumo[] = datos ? (JSON.parse(datos) as Insumo[]) : []
            const encontrado = lista.find((ins) => ins.id === id) ?? null
            setInsumo(encontrado)
        } catch (err) {
            console.warn('Error al cargar insumo desde localStorage:', err)
            setInsumo(null)
        }
    }, [id])

    // muestra cargando mientras el efecto no ha terminado de buscar
    if (insumo === undefined) {
        return (
            <div className="pagina-padding">
                <p>Cargando...</p>
            </div>
        )
    }

    if (insumo === null) {
        return (
            <div className="pagina-padding">
                <p>Insumo no encontrado</p>
                <button onClick={() => router.push('/dashboard/insumos')}>Volver</button>
            </div>
        )
    }

    return (
        <div className="pagina-detalle">
            <h2>Detalle del Insumo</h2>

            <div className="tarjeta-detalle">
                {/* imagen en base64 que no depende de ninguna url externa */}
                <Image
                    src={insumo.imagen}
                    alt={insumo.nombre}
                    width={120}
                    height={120}
                    unoptimized
                    className="imagen-detalle"
                />
                <p><strong>Nombre:</strong> {insumo.nombre}</p>
                <p><strong>Precio:</strong> ${insumo.precio}</p>
                <p><strong>Cantidad en stock:</strong> {insumo.cantidad}</p>
                <p><strong>Ingredientes:</strong> {insumo.ingredientes}</p>
                <p><strong>Calorias:</strong> {insumo.calorias} kcal</p>
                <p><strong>Es saludable:</strong> {insumo.esSaludable ? 'Si' : 'No'}</p>
            </div>

            <button className="boton-volver" onClick={() => router.push('/dashboard/insumos')}>
                Volver al listado
            </button>
        </div>
    )
}