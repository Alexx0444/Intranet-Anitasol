'use client'

// modulo de pedidos con CRUD completo
// los productos disponibles se sacan del menu que ya esta en localStorage

import React, { useState, useEffect, useMemo } from 'react'
import { useLocalStorage } from '../../../hooks/useLocalStorage'
import { BuscadorCrud } from '../../../components/BuscadorCrud'
import { MensajeFeedback } from '../../../components/MensajeFeedback'
import { Pedido, Menu } from '../../../types'

interface ErroresPedido {
    cliente?: string
    fecha?: string
    total?: string
    productos?: string
}

export default function PedidosPage() {
    const [pedidos, setPedidos] = useLocalStorage<Pedido[]>('anitasol_pedidos', [])
    const [menuDisponible, setMenuDisponible] = useState<Menu[]>([])

    const [cliente, setCliente] = useState('')
    const [fecha, setFecha] = useState('')
    const [total, setTotal] = useState(0)
    const [productosSeleccionados, setProductosSeleccionados] = useState<string[]>([])
    const [comentario, setComentario] = useState('')
    const [editId, setEditId] = useState<string | null>(null)
    const [busqueda, setBusqueda] = useState('')
    const [errores, setErrores] = useState<ErroresPedido>({})
    const [mensajeOk, setMensajeOk] = useState('')

    // carga los pedidos guardados al entrar a la pagina
    useEffect(() => {
        const datos = localStorage.getItem('anitasol_pedidos')
        if (datos) {
            try {
                setPedidos(JSON.parse(datos) as Pedido[])
            } catch (err) {
                console.warn('Error al cargar pedidos desde localStorage:', err)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // carga solo los productos del menu que esten disponibles pa mostrarlos como opciones
    useEffect(() => {
        const datos = localStorage.getItem('anitasol_menu')
        if (datos) {
            try {
                const lista = JSON.parse(datos) as Menu[]
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setMenuDisponible(lista.filter((m) => m.estado))
            } catch (err) {
                console.warn('Error al cargar menu desde localStorage:', err)
            }
        }
    }, [])

    // filtra los pedidos segun lo que escribe el usuario en el buscador
    const pedidosFiltrados = useMemo(() => {
        return pedidos.filter((item) =>
            item.cliente.toLowerCase().includes(busqueda.toLowerCase())
        )
    }, [pedidos, busqueda])

    const toggleProducto = (nombreProducto: string) => {
        setProductosSeleccionados((prev) =>
            prev.includes(nombreProducto)
                ? prev.filter((p) => p !== nombreProducto)
                : [...prev, nombreProducto]
        )
        setErrores((prev) => ({ ...prev, productos: undefined }))
    }

    const validar = (): boolean => {
        const nuevosErrores: ErroresPedido = {}
        if (!cliente.trim()) nuevosErrores.cliente = 'El nombre del cliente es obligatorio'
        if (!fecha) nuevosErrores.fecha = 'La fecha es obligatoria'
        if (total <= 0) nuevosErrores.total = 'El total debe ser mayor a 0'
        if (productosSeleccionados.length === 0) nuevosErrores.productos = 'Debes seleccionar al menos un producto'
        setErrores(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validar()) return

        if (editId !== null) {
            const actualizados = pedidos.map((p) =>
                p.id === editId
                    ? { id: editId, cliente, fecha, total: Number(total), productos: productosSeleccionados, comentario }
                    : p
            )
            setPedidos(actualizados)
            setEditId(null)
            setMensajeOk('Pedido actualizado correctamente')
        } else {
            const nuevoPedido: Pedido = {
                id: crypto.randomUUID(),
                cliente,
                fecha,
                total: Number(total),
                productos: productosSeleccionados,
                comentario,
            }
            setPedidos([...pedidos, nuevoPedido])
            setMensajeOk('Pedido registrado correctamente')
        }
        limpiarFormulario()
        setTimeout(() => setMensajeOk(''), 3000)
    }

    const iniciarEdicion = (item: Pedido) => {
        setCliente(item.cliente)
        setFecha(item.fecha)
        setTotal(item.total)
        setProductosSeleccionados(item.productos)
        setComentario(item.comentario)
        setEditId(item.id)
        setErrores({})
        setMensajeOk('')
    }

    const eliminarPedido = (id: string) => {
        if (!confirm('Seguro que deseas eliminar este pedido')) return
        setPedidos(pedidos.filter((p) => p.id !== id))
        setMensajeOk('Pedido eliminado')
        setTimeout(() => setMensajeOk(''), 3000)
    }

    const limpiarFormulario = () => {
        setCliente('')
        setFecha('')
        setTotal(0)
        setProductosSeleccionados([])
        setComentario('')
        setEditId(null)
        setErrores({})
    }

    return (
        <div>
            <h2 className="panel-titulo">Control de Pedidos</h2>

            <form onSubmit={handleSubmit} className="form-crud">
                <h3>{editId !== null ? 'Editar Pedido' : 'Registrar Pedido'}</h3>

                <MensajeFeedback tipo="ok" mensaje={mensajeOk} />

                <div>
                    <label>Cliente</label>
                    <input type="text" value={cliente} onChange={(e) => { setCliente(e.target.value); setErrores((prev) => ({ ...prev, cliente: undefined })) }} />
                    {errores.cliente && <span className="error-texto">{errores.cliente}</span>}
                </div>

                <div>
                    <label>Fecha</label>
                    <input type="date" value={fecha} onChange={(e) => { setFecha(e.target.value); setErrores((prev) => ({ ...prev, fecha: undefined })) }} />
                    {errores.fecha && <span className="error-texto">{errores.fecha}</span>}
                </div>

                <div>
                    <label>Total ($)</label>
                    <input type="number" placeholder="0" value={total === 0 ? '' : total} onChange={(e) => { setTotal(Number(e.target.value)); setErrores((prev) => ({ ...prev, total: undefined })) }} />
                    {errores.total && <span className="error-texto">{errores.total}</span>}
                </div>

                <div>
                    <label>Productos del pedido</label>
                    {menuDisponible.length === 0 ? (
                        <p className="error-texto">No hay productos disponibles. Agrega productos en el modulo de Menu primero.</p>
                    ) : (
                        <div className="lista-checkboxes">
                            {menuDisponible.map((producto) => (
                                <label key={producto.id} className="checkbox-producto">
                                    <input
                                        type="checkbox"
                                        checked={productosSeleccionados.includes(producto.nombre)}
                                        onChange={() => toggleProducto(producto.nombre)}
                                    />
                                    {producto.nombre} — ${producto.precio}
                                </label>
                            ))}
                        </div>
                    )}
                    {errores.productos && <span className="error-texto">{errores.productos}</span>}
                </div>

                <div>
                    <label>Comentario</label>
                    <input type="text" value={comentario} onChange={(e) => setComentario(e.target.value)} />
                </div>

                <button type="submit">{editId !== null ? 'Actualizar' : 'Guardar'}</button>
                {editId !== null && <button type="button" onClick={limpiarFormulario}>Cancelar</button>}
            </form>

            <div className="lista-crud">
                <h3>Historial de Pedidos</h3>

                <BuscadorCrud
                    valor={busqueda}
                    placeholder="Buscar por cliente..."
                    onChange={(val) => setBusqueda(val)}
                />

                {pedidosFiltrados.length === 0 ? (
                    <p>No hay pedidos que coincidan con la busqueda</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Productos</th>
                                <th>Comentario</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidosFiltrados.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.cliente}</td>
                                    <td>{item.fecha}</td>
                                    <td>${item.total}</td>
                                    <td>{item.productos.join(', ')}</td>
                                    <td>{item.comentario || '—'}</td>
                                    <td>
                                        <button type="button" onClick={() => iniciarEdicion(item)}>Editar</button>
                                        <button type="button" onClick={() => eliminarPedido(item.id)}>Eliminar</button>
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