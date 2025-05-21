// src/components/settings/SettingsInner.tsx

'use client'

import PreferenceSettings from '@/components/settings/PreferenceSettings'
import AccountSettings from '@/components/settings/AccountSettings'
import SearchHistoryPreview from '@/components/settings/SearchHistoryPreview'

const SettingsInner = () => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-200 p-4 bg-base-200 rounded-lg">
      <div className="flex flex-row justify-between gap-4">
        <PreferenceSettings />
        <SearchHistoryPreview />
      </div>
      <AccountSettings />
    </div>
  )
}

export default SettingsInner
