import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthUser, LoginUserInput, LoginUserResponse } from '@mansio/shared/auth'
import { authApi } from './api/auth-api'

const AUTH_STORAGE_KEY = 'mansio-auth'

type StoredAuth = {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export type AuthContextValue = {
  isAuthenticated: boolean
  user: AuthUser | null
  accessToken: string | null
  login: (payload: LoginUserInput) => Promise<LoginUserResponse>
  logout: () => void
  setSession: (session: LoginUserResponse) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredAuth(): StoredAuth | null {
  const rawValue = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!rawValue) return null

  try {
    return JSON.parse(rawValue) as StoredAuth
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialState = readStoredAuth()
  const [user, setUser] = useState<AuthUser | null>(initialState?.user ?? null)
  const [accessToken, setAccessToken] = useState<string | null>(
    initialState?.accessToken ?? null,
  )

  const setSession = (session: LoginUserResponse) => {
    const stored: StoredAuth = {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: session.user,
    }

    console.log('setSession', stored)
    setUser(session.user)
    setAccessToken(session.accessToken)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stored))
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const login = async (payload: LoginUserInput) => {
    const session = await authApi.login(payload)
    setSession(session)
    return session
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user && accessToken),
      user,
      accessToken,
      login,
      logout,
      setSession,
    }),
    [accessToken, user],
  )


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
