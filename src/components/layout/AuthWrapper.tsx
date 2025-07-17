'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import MainLayout from './MainLayout'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

interface AuthWrapperProps {
  children: React.ReactNode
}

const publicRoutes = ['/login']

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuth()
  
  const isPublicRoute = publicRoutes.includes(pathname)

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-pink-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicRoute) {
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return null
  }

  // If user is authenticated and trying to access login page
  if (isAuthenticated && isPublicRoute) {
    // Redirect to dashboard
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard'
    }
    return null
  }

  // For public routes (like login), render without MainLayout
  if (isPublicRoute) {
    return <>{children}</>
  }

  // For protected routes, render with MainLayout
  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
} 