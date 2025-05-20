// src/components/settings/AccountSettings.tsx

import AccountDetails from '@/components/settings/AccountDetails'
import ChangePassword from '@/components/settings/ChangePassword'
import DeleteAccount from '@/components/settings/DeleteAccount'

const AccountSettings = () => {
  return (
    <div className="p-6 rounded-lg border space-y-6">
      <AccountDetails />
      <ChangePassword />
      <DeleteAccount />
    </div>
  )
}

export default AccountSettings
