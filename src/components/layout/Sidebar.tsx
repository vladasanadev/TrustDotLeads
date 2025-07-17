'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import {
  HomeIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserIcon,
  ShieldCheckIcon,
  ChatBubbleOvalLeftIcon,
  ArrowRightStartOnRectangleIcon,
  WalletIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: false },
  { name: 'Search', href: '/search', icon: MagnifyingGlassIcon, current: false },
  { name: 'Message', href: '/message', icon: ChatBubbleOvalLeftIcon, current: false },
  { name: 'Leads', href: '/leads', icon: UserGroupIcon, current: false },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, current: false },
  { name: 'Settings', href: '/settings', icon: CogIcon, current: false },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Mini logo component
  const MiniLogo = () => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="mr-2"
    >
      {/* Flower/petal design with 8 petals */}
      <g transform="translate(12,12)">
        {/* Top petal */}
        <ellipse cx="0" cy="-6" rx="2.5" ry="4" fill="#EC4899" transform="rotate(0)"/>
        {/* Top-right petal */}
        <ellipse cx="0" cy="-6" rx="2.5" ry="4" fill="#EC4899" transform="rotate(45)"/>
        {/* Right petal */}
        <ellipse cx="0" cy="-6" rx="2.5" ry="4" fill="#EC4899" transform="rotate(90)"/>
        {/* Bottom-right petal */}
        <ellipse cx="0" cy="-6" rx="2.5" ry="4" fill="#EC4899" transform="rotate(135)"/>
        {/* Bottom petal */}
        <ellipse cx="0" cy="-6" rx="2.5" ry="4" fill="#EC4899" transform="rotate(180)"/>
        {/* Bottom-left petal */}
        <ellipse cx="0" cy="-6" rx="2.5" ry="4" fill="#EC4899" transform="rotate(225)"/>
        {/* Left petal */}
        <ellipse cx="0" cy="-6" rx="2.5" ry="4" fill="#EC4899" transform="rotate(270)"/>
        {/* Top-left petal */}
        <ellipse cx="0" cy="-6" rx="2.5" ry="4" fill="#EC4899" transform="rotate(315)"/>
        {/* Center circle */}
        <circle cx="0" cy="0" r="2" fill="#EC4899"/>
      </g>
    </svg>
  )

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto glass-sidebar px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center">
            <MiniLogo />
            <h1 className="text-xl font-bold text-gray-800">
              <span className="text-pink-600">Polka</span>Leads
            </h1>
          </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          isActive
                            ? 'glass-nav-item active text-pink-600'
                            : 'text-gray-700 hover:text-pink-600 glass-nav-item',
                          'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-medium'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? 'text-pink-600' : 'text-gray-600 group-hover:text-pink-600',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
            <li className="mt-auto">
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-x-3">
                  <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center backdrop-blur-sm">
                    {user?.authMethod === 'wallet' ? (
                      <WalletIcon className="h-6 w-6 text-pink-600" />
                    ) : (
                      <UserIcon className="h-6 w-6 text-pink-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{user?.name || 'Unknown User'}</p>
                    <p className="text-xs text-gray-600 capitalize">{user?.role || 'User'}</p>
                    {user?.authMethod === 'wallet' && (
                      <p className="text-xs text-gray-500 truncate">
                        {user.walletAddress?.slice(0, 8)}...{user.walletAddress?.slice(-4)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={logout}
                    className="p-1 text-gray-400 hover:text-pink-600 transition-colors"
                    title="Sign out"
                  >
                    <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
} 