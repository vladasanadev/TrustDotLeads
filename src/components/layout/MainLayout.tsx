'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Sidebar from './Sidebar'
import Header from './Header'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen relative">
      {/* Mobile sidebar */}
      <Dialog as="div" className="relative z-50 lg:hidden" open={sidebarOpen} onClose={setSidebarOpen}>
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="fixed inset-0 flex">
          <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto glass-sidebar px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center">
                <h1 className="text-lg font-semibold text-gray-800">
                  <span className="text-pink-600">Polka</span>Leads
                </h1>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-600">Navigation</div>
                  </li>
                </ul>
              </nav>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <Sidebar />

      <div className="lg:pl-72">
        <Header onMobileMenuClick={() => setSidebarOpen(true)} />
        
        <main className="py-6 lg:py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="fade-in">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 