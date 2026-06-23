"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (usuario === "ADMIN" && password === "ADMIN1234") {
      login(usuario);
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <>
      <header className="header-principal">
        <div className="logo">
          <a href="#">CAFETERIA ANITASOL</a>
        </div>
      </header>

      <main className="main main-login">
        <section className="tarjeta-sesion">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin} className="formulario-sesion">
            <div className="grupo-input">
              <label htmlFor="usuario">Usuario</label>
              <input 
                type="text" 
                id="usuario" 
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)} 
                placeholder="Tu nombre de usuario" 
                required 
              />
            </div>
            <div className="grupo-input">
              <label htmlFor="password">Contraseña</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Tu contraseña" 
                required 
              />
            </div>
            {error && <p className="sesion-error-general">{error}</p>}
            <button type="submit" className="btn-enviar">Iniciar Sesión</button>
          </form>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-derechos">
            <p>&copy; 2026 Cafeteria Anitasol. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}