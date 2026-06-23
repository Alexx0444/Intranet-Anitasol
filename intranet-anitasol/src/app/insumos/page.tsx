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

  // Estados de búsqueda y edición
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // Estados del formulario
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

  const limpiarFormulario = () => {
    setNombre("");
    setPrecio("");
    setCantidad("");
    setIngredientes("");
    setCalorias("");
    setEsSaludable("si");
    setImagen("");
    setEditandoId(null);
  };

  // Crear o actualizar registro
  const guardarInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !precio.toString().trim() || !cantidad.toString().trim()) return;
    
    if (editandoId) {
      const insumosActualizados = insumos.map(i => 
        i.id === editandoId 
          ? { ...i, nombre, precio: Number(precio), cantidad: Number(cantidad), ingredientes, calorias: Number(calorias), esSaludable: esSaludable === "si", imagen }
          : i
      );
      setInsumos(insumosActualizados);
    } else {
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
    }
    
    limpiarFormulario();
  };

  // Cargar datos al formulario
  const iniciarEdicion = (insumo: Insumo) => {
    setEditandoId(insumo.id);
    setNombre(insumo.nombre);
    setPrecio(insumo.precio.toString());
    setCantidad(insumo.cantidad.toString());
    setIngredientes(insumo.ingredientes);
    setCalorias(insumo.calorias.toString());
    setEsSaludable(insumo.esSaludable ? "si" : "no");
    setImagen(insumo.imagen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarInsumo = (id: string) => {
    setInsumos(insumos.filter((item) => item.id !== id));
  };

  // Filtro de listado
  const insumosFiltrados = insumos.filter(i => 
    i.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

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
          <h2 className="panel-titulo">
            {editandoId ? "Editar Insumo" : "Agregar Nuevo Insumo"}
          </h2>
          <form onSubmit={guardarInsumo} className="formulario-contacto">
            
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
                <label>Imagen (Opcional al editar)</label>
                <input type="file" accept="image/*" onChange={handleImagen} required={!editandoId} />
                {editandoId && imagen && <p style={{fontSize: '0.8rem', color: 'green'}}>Imagen actual cargada</p>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn-enviar">
                {editandoId ? "Guardar Cambios" : "Guardar Insumo"}
              </button>
              {editandoId && (
                <button type="button" onClick={limpiarFormulario} className="btn-cancelar">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="panel-seccion">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <h2 className="panel-titulo" style={{ marginBottom: 0 }}><i className="fa-solid fa-box"></i> Inventario</h2>
            
            <div className="grupo-input" style={{ flex: '1', maxWidth: '300px' }}>
              <input 
                type="text" 
                placeholder="Buscar insumo por nombre..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          
          <div className="carrito-productos" style={{ marginTop: '20px' }}>
            {insumosFiltrados.length === 0 ? (
              <p style={{fontStyle: 'italic', color: 'gray'}}>No se encontraron insumos...</p>
            ) : (
              insumosFiltrados.map((i) => (
                <div key={i.id} className="carrito-item">
                  {i.imagen && <img src={i.imagen} alt={i.nombre} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />}
                  <div className="carrito-item-info" style={{ flex: 1, marginLeft: '15px' }}>
                    <p style={{fontSize: '1.1rem'}}>{i.nombre}</p>
                    <p>${i.precio} | Stock: {i.cantidad}</p>
                  </div>
                  <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end'}}>
                    
                    <button onClick={() => iniciarEdicion(i)} className="btn-enviar" style={{padding: '6px 12px', backgroundColor: '#f1c40f'}}>
                      Editar
                    </button>

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