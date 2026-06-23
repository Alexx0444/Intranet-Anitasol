"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Insumo {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  ingredientes: string;
  calorias: number;
  esSaludable: boolean;
  imagen: string;
}

export default function DetalleInsumoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [insumo, setInsumo] = useState<Insumo | null>(null);

  useEffect(() => {
    const guardados = localStorage.getItem("insumos_anitasol");
    if (guardados) {
      const lista: Insumo[] = JSON.parse(guardados);
      const encontrado = lista.find(item => item.id === id);
      if (encontrado) {
        setInsumo(encontrado);
      } else {
        router.push("/insumos");
      }
    }
  }, [id, router]);

  if (!insumo) return <p style={{textAlign: "center", padding: "50px"}}>Cargando...</p>;

  return (
    <>
      <header className="header-principal">
        <div className="logo"><a href="/insumos">CAFETERIA ANITASOL</a></div>
      </header>

      <main className="main main-login">
        <section className="tarjeta-sesion" style={{ maxWidth: '600px' }}>
            <h2 style={{marginBottom: '20px'}}>Ficha Técnica del Producto</h2>
            
            {insumo.imagen && (
              <img 
                src={insumo.imagen} 
                alt={insumo.nombre} 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px', border: '2px solid var(--rosa)' }} 
              />
            )}

            <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <div className="grupo-input">
                    <label>ID de Registro:</label>
                    <input type="text" value={insumo.id} disabled />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="grupo-input">
                        <label>Nombre:</label>
                        <input type="text" value={insumo.nombre} disabled />
                    </div>
                    <div className="grupo-input">
                        <label>Valor Unitario:</label>
                        <input type="text" value={`$${insumo.precio}`} disabled />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="grupo-input">
                        <label>Stock Disponible:</label>
                        <input type="text" value={`${insumo.cantidad} unidades`} disabled />
                    </div>
                    <div className="grupo-input">
                        <label>Calorías:</label>
                        <input type="text" value={`${insumo.calorias} kcal`} disabled />
                    </div>
                </div>
                <div className="grupo-input">
                    <label>Perfil Nutricional:</label>
                    <input 
                      type="text" 
                      value={insumo.esSaludable ? "🟢 Saludable / Aprobado" : "🔴 Alto en sellos / No saludable"} 
                      style={{ backgroundColor: insumo.esSaludable ? "var(--ok-bg)" : "var(--error-bg)", color: insumo.esSaludable ? "var(--ok)" : "var(--error)", fontWeight: 'bold' }}
                      disabled 
                    />
                </div>
                <div className="grupo-input">
                    <label>Ingredientes:</label>
                    <textarea value={insumo.ingredientes} disabled style={{ minHeight: '60px', padding: '12px', borderRadius: '6px', border: '1px solid var(--borde-blanco)' }} />
                </div>
            </div>
            
            <div style={{marginTop: '30px', width: '100%'}}>
                <Link href="/insumos">
                <button className="btn-cancelar" style={{width: '100%'}}>Volver al Inventario</button>
                </Link>
            </div>
        </section>
      </main>
    </>
  );
}