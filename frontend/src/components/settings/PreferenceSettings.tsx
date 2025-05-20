// src/components/settings/PreferenceSettings.tsx

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getUserPreferences, updateUserPreferences } from '@/lib/profile/api'
import { UserPreferences } from '@/lib/profile/types'

const PreferenceSettings = () => {
  const { authFetch: rawAuthFetch, updateLocalPrefs, user: me } = useAuth()

  // Wrap authFetch so it matches the standard fetch signature
  const authFetch = (input: RequestInfo | URL, init?: RequestInit) =>
    rawAuthFetch(input.toString(), init)

  const [prefs, setPrefs] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingField, setUpdatingField] = useState<keyof UserPreferences | null>(null)

  useEffect(() => {
    if (!me) return
    ;(async () => {
      try {
        const data = await getUserPreferences(authFetch, me.username)
        setPrefs(data)
        updateLocalPrefs(data)
      } catch (error) {
        console.error('Error fetching user preferences:', error)
      } finally {
        setLoading(false)
      }
    })()
  }, [me])

  const handleToggle =
    (field: keyof UserPreferences) => async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!prefs) return
      const newValue = event.target.checked
      setPrefs({ ...prefs, [field]: newValue })
      setUpdatingField(field)

      try {
        await updateUserPreferences(authFetch, me!.username, { [field]: newValue })
        updateLocalPrefs({ [field]: newValue })
      } catch (error) {
        console.error('Error updating user preferences:', error)
        // Rollback
        setPrefs(prefs)
      } finally {
        setUpdatingField(null)
      }
    }

  if (loading) return <div className="p-4">Loading preferences...</div>
  if (!prefs) return <div className="p-4">Unable to load preferences.</div>

  return (
    <div className="min-w-64 max-w-80 p-4 rounded-lg border-1">
      <h2 className="text-lg font-semibold mb-3">User Preferences</h2>

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
    </div>
  )
}

export default PreferenceSettings
