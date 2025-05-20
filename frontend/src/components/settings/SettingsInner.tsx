// src/components/settings/SettingsInner.tsx

'use client'

import PreferenceSettings from '@/components/settings/PreferenceSettings'
import AccountSettings from '@/components/settings/AccountSettings'
import DeleteAccount from '@/components/settings/DeleteAccount'

const SettingsInner = () => {
  return (
    <div className="w-full max-w-200 p-4 bg-base-200 rounded-lg">
      <div className="flex flex-row justify-between">
        <PreferenceSettings />
      </div>
      <AccountSettings />
      <DeleteAccount />
    </div>
  )
}

export default SettingsInner
