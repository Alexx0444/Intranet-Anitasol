"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
interface Insumo {
  id: string;
  nombre: string;
  precio: number;
}

export default function InsumosPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  useEffect(() => {
    const guardados = localStorage.getItem("insumos_anitasol");
    if (guardados) setInsumos(JSON.parse(guardados));
  }, []);

  useEffect(() => {
    localStorage.setItem("insumos_anitasol", JSON.stringify(insumos));
  }, [insumos]);

  const agregarInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !precio.trim()) return;
    
    const nuevoInsumo: Insumo = { 
      id: Date.now().toString(), 
      nombre, 
      precio: Number(precio) 
    };
    
    setInsumos([...insumos, nuevoInsumo]);
    setNombre("");
    setPrecio("");
  };

  const eliminarInsumo = (id: string) => {
    setInsumos(insumos.filter((item) => item.id !== id));
  };

  if (!user) return null; 

  return (
    <>
      <header className="header-principal">
        <div className="logo">
            <a href="#">CAFETERIA ANITASOL</a>
        </div>
        <div className="header-controles">
            <button onClick={logout} className="btn-cancelar" style={{padding: '8px 16px', fontSize: '0.9rem'}}>
                Cerrar Sesión
            </button>
        </div>
      </header>

      {}
      <main className="main">
        {/* FORMULARIO */}
        <section className="seccion-contacto">
          <h2 className="panel-titulo">Agregar Nuevo Insumo</h2>
          <form onSubmit={agregarInsumo} className="formulario-contacto">
            <div className="grupo-input">
              <label>Nombre del Insumo</label>
              <input 
                type="text" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                placeholder="Ej: Harina"
                required 
              />
            </div>
            <div className="grupo-input">
              <label>Precio ($)</label>
              <input 
                type="number" 
                min="0"
                value={precio} 
                onChange={(e) => setPrecio(e.target.value)} 
                placeholder="Ej: 1500"
                required 
              />
            </div>
            <button type="submit" className="btn-enviar">Guardar Insumo</button>
          </form>
        </section>

        {/* LISTADO */}
        <section className="panel-seccion">
          <h2 className="panel-titulo"><i className="fa-solid fa-box"></i> Inventario de Insumos</h2>
          
          <div className="carrito-productos">
            {insumos.length === 0 ? (
              <p style={{fontStyle: 'italic', color: 'gray'}}>No hay insumos agregados todavía...</p>
            ) : (
              insumos.map((i) => (
                <div key={i.id} className="carrito-item">
                  <div className="carrito-item-info">
                    <p style={{fontSize: '1.1rem'}}>{i.nombre}</p>
                    <p>${i.precio}</p>
                  </div>
                  <div style={{display: 'flex', gap: '10px'}}>
                    {}
                    <Link href={`/insumos/${i.id}`}>
                      <button className="btn-enviar" style={{padding: '6px 12px'}}>Ver Detalle</button>
                    </Link>
                    <button onClick={() => eliminarInsumo(i.id)} className="btn-eliminar">
                      X Borrar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
}