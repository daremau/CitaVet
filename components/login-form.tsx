'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userRole', data.role)
        router.push(data.redirectUrl)
      } else {
        setErrorMessage('Usuario o contraseña inválidos')
      }
    } catch (error) {
      console.error('Error during login:', error)
      setErrorMessage('Error al iniciar sesión. Por favor, inténtelo de nuevo.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="text-red-500 text-sm">
          {errorMessage}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="username" className="text-gray-700">Usuario</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded-md"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-black text-white hover:bg-black/90"
      >
        Iniciar Sesión
      </Button>
      <div className="text-center text-sm">
        <span className="text-gray-600">¿No tienes una cuenta? </span>
        <Link href="/register" className="text-blue-500 hover:underline">
          Crear cuenta
        </Link>
      </div>
    </form>
  )
}

