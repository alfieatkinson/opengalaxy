// src/components/settings/AccountDetails.tsx

'use client'

import { useState, useEffect } from 'react'
import { Pencil as PencilIcon, X as CrossIcon, Save as SaveIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { UpdateDetailsSchema, type UpdateDetailsForm } from '@/lib/auth/validation'
import { updateUserDetails } from '@/lib/profile/api'

const fields: Array<keyof UpdateDetailsForm> = [
  'username',
  'email_address',
  'first_name',
  'last_name',
]

type Field = keyof UpdateDetailsForm

const AccountDetails = () => {
  const { user: me, authFetch: rawAuthFetch } = useAuth()

  // Wrap authFetch so it matches the standard fetch signature
  const authFetch = (input: RequestInfo | URL, init?: RequestInit) =>
    rawAuthFetch(input.toString(), init)

  const [form, setForm] = useState<UpdateDetailsForm>({
    username: '',
    email_address: '',
    first_name: '',
    last_name: '',
  })
  const [editing, setEditing] = useState<Field | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [errors, setErrors] = useState({ field: '', password: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!me) return
    setForm({
      username: me.username,
      email_address: me.email,
      first_name: me.first_name,
      last_name: me.last_name,
    })
  }, [editing, me])

  const startEdit = (field: Field) => {
    if (saving) return
    setErrors({ field: '', password: '' })
    setEditing(field)
  }

  const cancelEdit = () => {
    if (!editing) return
    setErrors({ field: '', password: '' })
    setForm((prev) => ({ ...prev, [editing]: prev[editing] as string }))
    setCurrentPassword('')
    setEditing(null)
  }

  const handleFieldSave = async () => {
    if (!editing) return
    setErrors({ field: '', password: '' })
    setSaving(true)

    // Zod validation: get specific field schema
    const shape = UpdateDetailsSchema.shape
    const schema = shape[editing]
    const parsed = schema.safeParse(form[editing])
    if (!parsed.success) {
      setErrors({ field: parsed.error.errors[0].message, password: '' })
      setSaving(false)
      return
    }

    if (!currentPassword) {
      setErrors({ field: '', password: 'Enter your current password' })
      setSaving(false)
      return
    }

    const payload: Partial<UpdateDetailsForm> & { password: string } = {
      [editing]: form[editing],
      password: currentPassword,
    }

    try {
      await updateUserDetails(authFetch, me!.username, payload)
      setEditing(null)
      setCurrentPassword('')
    } catch {
      setErrors({ field: '', password: 'Failed. Check your password.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Account Details</h3>
      {fields.map((field) => (
        <div key={field} className="space-y-1">
          <span className="text-sm capitalize ml-3">{field.replace('_', ' ')}</span>
          <div className="flex flex-row items-center space-x-4">
            <input
              className="input input-bordered max-w-80"
              value={form[field] as string}
              placeholder={`Enter your ${field.replace('_', ' ')}`}
              disabled={editing !== field || saving}
              onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
            />
            <div className="flex-grow" />
            {editing !== field ? (
              <button
                className="btn btn-sm btn-outline px-2"
                onClick={() => startEdit(field)}
                disabled={saving}
              >
                <PencilIcon size={16} strokeWidth={3} />
              </button>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input input-bordered input-sm"
                  disabled={saving}
                />
                <button
                  className="btn btn-sm btn-primary px-2"
                  onClick={handleFieldSave}
                  disabled={saving}
                >
                  <SaveIcon size={16} strokeWidth={3} />
                </button>
                <button
                  className="btn btn-sm btn-outline btn-error px-2"
                  onClick={cancelEdit}
                  disabled={saving}
                >
                  <CrossIcon size={16} strokeWidth={3} />
                </button>
              </div>
            )}
          </div>
          {editing === field && errors.field && (
            <p className="text-xs text-red-500">{errors.field}</p>
          )}
          {editing === field && errors.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default AccountDetails
