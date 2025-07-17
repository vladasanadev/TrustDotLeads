'use client'

import { useState, ReactNode } from 'react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

interface TooltipProps {
  content: string
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export default function Tooltip({ content, children, position = 'top', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800'
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}>
          <div className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 max-w-xs shadow-lg">
            {content}
            <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
          </div>
        </div>
      )}
    </div>
  )
}

interface GlossaryTermProps {
  term: string
  definition: string
  children: ReactNode
  className?: string
}

export function GlossaryTerm({ term, definition, children, className = '' }: GlossaryTermProps) {
  return (
    <Tooltip content={`${term}: ${definition}`} className={className}>
      <span className="border-b border-dotted border-pink-400 cursor-help">
        {children}
      </span>
    </Tooltip>
  )
}

interface InfoTooltipProps {
  content: string
  className?: string
}

export function InfoTooltip({ content, className = '' }: InfoTooltipProps) {
  return (
    <Tooltip content={content} className={className}>
      <InformationCircleIcon className="h-4 w-4 text-gray-400 hover:text-pink-500 transition-colors" />
    </Tooltip>
  )
} 