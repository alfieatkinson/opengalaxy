// src/components/QuickSettings.tsx

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { getUserPreferences, updateUserPreferences } from '@/lib/profile/api'
import { UserPreferences } from '@/lib/profile/types'

interface QuickSettingsProps {
  username: string
}

const QuickSettings = ({ username }: QuickSettingsProps) => {
  const router = useRouter()
  const { authFetch: rawAuthFetch, user: me, updateLocalPrefs } = useAuth()

  // Wrap authFetch so it matches the standard fetch signature
  const authFetch = (input: RequestInfo | URL, init?: RequestInit) =>
    rawAuthFetch(input.toString(), init)

  const [prefs, setPrefs] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingField, setUpdatingField] = useState<keyof UserPreferences | null>(null)

  useEffect(() => {
    if (!me || me.username !== username) return
    ;(async () => {
      try {
        const data = await getUserPreferences(authFetch, username)
        setPrefs(data)
      } catch (error) {
        console.error('Failed to load preferences:', error)
      } finally {
        setLoading(false)
      }
    })()
  }, [username, me])

  const handleToggle =
    (field: keyof UserPreferences) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!prefs) return

      const newValue = e.currentTarget.checked
      const prevPrefs = prefs

      // Optimistically update UI
      setPrefs({ ...prefs, [field]: newValue })
      setUpdatingField(field)

      try {
        // PATCH the change
        await updateUserPreferences(authFetch, username, { [field]: newValue })
        updateLocalPrefs({ [field]: newValue })
      } catch (error) {
        console.error('Failed to update preferences:', error)
        // Roll back on error
        setPrefs(prevPrefs)
      } finally {
        setUpdatingField(null)
      }
    }

  if (loading) return <div className="p-4">Loading quick settings...</div>
  if (!prefs) return null

  return (
    <div className="w-64 p-4 rounded-lg border-1">
      <h2 className="text-lg font-semibold mb-3">Quick Settings</h2>

      <label className="flex items-center justify-between mb-2">
        <span className="text-sm">Public profile</span>
        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={prefs.public_profile}
          disabled={updatingField === 'public_profile'}
          onChange={handleToggle('public_profile')}
        />
      </label>

      <label className="flex items-center justify-between mb-2">
        <span className="text-sm">Show sensitive</span>
        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={prefs.show_sensitive}
          disabled={updatingField === 'show_sensitive'}
          onChange={handleToggle('show_sensitive')}
        />
      </label>

      <label className="flex items-center justify-between mb-4">
        <span className="text-sm">Blur sensitive</span>
        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={prefs.blur_sensitive}
          disabled={updatingField === 'blur_sensitive'}
          onChange={handleToggle('blur_sensitive')}
        />
      </label>

      <button className="btn btn-outline btn-xs self-end" onClick={() => router.push('/settings')}>
        More settings →
      </button>
    </div>
  )
}

export default QuickSettings
