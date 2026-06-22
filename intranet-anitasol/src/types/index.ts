export interface User {
  id: string;
  email: string;
  nombre: string;
}

export interface Insumo {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  ingredientes: string;
  calorias: number;
  esSaludable: boolean;
  imagen: string; 
}

export interface Menu {
  id: string;
  nombre: string;
  insumos: string;
  calorias: number;
  precio: number;
  estado: boolean; 
}