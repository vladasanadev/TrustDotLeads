'use client'

import { useState } from 'react'
import {
  UserIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  CircleStackIcon,
  KeyIcon,
  GlobeAltIcon,
  ChartBarIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

interface UserSettings {
  profile: {
    name: string
    email: string
    company: string
    role: string
    avatar?: string
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    leadUpdates: boolean
    systemAlerts: boolean
    weeklyReports: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private' | 'team'
    dataSharing: boolean
    analyticsTracking: boolean
  }
  bigquery: {
    projectId: string
    datasetId: string
    location: string
    credentialsPath: string
  }
  search: {
    defaultLimit: number
    cacheResults: boolean
    autoRefresh: boolean
    refreshInterval: number
  }
  display: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    timezone: string
    dateFormat: string
  }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      name: 'John Doe',
      email: 'john@polkaleads.com',
      company: 'PolkaLeads Inc.',
      role: 'Admin'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      leadUpdates: true,
      systemAlerts: true,
      weeklyReports: false
    },
    privacy: {
      profileVisibility: 'team',
      dataSharing: false,
      analyticsTracking: true
    },
    bigquery: {
      projectId: 'parity-data-infra',
      datasetId: 'w3s_hackathon',
      location: 'europe-west3',
      credentialsPath: '/Users/vladyslavaka/.config/gcloud/application_default_credentials.json'
    },
    search: {
      defaultLimit: 100,
      cacheResults: true,
      autoRefresh: false,
      refreshInterval: 30
    },
    display: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY'
    }
  })

  const [showCredentials, setShowCredentials] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
    { id: 'bigquery', name: 'BigQuery', icon: CircleStackIcon },
    { id: 'search', name: 'Search', icon: ChartBarIcon },
    { id: 'display', name: 'Display', icon: GlobeAltIcon }
  ]

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // In a real app, this would save to the backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Settings saved successfully!')
    } catch (error) {
      alert('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (section: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={settings.profile.name}
            onChange={(e) => updateSetting('profile', 'name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={settings.profile.email}
            onChange={(e) => updateSetting('profile', 'email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company
          </label>
          <input
            type="text"
            value={settings.profile.company}
            onChange={(e) => updateSetting('profile', 'company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            value={settings.profile.role}
            onChange={(e) => updateSetting('profile', 'role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Agent">Agent</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <p className="text-sm text-gray-500">
                {getNotificationDescription(key)}
              </p>
            </div>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => updateSetting('notifications', key, e.target.checked)}
              className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
            />
          </div>
        ))}
      </div>
    </div>
  )

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Visibility
        </label>
        <select
          value={settings.privacy.profileVisibility}
          onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="public">Public</option>
          <option value="team">Team Only</option>
          <option value="private">Private</option>
        </select>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">Data Sharing</label>
            <p className="text-sm text-gray-500">Allow sharing anonymized data for analytics</p>
          </div>
          <input
            type="checkbox"
            checked={settings.privacy.dataSharing}
            onChange={(e) => updateSetting('privacy', 'dataSharing', e.target.checked)}
            className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">Analytics Tracking</label>
            <p className="text-sm text-gray-500">Help improve the platform with usage analytics</p>
          </div>
          <input
            type="checkbox"
            checked={settings.privacy.analyticsTracking}
            onChange={(e) => updateSetting('privacy', 'analyticsTracking', e.target.checked)}
            className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
          />
        </div>
      </div>
    </div>
  )

  const renderBigQueryTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">BigQuery Configuration</h3>
        <p className="text-sm text-blue-800">
          Configure your Google Cloud BigQuery connection for wallet data access.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project ID
          </label>
          <input
            type="text"
            value={settings.bigquery.projectId}
            onChange={(e) => updateSetting('bigquery', 'projectId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dataset ID
          </label>
          <input
            type="text"
            value={settings.bigquery.datasetId}
            onChange={(e) => updateSetting('bigquery', 'datasetId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={settings.bigquery.location}
            onChange={(e) => updateSetting('bigquery', 'location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credentials Path
          </label>
          <div className="relative">
            <input
              type={showCredentials ? 'text' : 'password'}
              value={settings.bigquery.credentialsPath}
              onChange={(e) => updateSetting('bigquery', 'credentialsPath', e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showCredentials ? (
                <EyeSlashIcon className="h-4 w-4 text-gray-400" />
              ) : (
                <EyeIcon className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSearchTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Search Limit
          </label>
          <input
            type="number"
            value={settings.search.defaultLimit}
            onChange={(e) => updateSetting('search', 'defaultLimit', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Refresh Interval (seconds)
          </label>
          <input
            type="number"
            value={settings.search.refreshInterval}
            onChange={(e) => updateSetting('search', 'refreshInterval', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">Cache Results</label>
            <p className="text-sm text-gray-500">Store search results locally for faster access</p>
          </div>
          <input
            type="checkbox"
            checked={settings.search.cacheResults}
            onChange={(e) => updateSetting('search', 'cacheResults', e.target.checked)}
            className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">Auto Refresh</label>
            <p className="text-sm text-gray-500">Automatically refresh search results</p>
          </div>
          <input
            type="checkbox"
            checked={settings.search.autoRefresh}
            onChange={(e) => updateSetting('search', 'autoRefresh', e.target.checked)}
            className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
          />
        </div>
      </div>
    </div>
  )

  const renderDisplayTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <select
            value={settings.display.theme}
            onChange={(e) => updateSetting('display', 'theme', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.display.language}
            onChange={(e) => updateSetting('display', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.display.timezone}
            onChange={(e) => updateSetting('display', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Berlin">Berlin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Format
          </label>
          <select
            value={settings.display.dateFormat}
            onChange={(e) => updateSetting('display', 'dateFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
    </div>
  )

  const getNotificationDescription = (key: string) => {
    const descriptions: Record<string, string> = {
      emailNotifications: 'Receive email notifications for important updates',
      pushNotifications: 'Get push notifications on your device',
      leadUpdates: 'Notifications when leads are updated or added',
      systemAlerts: 'Important system alerts and maintenance notifications',
      weeklyReports: 'Weekly summary reports of your CRM activity'
    }
    return descriptions[key] || ''
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab()
      case 'notifications':
        return renderNotificationsTab()
      case 'privacy':
        return renderPrivacyTab()
      case 'bigquery':
        return renderBigQueryTab()
      case 'search':
        return renderSearchTab()
      case 'display':
        return renderDisplayTab()
      default:
        return renderProfileTab()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
              Settings
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account preferences and system configuration.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-x-2 rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <CogIcon className="h-4 w-4" aria-hidden="true" />
              )}
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-pink-100 text-pink-700 border-r-2 border-pink-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.name}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Configure your {activeTab} settings below.
              </p>
            </div>
            
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
} 