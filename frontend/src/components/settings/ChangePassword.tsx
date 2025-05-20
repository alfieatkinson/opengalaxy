// src/components/settings/ChangePassword.tsx

'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { ChangePasswordSchema, type ChangePasswordForm } from '@/lib/auth/validation'
import { changePassword } from '@/lib/profile/api'

const ChangePassword = () => {
  const { user: me, authFetch: rawAuthFetch } = useAuth()

  // Wrap authFetch so it matches the standard fetch signature
  const authFetch = (input: RequestInfo | URL, init?: RequestInit) =>
    rawAuthFetch(input.toString(), init)

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<ChangePasswordForm>({
    old_password: '',
    password: '',
    confirm_password: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordForm, string>>>({})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  const start = () => {
    setErrors({})
    setSuccess('')
    setEditing(true)
  }

  const cancel = () => {
    setEditing(false)
    setForm({ old_password: '', password: '', confirm_password: '' })
    setErrors({})
    setSuccess('')
  }

  const handleSave = async () => {
    setErrors({})
    setSuccess('')

    const result = ChangePasswordSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ChangePasswordForm, string>> = {}
      result.error.issues.forEach((issue) => {
        const key = issue.path[0]
        if (typeof key === 'string' && key in form) {
          fieldErrors[key as keyof ChangePasswordForm] = issue.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setSaving(true)
    try {
      await changePassword(authFetch, me!.username, form.old_password, form.password)
      setSuccess('Password changed successfully')
      setForm({ old_password: '', password: '', confirm_password: '' })
      setEditing(false)
    } catch {
      setErrors({ old_password: 'Password change failed' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pt-4 border-t space-y-2">
      <h3 className="text-lg font-semibold">Password</h3>
      {!editing ? (
        <button className="btn btn-sm btn-outline" onClick={start} disabled={saving}>
          Change password
        </button>
      ) : (
        <div className="space-y-4 max-w-80">
          <label className="flex flex-col">
            <span className="text-sm mb-1">Current password</span>
            <input
              type="password"
              value={form.old_password}
              placeholder="Enter current password"
              onChange={(e) => setForm((prev) => ({ ...prev, old_password: e.target.value }))}
              className="input input-bordered w-full"
              disabled={saving}
            />
            {errors.old_password && <p className="text-xs text-red-500">{errors.old_password}</p>}
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1">New password</span>
            <input
              type="password"
              value={form.password}
              placeholder="Enter new password"
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              className="input input-bordered w-full"
              disabled={saving}
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm mb-1">Confirm new password</span>
            <input
              type="password"
              value={form.confirm_password}
              placeholder="Confirm new password"
              onChange={(e) => setForm((prev) => ({ ...prev, confirm_password: e.target.value }))}
              className="input input-bordered w-full"
              disabled={saving}
            />
            {errors.confirm_password && (
              <p className="text-xs text-red-500">{errors.confirm_password}</p>
            )}
          </label>

          <div className="flex space-x-2">
            <button className="btn btn-sm btn-primary" onClick={handleSave} disabled={saving}>
              Save
            </button>
            <button className="btn btn-sm btn-outline btn-error" onClick={cancel} disabled={saving}>
              Cancel
            </button>
          </div>

          {success && <p className="text-xs text-green-600">{success}</p>}
        </div>
      )}
    </div>
  )
}

export default ChangePassword
