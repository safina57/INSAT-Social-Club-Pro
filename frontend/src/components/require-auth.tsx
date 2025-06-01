import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const loc = useLocation()

  if (loading) {
    return <div>Loading…</div>
  }
  if (!isAuthenticated) {
    // redirect to login, preserve where we came from
    return <Navigate to="/signin" state={{ from: loc }} replace />
  }
  return children
}