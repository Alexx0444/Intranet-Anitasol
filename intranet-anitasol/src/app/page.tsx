"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  // Traemos la función login de tu AuthContext
  const { login } = useAuth();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === "admin@anitasol.cl" && password === "123456") {
      // Ahora sí, guardamos en localStorage usando el contexto
      login(email);
      router.push("/insumos");
    } else {
      alert("Error: Usa admin@anitasol.cl y clave 123456");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900">
      <main className="w-full max-w-md bg-zinc-800 p-8 rounded-xl shadow-2xl border border-zinc-700">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Intranet AnitaSol</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Correo</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-zinc-900 border border-zinc-600 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Clave</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-zinc-900 border border-zinc-600 rounded-lg text-white"
              required
            />
          </div>
          <button type="submit" className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
            Ingresar
          </button>
        </form>
      </main>
    </div>
  );
}