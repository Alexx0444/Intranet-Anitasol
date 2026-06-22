"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Insumo {
  id: number;
  nombre: string;
  precio: string;
}

export default function InsumosPage() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const guardados = localStorage.getItem("insumos_data");
    if (guardados) {
      try {
        setInsumos(JSON.parse(guardados));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("insumos_data", JSON.stringify(insumos));
  }, [insumos]);

  const agregarInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !precio.trim()) return;
    
    const nuevoInsumo: Insumo = { 
      id: Date.now(), 
      nombre, 
      precio 
    };
    
    setInsumos([...insumos, nuevoInsumo]);
    setNombre("");
    setPrecio("");
  };

  const eliminarInsumo = (id: number) => {
    setInsumos(insumos.filter((item) => item.id !== id));
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="p-8 bg-zinc-900 min-h-screen text-white">
      <button 
        onClick={handleLogout}
        className="bg-zinc-700 hover:bg-red-900 text-white px-4 py-2 rounded mb-4"
      >
        Cerrar Sesión
      </button>

      <h1 className="text-3xl font-bold mb-6">Gestión de Insumos</h1>
      
      <form onSubmit={agregarInsumo} className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 mb-8 flex gap-4">
        <input 
          placeholder="Nombre del insumo" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          className="p-2 bg-zinc-900 border border-zinc-600 rounded flex-1" 
          required 
        />
        <input 
          placeholder="Precio" 
          type="number" 
          min="0"
          value={precio} 
          onChange={(e) => setPrecio(e.target.value)} 
          className="p-2 bg-zinc-900 border border-zinc-600 rounded w-32" 
          required 
        />
        <button className="bg-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-700 transition">
          Agregar
        </button>
      </form>

      <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700">
        <h2 className="text-xl font-semibold mb-4">Lista de Insumos</h2>
        
        {insumos.length === 0 ? (
          <p className="text-zinc-500 italic">No hay insumos agregados todavía...</p>
        ) : (
          <ul className="space-y-2">
            {insumos.map((i) => (
              <li key={i.id} className="border-b border-zinc-700 py-3 flex justify-between items-center">
                <span>{i.nombre} - ${i.precio}</span>
                <button 
                  onClick={() => eliminarInsumo(i.id)}
                  className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}