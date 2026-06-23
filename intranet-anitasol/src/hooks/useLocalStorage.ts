import { useState, useEffect, useRef } from 'react'

// hook que sincroniza cualquier estado con localStorage sin perder datos al navegar entre paginas
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
    // lee localStorage al iniciar pa arrancar con los datos ya guardados y no con el valor por defecto
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue
        try {
            const item = window.localStorage.getItem(key)
            return item ? (JSON.parse(item) as T) : initialValue
        } catch {
            return initialValue
        }
    })

    // evita que el efecto de abajo sobreescriba localStorage en el primer render
    const isFirstRender = useRef(true)

    // guarda en localStorage cada vez que el estado cambia pero se salta el primer render
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        if (typeof window === 'undefined') return
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue))
        } catch (err) {
            console.warn(`Error al guardar '${key}' en localStorage:`, err)
        }
    }, [key, storedValue])

    // escribe en localStorage de forma sincrona al actualizar pa no perder datos si el componente se desmonta rapido
    const setValue = (value: T | ((prev: T) => T)) => {
        setStoredValue((prev) => {
            const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value
            try {
                window.localStorage.setItem(key, JSON.stringify(next))
            } catch (err) {
                console.warn(`Error al guardar '${key}' en localStorage:`, err)
            }
            return next
        })
    }

    return [storedValue, setValue]
}