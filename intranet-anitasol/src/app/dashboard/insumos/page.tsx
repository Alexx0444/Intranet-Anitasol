'use client'

// modulo de insumos con CRUD completo
// las imagenes se guardan como base64 pa que persistan sin necesitar servidor

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocalStorage } from '../../../hooks/useLocalStorage'
import { BuscadorCrud } from '../../../components/BuscadorCrud'
import { MensajeFeedback } from '../../../components/MensajeFeedback'
import { Insumo } from '../../../types'

interface ErroresInsumo {
    nombre?: string
    precio?: string
    cantidad?: string
    ingredientes?: string
    calorias?: string
    imagen?: string
}

// convierte la imagen a base64 pa poder guardarla en localStorage
function convertirABase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            reject(new Error('El archivo debe ser una imagen'))
            return
        }
        if (file.size > 2 * 1024 * 1024) {
            reject(new Error('La imagen no debe superar 2MB'))
            return
        }
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Error al leer el archivo'))
        reader.readAsDataURL(file)
    })
}

export default function InsumosPage() {
    const [insumos, setInsumos] = useLocalStorage<Insumo[]>('anitasol_insumos', [])

    const [nombre, setNombre] = useState('')
    const [precio, setPrecio] = useState(0)
    const [cantidad, setCantidad] = useState(0)
    const [ingredientes, setIngredientes] = useState('')
    const [calorias, setCalorias] = useState(0)
    const [esSaludable, setEsSaludable] = useState(false)
    const [imagen, setImagen] = useState('')
    const [editId, setEditId] = useState<string | null>(null)
    const [busqueda, setBusqueda] = useState('')
    const [errores, setErrores] = useState<ErroresInsumo>({})
    const [mensajeOk, setMensajeOk] = useState('')

    // carga los insumos guardados al entrar a la pagina
    useEffect(() => {
        const datos = localStorage.getItem('anitasol_insumos')
        if (datos) {
            try {
                setInsumos(JSON.parse(datos) as Insumo[])
            } catch (err) {
                console.warn('Error al cargar insumos desde localStorage:', err)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // filtra los insumos segun lo que escribe el usuario en el buscador
    const insumosFiltrados = useMemo(() => {
        return insumos.filter((item) =>
            item.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )
    }, [insumos, busqueda])

    // agarra el archivo del input y lo convierte a base64 pa la vista previa y el guardado
    const handleImagenChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            const base64 = await convertirABase64(file)
            setImagen(base64)
            setErrores((prev) => ({ ...prev, imagen: undefined }))
        } catch (err) {
            setErrores((prev) => ({ ...prev, imagen: err instanceof Error ? err.message : 'Error al procesar la imagen' }))
        }
    }

    const validar = (): boolean => {
        const nuevosErrores: ErroresInsumo = {}
        if (!nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio'
        if (precio <= 0) nuevosErrores.precio = 'El precio debe ser mayor a 0'
        if (cantidad < 0) nuevosErrores.cantidad = 'La cantidad no puede ser negativa'
        if (!ingredientes.trim()) nuevosErrores.ingredientes = 'Los ingredientes son obligatorios'
        if (calorias < 0) nuevosErrores.calorias = 'Las calorias no pueden ser negativas'
        if (!imagen.trim()) nuevosErrores.imagen = 'La imagen es obligatoria'
        setErrores(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validar()) return

        if (editId !== null) {
            const actualizados = insumos.map((ins) =>
                ins.id === editId
                    ? { id: editId, nombre, precio: Number(precio), cantidad: Number(cantidad), ingredientes, calorias: Number(calorias), esSaludable, imagen }
                    : ins
            )
            setInsumos(actualizados)
            setEditId(null)
            setMensajeOk('Insumo actualizado correctamente')
        } else {
            const nuevoInsumo: Insumo = {
                id: crypto.randomUUID(),
                nombre,
                precio: Number(precio),
                cantidad: Number(cantidad),
                ingredientes,
                calorias: Number(calorias),
                esSaludable,
                imagen,
            }
            setInsumos([...insumos, nuevoInsumo])
            setMensajeOk('Insumo registrado correctamente')
        }
        limpiarFormulario()
        setTimeout(() => setMensajeOk(''), 3000)
    }

    const iniciarEdicion = (insumo: Insumo) => {
        setNombre(insumo.nombre)
        setPrecio(insumo.precio)
        setCantidad(insumo.cantidad)
        setIngredientes(insumo.ingredientes)
        setCalorias(insumo.calorias)
        setEsSaludable(insumo.esSaludable)
        setImagen(insumo.imagen)
        setEditId(insumo.id)
        setErrores({})
        setMensajeOk('')
    }

    const eliminarInsumo = (id: string) => {
        if (!confirm('Seguro que deseas eliminar este insumo')) return
        setInsumos(insumos.filter((ins) => ins.id !== id))
        setMensajeOk('Insumo eliminado')
        setTimeout(() => setMensajeOk(''), 3000)
    }

    const limpiarFormulario = () => {
        setNombre('')
        setPrecio(0)
        setCantidad(0)
        setIngredientes('')
        setCalorias(0)
        setEsSaludable(false)
        setImagen('')
        setEditId(null)
        setErrores({})
    }

    return (
        <div>
            <h2 className="panel-titulo">Registro de Insumos</h2>

            <form onSubmit={handleSubmit} className="form-crud">
                <h3>{editId !== null ? 'Editar Insumo' : 'Agregar Insumo'}</h3>

                <MensajeFeedback tipo="ok" mensaje={mensajeOk} />

                <div>
                    <label>Nombre</label>
                    <input type="text" value={nombre} onChange={(e) => { setNombre(e.target.value); setErrores((prev) => ({ ...prev, nombre: undefined })) }} />
                    {errores.nombre && <span className="error-texto">{errores.nombre}</span>}
                </div>

                <div>
                    <label>Precio</label>
                    <input type="number" placeholder="0" value={precio === 0 ? '' : precio} onChange={(e) => { setPrecio(Number(e.target.value)); setErrores((prev) => ({ ...prev, precio: undefined })) }} />
                    {errores.precio && <span className="error-texto">{errores.precio}</span>}
                </div>

                <div>
                    <label>Cantidad en stock</label>
                    <input type="number" placeholder="0" value={cantidad === 0 ? '' : cantidad} onChange={(e) => { setCantidad(Number(e.target.value)); setErrores((prev) => ({ ...prev, cantidad: undefined })) }} />
                    {errores.cantidad && <span className="error-texto">{errores.cantidad}</span>}
                </div>

                <div>
                    <label>Ingredientes</label>
                    <input type="text" value={ingredientes} onChange={(e) => { setIngredientes(e.target.value); setErrores((prev) => ({ ...prev, ingredientes: undefined })) }} />
                    {errores.ingredientes && <span className="error-texto">{errores.ingredientes}</span>}
                </div>

                <div>
                    <label>Calorias</label>
                    <input type="number" placeholder="0" value={calorias === 0 ? '' : calorias} onChange={(e) => { setCalorias(Number(e.target.value)); setErrores((prev) => ({ ...prev, calorias: undefined })) }} />
                    {errores.calorias && <span className="error-texto">{errores.calorias}</span>}
                </div>

                <div>
                    <label>Es Saludable</label>
                    <input type="checkbox" checked={esSaludable} onChange={(e) => setEsSaludable(e.target.checked)} />
                </div>

                <div>
                    <label>Imagen del Insumo</label>
                    {/* el archivo se convierte a base64 en handleImagenChange */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImagenChange}
                    />
                    {/* vista previa de la imagen antes de guardar */}
                    {imagen && (
                        <Image
                            src={imagen}
                            alt="Vista previa"
                            width={80}
                            height={80}
                            unoptimized
                            className="imagen-preview"
                        />
                    )}
                    {errores.imagen && <span className="error-texto">{errores.imagen}</span>}
                </div>

                <button type="submit">{editId !== null ? 'Actualizar' : 'Guardar'}</button>
                {editId !== null && <button type="button" onClick={limpiarFormulario}>Cancelar</button>}
            </form>

            <div className="lista-crud">
                <h3>Lista de Insumos Registrados</h3>

                {/* componente reutilizable pa buscar en la tabla */}
                <BuscadorCrud
                    valor={busqueda}
                    placeholder="Buscar por nombre..."
                    onChange={(val) => setBusqueda(val)}
                />

                {insumosFiltrados.length === 0 ? (
                    <p>No hay insumos que coincidan con la busqueda</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Ingredientes</th>
                                <th>Calorias</th>
                                <th>Saludable</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {insumosFiltrados.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {/* imagen en base64 guardada directo en localStorage */}
                                        <Image
                                            src={item.imagen}
                                            alt={item.nombre}
                                            width={50}
                                            height={50}
                                            unoptimized
                                            className="imagen-tabla"
                                        />
                                    </td>
                                    <td>{item.nombre}</td>
                                    <td>${item.precio}</td>
                                    <td>{item.cantidad}</td>
                                    <td>{item.ingredientes}</td>
                                    <td>{item.calorias} kcal</td>
                                    <td>{item.esSaludable ? 'Si' : 'No'}</td>
                                    <td>
                                        <Link href={`/dashboard/insumos/${item.id}`}>
                                            <button type="button">Ver</button>
                                        </Link>
                                        <button type="button" onClick={() => iniciarEdicion(item)}>Editar</button>
                                        <button type="button" onClick={() => eliminarInsumo(item.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}