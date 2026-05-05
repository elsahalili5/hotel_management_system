import { createContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  type AuthUser,
  type LoginUserInput,
  type LoginUserResponse,
  type RoleType,
} from '@mansio/shared'
import { authApi } from '../api/auth-api'
import LoadingUser from './loading-user'

export const AUTH_STORAGE_KEY = 'mansio-auth'

type StoredAuth = {
  accessToken: string
  refreshToken: string
}

export type AuthContextValue = {
  isAuthenticated: boolean
  user: AuthUser | null
  accessToken: string | null
  login: (payload: LoginUserInput) => Promise<LoginUserResponse>
  logout: () => void
  setSession: (session: LoginUserResponse) => void
  hasRole: (role: RoleType) => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)

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
  const [initialState] = useState<StoredAuth | null>(() => readStoredAuth())
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(initialState?.accessToken))
  const [accessToken, setAccessToken] = useState<string | null>(
    initialState?.accessToken ?? null,
  )

  useEffect(() => {
    if (!initialState?.accessToken || user) {
      return
    }

    setIsLoading(true)

    const loadCurrentUser = async () => {
      try {
        const currentUser = await authApi.me()
        setUser(currentUser)
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            accessToken: initialState.accessToken,
            refreshToken: initialState.refreshToken,
          }),
        )
      } catch {
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    loadCurrentUser()
  }, [initialState?.accessToken, user])

  const hasRole = (role: RoleType) => {
    return (
      user?.user_roles.some((userRole) => userRole.role?.name === role) ?? false
    )
  }

  const setSession = (session: LoginUserResponse) => {
    const stored: StoredAuth = {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    }
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
      hasRole,
    }),
    [accessToken, user, hasRole],
  )

  if (isLoading) {
    return <LoadingUser />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
