
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedAdminRoute = () => {
  const token = localStorage.getItem('token')

  let user = null

  try {
    user = JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    user = null
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedAdminRoute
