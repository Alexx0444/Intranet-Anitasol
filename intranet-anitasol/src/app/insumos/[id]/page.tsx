"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Insumo {
  id: string;
  nombre: string;
  precio: number;
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
        <section className="tarjeta-sesion">
            <h2 style={{marginBottom: '20px'}}>Detalle Técnico del Insumo</h2>
            
            <div style={{width: '100%', fontSize: '1.1rem', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <div className="grupo-input">
                    <label>ID de Registro:</label>
                    <input type="text" value={insumo.id} disabled />
                </div>
                <div className="grupo-input">
                    <label>Nombre:</label>
                    <input type="text" value={insumo.nombre} disabled />
                </div>
                <div className="grupo-input">
                    <label>Valor Unitario:</label>
                    <input type="text" value={`$${insumo.precio}`} disabled />
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