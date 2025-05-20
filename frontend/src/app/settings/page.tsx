// src/app/settings/page.tsx

import SettingsInner from '@/components/settings/SettingsInner'
import ClientOnly from '@/components/shared/ClientOnly'

const SettingsPage = () => {
  return (
    <div className="flex flex-col items-center w-full mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Account Settings</h1>
      <ClientOnly>
        <SettingsInner />
      </ClientOnly>
    </div>
  )
}

export default SettingsPage
