export interface UsuarioSesion {
    nombre: string
    rol: string
}

export interface Insumo {
    id: string
    nombre: string
    precio: number
    cantidad: number
    ingredientes: string
    calorias: number
    esSaludable: boolean
    imagen: string
}

export interface Pedido {
    id: string
    cliente: string
    fecha: string
    total: number
    productos: string[]
    comentario: string
}

export interface Menu {
    id: string
    nombre: string
    insumos: string[]
    calorias: number
    precio: number
    estado: boolean
}