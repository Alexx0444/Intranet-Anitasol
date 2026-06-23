"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
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

export default function InsumosPage() {
  const { user, logout, cargando } = useAuth();
  const router = useRouter();
  
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [primeraCarga, setPrimeraCarga] = useState(true);

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [calorias, setCalorias] = useState("");
  const [esSaludable, setEsSaludable] = useState("si");
  const [imagen, setImagen] = useState("");

  useEffect(() => {
    if (!cargando && !user) router.push("/");
  }, [user, cargando, router]);

  useEffect(() => {
    const guardados = localStorage.getItem("insumos_anitasol");
    if (guardados) setInsumos(JSON.parse(guardados));
    setPrimeraCarga(false);
  }, []);

  useEffect(() => {
    if (!primeraCarga) {
      localStorage.setItem("insumos_anitasol", JSON.stringify(insumos));
    }
  }, [insumos, primeraCarga]);

  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagen(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const agregarInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !precio.trim() || !cantidad.trim()) return;
    
    const nuevoInsumo: Insumo = { 
      id: Date.now().toString(), 
      nombre, 
      precio: Number(precio),
      cantidad: Number(cantidad),
      ingredientes,
      calorias: Number(calorias),
      esSaludable: esSaludable === "si",
      imagen
    };
    
    setInsumos([...insumos, nuevoInsumo]);
    
    setNombre("");
    setPrecio("");
    setCantidad("");
    setIngredientes("");
    setCalorias("");
    setEsSaludable("si");
    setImagen("");
  };

  const eliminarInsumo = (id: string) => {
    setInsumos(insumos.filter((item) => item.id !== id));
  };

  if (cargando) return <p style={{textAlign: "center", padding: "50px"}}>Cargando...</p>;
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

      <main className="main">
        <section className="seccion-contacto" style={{ maxWidth: '800px' }}>
          <h2 className="panel-titulo">Agregar Nuevo Insumo / Producto</h2>
          <form onSubmit={agregarInsumo} className="formulario-contacto">
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="grupo-input">
                <label>Nombre</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="grupo-input">
                <label>Precio ($)</label>
                <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
              </div>
              <div className="grupo-input">
                <label>Cantidad en stock</label>
                <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
              </div>
              <div className="grupo-input">
                <label>Calorías (kcal)</label>
                <input type="number" value={calorias} onChange={(e) => setCalorias(e.target.value)} required />
              </div>
            </div>

            <div className="grupo-input">
              <label>Ingredientes (separados por coma)</label>
              <textarea value={ingredientes} onChange={(e) => setIngredientes(e.target.value)} style={{ minHeight: '80px', padding: '12px', borderRadius: '6px', border: '1px solid var(--rosa-borde)' }} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="grupo-input">
                <label>¿Es Saludable?</label>
                <select value={esSaludable} onChange={(e) => setEsSaludable(e.target.value)}>
                  <option value="si">Sí, es saludable</option>
                  <option value="no">No, alto en sellos</option>
                </select>
              </div>
              <div className="grupo-input">
                <label>Imagen</label>
                <input type="file" accept="image/*" onChange={handleImagen} required />
              </div>
            </div>

            <button type="submit" className="btn-enviar" style={{ marginTop: '10px' }}>Guardar Insumo</button>
          </form>
        </section>

        <section className="panel-seccion">
          <h2 className="panel-titulo"><i className="fa-solid fa-box"></i> Inventario</h2>
          <div className="carrito-productos">
            {insumos.length === 0 ? (
              <p style={{fontStyle: 'italic', color: 'gray'}}>No hay insumos agregados todavía...</p>
            ) : (
              insumos.map((i) => (
                <div key={i.id} className="carrito-item">
                  {i.imagen && <img src={i.imagen} alt={i.nombre} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />}
                  <div className="carrito-item-info" style={{ flex: 1, marginLeft: '15px' }}>
                    <p style={{fontSize: '1.1rem'}}>{i.nombre}</p>
                    <p>${i.precio} | Stock: {i.cantidad}</p>
                  </div>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <Link href={`/insumos/${i.id}`}>
                      <button className="btn-enviar" style={{padding: '6px 12px'}}>Ver Detalle</button>
                    </Link>
                    <button onClick={() => eliminarInsumo(i.id)} className="btn-eliminar">Borrar</button>
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