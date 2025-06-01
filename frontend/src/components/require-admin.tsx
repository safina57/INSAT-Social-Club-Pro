import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export const RequireAdmin: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const loc = useLocation()

  if (loading) {
    return <div>Loading…</div>
  }
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: loc }} replace />
  }
  if (!isAdmin) {
    // e.g. redirect or show “Not authorized”
    return <Navigate to="/home" replace />
  }
  return children
}