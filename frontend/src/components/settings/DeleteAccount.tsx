// src/components/settings/DeleteAccount.tsx

'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const DeleteAccount = () => {
  const { user: me, authFetch, signOut } = useAuth()
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setError('')
    if (!password) {
      setError('Enter your password to confirm')
      return
    }
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/accounts/users/${me!.username}/`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        },
      )
      if (!res.ok) throw new Error()
      await signOut()
      router.push('/')
    } catch {
      setError('Deletion failed. Check your password.')
    }
  }

  return (
    <div className="pt-4 border-t space-y-2">
      <h3 className="text-lg font-semibold text-red-600">Delete Account</h3>
      {!confirming ? (
        <button
          className="btn btn-sm btn-outline btn-error"
          onClick={() => {
            setConfirming(true)
            setError('')
          }}
        >
          Delete account
        </button>
      ) : (
        <div className="space-y-2 max-w-80">
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex space-x-2">
            <button className="btn btn-sm btn-error" onClick={handleDelete}>
              Confirm delete
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => {
                setConfirming(false)
                setError('')
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeleteAccount
