# Intranet Anitasol

Sistema de gestión interna para la cafetería **Anitasol**, desarrollado con **React + TypeScript** como parte de la Evaluación Sumativa 3 de Programación FrontEnd (TI2031 — Otoño 2026).

---

## Contexto del Proyecto

Anitasol es una cafetería que necesita una intranet para que su personal administrativo pueda gestionar los insumos disponibles, el menú ofrecido y los pedidos recibidos. El sistema funciona completamente en el navegador con persistencia en `localStorage`, sin depender de un servidor externo en esta entrega.

---

## Módulos Implementados

### 1. Autenticación
- Login simulado con credenciales hardcodeadas (`admin / admin123`).
- La sesión se guarda en `localStorage` y se comparte globalmente mediante `AuthContext` (useContext).
- Todas las rutas del dashboard están protegidas: si no hay sesión activa, la app redirige automáticamente al login.
- El botón **"Cerrar sesión"** limpia el contexto y el `localStorage`, y redirige al login.

### 2. Insumos
CRUD completo para los insumos de la cafetería.
- **Crear:** Formulario con campos controlados (nombre, precio, cantidad, ingredientes, calorías, si es saludable, imagen en base64).
- **Leer:** Listado en tabla con filtro de búsqueda en tiempo real por nombre.
- **Editar:** Carga los datos del insumo seleccionado en el formulario para su modificación.
- **Eliminar:** Con confirmación antes de borrar.
- **Detalle:** Ruta dinámica `/dashboard/insumos/:id` que muestra la ficha completa del insumo (usa `useParams`).
- Las imágenes se convierten a base64 para persistir en `localStorage` sin necesitar servidor.

### 3. Menú
CRUD completo para los productos del menú.
- **Crear:** Formulario con nombre, insumos utilizados (separados por coma), calorías, precio y disponibilidad.
- **Leer:** Listado en tabla con filtro de búsqueda en tiempo real por nombre.
- **Editar:** Permite actualizar cualquier campo del producto.
- **Eliminar:** Con confirmación antes de borrar.
- El campo "Disponible" controla si el producto aparece como opción en el módulo de Pedidos.

### 4. Pedidos
CRUD completo para el registro de pedidos.
- **Crear:** Formulario con cliente, fecha, total, comentario y selección de productos mediante checkboxes.
- **Leer:** Historial de pedidos en tabla con filtro de búsqueda en tiempo real por nombre de cliente.
- **Editar:** Permite modificar cualquier campo del pedido.
- **Eliminar:** Con confirmación antes de borrar.
- Los productos disponibles se cargan dinámicamente desde el módulo de Menú (solo los marcados como disponibles).

---

## Flujo de Datos Principal

1. El personal inicia sesión con sus credenciales.
2. El `AuthContext` guarda la sesión en `localStorage` y la expone globalmente.
3. El usuario accede al módulo de **Insumos** y registra los ingredientes disponibles.
4. En el módulo de **Menú** crea productos usando esos insumos y los marca como disponibles.
5. En el módulo de **Pedidos** registra un pedido seleccionando productos del menú activo.
6. Toda la información persiste en `localStorage`: al recargar la página, los datos se mantienen.

---

## Hooks Utilizados

| Hook | Uso en el proyecto |
|---|---|
| `useState` | Control de todos los campos de formulario, errores de validación y mensajes de feedback |
| `useEffect` | Carga de datos desde `localStorage` al montar cada módulo; carga del menú disponible en Pedidos |
| `useContext` | Acceso al `AuthContext` desde cualquier componente (nombre, rol, logout) |
| `useParams` | Lectura del parámetro `:id` en la ruta de detalle de insumo |
| `useMemo` | Filtrado eficiente de listados sin recalcular en cada render |
| `useCallback` | Estabilización de las funciones `login` y `logout` en el contexto |
| `useRef` | Control del primer render en el hook `useLocalStorage` para no sobreescribir datos |

---

## Estructura de Carpetas

```
src/
├── app/
│   ├── layout.tsx              # RootLayout con AuthProvider
│   ├── page.tsx                # Redirige al dashboard
│   ├── login/
│   │   └── page.tsx            # Página de login
│   └── dashboard/
│       ├── layout.tsx          # Navbar + ProtectedRoute
│       ├── page.tsx            # Redirige a /insumos
│       ├── insumos/
│       │   ├── page.tsx        # CRUD de insumos
│       │   └── [id]/
│       │       └── page.tsx    # Detalle de insumo (ruta dinámica)
│       ├── menu/
│       │   └── page.tsx        # CRUD de menú
│       └── pedidos/
│           └── page.tsx        # CRUD de pedidos
├── components/
│   ├── BuscadorCrud.tsx        # Input de búsqueda reutilizable
│   ├── MensajeFeedback.tsx     # Mensajes de éxito/error reutilizables
│   └── ProtectedRoute.tsx      # HOC que protege rutas privadas
├── context/
│   └── AuthContext.tsx         # Contexto global de autenticación
├── hooks/
│   └── useLocalStorage.ts      # Hook genérico de persistencia
├── types/
│   └── index.ts                # Interfaces: UsuarioSesion, Insumo, Menu, Pedido
└── globals.css                 # Estilos globales con tokens CSS
```

---

## TypeScript

Todas las entidades del dominio están tipadas:

- `UsuarioSesion` — datos del usuario logueado
- `Insumo` — datos del insumo (nombre, precio, cantidad, imagen, etc.)
- `Menu` — producto del menú (nombre, insumos, calorías, precio, estado)
- `Pedido` — pedido registrado (cliente, fecha, total, productos, comentario)

Todos los componentes tipan sus props mediante `interface`. No se usa `any`.

---

## Cómo Ejecutar Localmente

### Requisitos

- Node.js 18 o superior
- npm 9 o superior

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La app estará disponible en [http://localhost:3000](http://localhost:3000).

### Credenciales de acceso

| Usuario | Contraseña |
|---|---|
| `admin` | `admin123` |

---

## Tecnologías

- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- `localStorage` para persistencia de datos

---

## Lo que NO se implementa en esta entrega

- Autenticación real con base de datos (se migra a Firebase en ES4).
- Roles diferenciados con permisos distintos por módulo.
- Carga de imágenes a un servidor externo (se usa base64 en localStorage).
- Reportes o exportación de datos.

---

## Notas de Desarrollo

- Las imágenes de insumos se limitan a **2MB** y se validan por tipo (`image/*`) antes de convertirse a base64.
- El hook `useLocalStorage` escribe de forma síncrona al actualizar para evitar pérdida de datos si el componente se desmonta rápido.
- El `AuthContext` usa inicialización lazy en `useState` para leer `localStorage` una sola vez sin necesitar `useEffect`.
- `ProtectedRoute` usa un flag `listo` para evitar diferencias de hidratación entre servidor y cliente en Next.js.
