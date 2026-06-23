'use client'

// modulo del menu con CRUD completo y persistencia en localStorage

import React, { useState, useEffect, useMemo } from 'react'
import { useLocalStorage } from '../../../hooks/useLocalStorage'
import { BuscadorCrud } from '../../../components/BuscadorCrud'
import { MensajeFeedback } from '../../../components/MensajeFeedback'
import { Menu } from '../../../types'

interface ErroresMenu {
    nombre?: string
    insumos?: string
    calorias?: string
    precio?: string
}

export default function MenuPage() {
    const [menuList, setMenuList] = useLocalStorage<Menu[]>('anitasol_menu', [])

    const [nombre, setNombre] = useState('')
    const [insumos, setInsumos] = useState('')
    const [calorias, setCalorias] = useState(0)
    const [precio, setPrecio] = useState(0)
    const [estado, setEstado] = useState(true)
    const [editId, setEditId] = useState<string | null>(null)
    const [busqueda, setBusqueda] = useState('')
    const [errores, setErrores] = useState<ErroresMenu>({})
    const [mensajeOk, setMensajeOk] = useState('')

    // carga el menu guardado al entrar a la pagina
    useEffect(() => {
        const datos = localStorage.getItem('anitasol_menu')
        if (datos) {
            try {
                setMenuList(JSON.parse(datos) as Menu[])
            } catch (err) {
                console.warn('Error al cargar menu desde localStorage:', err)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // filtra los productos segun lo que escribe el usuario en el buscador
    const menuFiltrado = useMemo(() => {
        return menuList.filter((item) =>
            item.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )
    }, [menuList, busqueda])

    const validar = (): boolean => {
        const nuevosErrores: ErroresMenu = {}
        if (!nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio'
        if (!insumos.trim()) nuevosErrores.insumos = 'Debes indicar al menos un insumo'
        if (calorias < 0) nuevosErrores.calorias = 'Las calorias no pueden ser negativas'
        if (precio <= 0) nuevosErrores.precio = 'El precio debe ser mayor a 0'
        setErrores(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validar()) return

        // convierte el string de insumos separados por coma a un array limpio
        const listaInsumos = insumos.split(',').map((i) => i.trim()).filter(Boolean)

        if (editId !== null) {
            const actualizados = menuList.map((m) =>
                m.id === editId
                    ? { id: editId, nombre, insumos: listaInsumos, calorias: Number(calorias), precio: Number(precio), estado }
                    : m
            )
            setMenuList(actualizados)
            setEditId(null)
            setMensajeOk('Producto actualizado correctamente')
        } else {
            const nuevoMenu: Menu = {
                id: crypto.randomUUID(),
                nombre,
                insumos: listaInsumos,
                calorias: Number(calorias),
                precio: Number(precio),
                estado,
            }
            setMenuList([...menuList, nuevoMenu])
            setMensajeOk('Producto agregado correctamente')
        }
        limpiarFormulario()
        setTimeout(() => setMensajeOk(''), 3000)
    }

    const iniciarEdicion = (item: Menu) => {
        setNombre(item.nombre)
        setInsumos(item.insumos.join(', '))
        setCalorias(item.calorias)
        setPrecio(item.precio)
        setEstado(item.estado)
        setEditId(item.id)
        setErrores({})
        setMensajeOk('')
    }

    const eliminarMenu = (id: string) => {
        if (!confirm('Seguro que deseas eliminar este producto')) return
        setMenuList(menuList.filter((m) => m.id !== id))
        setMensajeOk('Producto eliminado')
        setTimeout(() => setMensajeOk(''), 3000)
    }

    const limpiarFormulario = () => {
        setNombre('')
        setInsumos('')
        setCalorias(0)
        setPrecio(0)
        setEstado(true)
        setEditId(null)
        setErrores({})
    }

    return (
        <div>
            <h2 className="panel-titulo">Gestion de Menu</h2>

            <form onSubmit={handleSubmit} className="form-crud">
                <h3>{editId !== null ? 'Editar Producto' : 'Agregar Producto'}</h3>

                <MensajeFeedback tipo="ok" mensaje={mensajeOk} />

                <div>
                    <label>Nombre del producto</label>
                    <input type="text" value={nombre} onChange={(e) => { setNombre(e.target.value); setErrores((prev) => ({ ...prev, nombre: undefined })) }} />
                    {errores.nombre && <span className="error-texto">{errores.nombre}</span>}
                </div>

                <div>
                    <label>Insumos utilizados (separados por coma)</label>
                    <input type="text" value={insumos} onChange={(e) => { setInsumos(e.target.value); setErrores((prev) => ({ ...prev, insumos: undefined })) }} />
                    {errores.insumos && <span className="error-texto">{errores.insumos}</span>}
                </div>

                <div>
                    <label>Calorias</label>
                    <input type="number" placeholder="0" value={calorias === 0 ? '' : calorias} onChange={(e) => { setCalorias(Number(e.target.value)); setErrores((prev) => ({ ...prev, calorias: undefined })) }} />
                    {errores.calorias && <span className="error-texto">{errores.calorias}</span>}
                </div>

                <div>
                    <label>Precio</label>
                    <input type="number" placeholder="0" value={precio === 0 ? '' : precio} onChange={(e) => { setPrecio(Number(e.target.value)); setErrores((prev) => ({ ...prev, precio: undefined })) }} />
                    {errores.precio && <span className="error-texto">{errores.precio}</span>}
                </div>

                <div>
                    <label>Disponible en el menu</label>
                    <input type="checkbox" checked={estado} onChange={(e) => setEstado(e.target.checked)} />
                </div>

                <button type="submit">{editId !== null ? 'Actualizar' : 'Guardar'}</button>
                {editId !== null && <button type="button" onClick={limpiarFormulario}>Cancelar</button>}
            </form>

            <div className="lista-crud">
                <h3>Productos en el Menu</h3>

                <BuscadorCrud
                    valor={busqueda}
                    placeholder="Buscar por nombre..."
                    onChange={(val) => setBusqueda(val)}
                />

                {menuFiltrado.length === 0 ? (
                    <p>No hay productos que coincidan con la busqueda</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Insumos</th>
                                <th>Calorias</th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menuFiltrado.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.nombre}</td>
                                    <td>{item.insumos.join(', ')}</td>
                                    <td>{item.calorias} kcal</td>
                                    <td>${item.precio}</td>
                                    <td>{item.estado ? 'Disponible' : 'Agotado'}</td>
                                    <td>
                                        <button type="button" onClick={() => iniciarEdicion(item)}>Editar</button>
                                        <button type="button" onClick={() => eliminarMenu(item.id)}>Eliminar</button>
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