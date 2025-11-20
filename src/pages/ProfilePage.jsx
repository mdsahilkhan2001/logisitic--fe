import { useEffect, useRef, useState } from 'react'
import {
  useGetMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
  useUpdateProfilePictureMutation,
} from '@/features/auth/authApiSlice'
import Loader from '@/components/common/Loader'
import Modal from '@/components/common/Modal'
import toast from 'react-hot-toast'
import { FaCamera, FaCheck, FaPen, FaTimes, FaUserCircle } from 'react-icons/fa'

const ProfilePage = () => {
  const { data: me, isLoading, refetch } = useGetMeQuery()
  const [updateMe] = useUpdateMeMutation()
  const [updateProfilePicture, { isLoading: uploading }] = useUpdateProfilePictureMutation()
  const [changePassword, { isLoading: updatingPassword }] = useChangePasswordMutation()

  const [editingField, setEditingField] = useState(null)
  const [fieldValues, setFieldValues] = useState({})
  const [savingField, setSavingField] = useState(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '' })
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  if (isLoading) {
    return <Loader />
  }

  const profileFields = [
    { key: 'first_name', label: 'First Name', placeholder: 'Enter first name' },
    { key: 'last_name', label: 'Last Name', placeholder: 'Enter last name' },
    { key: 'email', label: 'Email Address', placeholder: 'Enter email', type: 'email' },
    { key: 'phone', label: 'Mobile Number', placeholder: 'Add mobile number' },
    { key: 'address', label: 'Address', placeholder: 'Add address', type: 'textarea' },
  ]

  const handleEditField = (fieldKey) => {
    setEditingField(fieldKey)
    setFieldValues((prev) => ({
      ...prev,
      [fieldKey]: me?.[fieldKey] || '',
    }))
  }

  const handleFieldChange = (fieldKey, value) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }))
  }

  const handleSaveField = async (fieldKey) => {
    const value = fieldValues[fieldKey] ?? ''
    setSavingField(fieldKey)
    try {
      await updateMe({ [fieldKey]: value }).unwrap()
      toast.success('Profile updated successfully')
      setEditingField(null)
      await refetch()
    } catch (error) {
      toast.error(error?.data?.detail || 'Unable to update profile')
    } finally {
      setSavingField(null)
    }
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    try {
      await changePassword(passwordForm).unwrap()
      toast.success('Password updated')
      setShowPasswordModal(false)
      setPasswordForm({ current_password: '', new_password: '' })
    } catch (error) {
      toast.error(error?.data?.detail || 'Password update failed')
    }
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)

    try {
      await updateProfilePicture(file).unwrap()
      toast.success('Profile picture updated')
      await refetch()
      setPreviewUrl('')
    } catch (error) {
      toast.error(error?.data?.detail || 'Unable to update picture')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="card flex flex-col md:flex-row md:items-center gap-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
          {previewUrl ? (
            <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
          ) : me?.profile_picture ? (
            <img src={me.profile_picture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <FaUserCircle className="w-full h-full text-gray-300" />
          )}

          <button
            onClick={handleImageUpload}
            className="absolute bottom-2 right-2 p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition"
            aria-label="Update profile picture"
            disabled={uploading}
          >
            <FaCamera />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            name="profile_picture"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{me?.first_name || me?.username || 'Buyer'}</h1>
            {uploading && <span className="text-xs text-primary-600">Uploading...</span>}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your personal details and keep your information up to date.
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Username: <span className="font-medium text-gray-700 dark:text-gray-200">{me?.username}</span></p>
            <p>Role: <span className="font-medium capitalize text-gray-700 dark:text-gray-200">{me?.role}</span></p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-5">
            {profileFields.map((field) => {
              const isEditing = editingField === field.key
              const value = isEditing ? fieldValues[field.key] : me?.[field.key]

              return (
                <div
                  key={field.key}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-gray-200 dark:border-dark-border last:border-none last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">{field.label}</p>
                    {isEditing ? (
                      field.type === 'textarea' ? (
                        <textarea
                          name={field.key}
                          value={value}
                          onChange={(event) => handleFieldChange(field.key, event.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                          rows={3}
                        />
                      ) : (
                        <input
                          type={field.type || 'text'}
                          name={field.key}
                          value={value}
                          onChange={(event) => handleFieldChange(field.key, event.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                        />
                      )
                    ) : (
                      <p className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                        {value ? value : 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSaveField(field.key)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition disabled:opacity-60"
                          disabled={savingField === field.key}
                        >
                          <FaCheck />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingField(null)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <FaTimes />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditField(field.key)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary-600 text-primary-600 hover:bg-primary-50 transition"
                      >
                        <FaPen />
                        Update
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Password</p>
              <p className="text-base font-medium text-gray-900 dark:text-gray-100">••••••••</p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary-600 text-primary-600 hover:bg-primary-50 transition"
            >
              <FaPen />
              Update
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Update Password"
        size="sm"
      >
        <form className="space-y-4" onSubmit={handlePasswordSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input
              type="password"
              name="current_password"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
              value={passwordForm.current_password}
              onChange={(event) => setPasswordForm({ ...passwordForm, current_password: event.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              name="new_password"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
              value={passwordForm.new_password}
              onChange={(event) => setPasswordForm({ ...passwordForm, new_password: event.target.value })}
              required
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition disabled:opacity-60"
              disabled={updatingPassword}
            >
              {updatingPassword ? 'Updating...' : 'Save Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ProfilePage
