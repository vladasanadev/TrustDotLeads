'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  PlusIcon,
  ChevronDownIcon,
  UserIcon,
  CogIcon,
  ArrowRightStartOnRectangleIcon,
  WalletIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onMobileMenuClick: () => void
}

export default function Header({ onMobileMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout } = useAuth()

  const userNavigation = [
    { name: 'Your Profile', href: '#', icon: UserIcon, onClick: undefined },
    { name: 'Settings', href: '/settings', icon: CogIcon, onClick: undefined },
    { name: 'Sign out', href: '#', icon: ArrowRightStartOnRectangleIcon, onClick: logout },
  ]

  return (
    <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
      <div className="flex h-16 items-center gap-x-4 glass-header px-4 sm:gap-x-6 sm:px-6 lg:px-0">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 hover:text-pink-600 lg:hidden transition-colors duration-200"
          onClick={onMobileMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-pink-200 lg:hidden" aria-hidden="true" />

        <div className="flex flex-1"></div>
          
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-600 hover:text-pink-600 rounded-lg hover:bg-pink-50 transition-all duration-200"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-pink-200" aria-hidden="true" />

          {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="-m-1.5 flex items-center p-1.5 hover:bg-pink-50 rounded-lg transition-all duration-200">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center backdrop-blur-sm">
                  {user?.authMethod === 'wallet' ? (
                    <WalletIcon className="h-5 w-5 text-pink-600" />
                  ) : (
                    <UserIcon className="h-5 w-5 text-pink-600" />
                  )}
                </div>
                <span className="hidden lg:flex lg:items-center">
                  <span className="ml-4 text-sm font-semibold leading-6 text-gray-800" aria-hidden="true">
                    {user?.name || 'Unknown User'}
                  </span>
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-600" aria-hidden="true" />
                </span>
              </Menu.Button>
              
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md glass-card py-2 shadow-lg ring-1 ring-pink-200 focus:outline-none">
                  {userNavigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <a
                          href={item.href}
                          onClick={item.onClick}
                          className={cn(
                            active ? 'bg-pink-50' : '',
                            'flex items-center gap-x-2 px-3 py-1 text-sm leading-6 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-200 cursor-pointer'
                          )}
                        >
                          <item.icon className="h-4 w-4" aria-hidden="true" />
                          {item.name}
                        </a>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
        </div>
      </div>
    </div>
  )
} 