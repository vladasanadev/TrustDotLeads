'use client'

import { Fragment, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const iconMap = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
}

const colorMap = {
  success: {
    bg: 'bg-green-50',
    icon: 'text-green-400',
    title: 'text-green-800',
    message: 'text-green-700',
    button: 'text-green-500 hover:text-green-600',
  },
  error: {
    bg: 'bg-red-50',
    icon: 'text-red-400',
    title: 'text-red-800',
    message: 'text-red-700',
    button: 'text-red-500 hover:text-red-600',
  },
  warning: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-400',
    title: 'text-yellow-800',
    message: 'text-yellow-700',
    button: 'text-yellow-500 hover:text-yellow-600',
  },
  info: {
    bg: 'bg-blue-50',
    icon: 'text-blue-400',
    title: 'text-blue-800',
    message: 'text-blue-700',
    button: 'text-blue-500 hover:text-blue-600',
  },
}

export default function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const Icon = iconMap[type]
  const colors = colorMap[type]

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  return (
    <Transition
      show={true}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className={`max-w-sm w-full ${colors.bg} shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon className={`h-6 w-6 ${colors.icon}`} aria-hidden="true" />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className={`text-sm font-medium ${colors.title}`}>{title}</p>
              {message && (
                <p className={`mt-1 text-sm ${colors.message}`}>{message}</p>
              )}
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className={`rounded-md inline-flex ${colors.button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500`}
                onClick={() => onClose(id)}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
} 