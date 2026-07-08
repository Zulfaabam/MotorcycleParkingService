import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/api'
import type { UserDto } from '@/types'

interface AuthContextType {
  user: UserDto | null
  token: string | null
  loading: boolean
  login: (token: string, user: UserDto) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserDto | null>(null)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('parking_token'),
  )
  const [loading, setLoading] = useState(true)

  const login = (newToken: string, newUser: UserDto) => {
    localStorage.setItem('parking_token', newToken)
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('parking_token')
    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('parking_token')
      if (storedToken) {
        try {
          const res = await authApi.getMe()
          if (res.success && res.data) {
            setUser(res.data)
          } else {
            logout()
          }
        } catch (err) {
          console.error('Failed to initialize user session:', err)
          logout()
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
