
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaSave,
  FaUtensils,
  FaCalendarAlt
} from 'react-icons/fa'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

const MyProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    createdAt: ''
  })

  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      if (!token) {
        setError('Please login to view your profile.')
        return
      }

      const response = await fetch(`${API_URL}/users/my-profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Unable to load profile')
      }

      setProfile(data.user)

      setFormData({
        name: data.user.name || '',
        phone: data.user.phone || ''
      })

      localStorage.setItem('user', JSON.stringify(data.user))

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')
      setMessage('')

      const token = localStorage.getItem('token')

      const response = await fetch(`${API_URL}/users/my-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Profile update failed')
      }

      setProfile(data.user)

      setFormData({
        name: data.user.name || '',
        phone: data.user.phone || ''
      })

      localStorage.setItem('user', JSON.stringify(data.user))

      setEditing(false)
      setMessage('Your profile has been updated successfully.')

    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#faf9f6]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
      </div>
    )
  }

  if (!localStorage.getItem('token')) {
    return (
      <div
        className="flex min-h-[70vh] items-center justify-center bg-[#faf9f6] px-5"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-sm">
          <FaUser className="mx-auto text-5xl text-orange-500" />
          <h1 className="mt-5 text-2xl font-extrabold text-[#20201e]">
            Login Required
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Please login to access your profile.
          </p>
          <Link
            to="/login"
            className="mt-7 inline-block rounded-xl bg-[#e96824] px-8 py-3 font-bold text-white"
          >
            Login Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-[#faf9f6] px-4 py-12 sm:px-8"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <div className="mx-auto max-w-5xl">

        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-[3px] text-orange-600">
            Account Settings
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-[#20201e] sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Manage your personal information and account details.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

          <div className="bg-[#20201e] px-6 py-9 sm:px-10">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-500 text-3xl font-extrabold text-white">
                {profile.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-extrabold text-white">
                  {profile.name}
                </h2>
                <p className="mt-2 text-sm text-gray-300">
                  {profile.email}
                </p>
                <span className="mt-3 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold capitalize text-orange-300">
                  {profile.role || 'user'} Account
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">

            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-xl font-extrabold text-[#20201e]">
                  Personal Information
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Update your account information below.
                </p>
              </div>

              {!editing && (
                <button
                  onClick={() => {
                    setEditing(true)
                    setError('')
                    setMessage('')
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 px-5 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-50"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              )}
            </div>

            {error && (
              <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#20201e]">
                    Full Name
                  </label>

                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      required
                      minLength={2}
                      maxLength={60}
                      disabled={!editing}
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] py-4 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-70"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#20201e]">
                    Email Address
                  </label>

                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      disabled
                      value={profile.email}
                      className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 py-4 pl-11 pr-4 text-sm text-gray-500 outline-none"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Email address cannot be changed.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#20201e]">
                    Phone Number
                  </label>

                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      disabled={!editing}
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] py-4 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-70"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#20201e]">
                    Account Created
                  </label>

                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      disabled
                      value={
                        profile.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString('en-PK', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })
                          : 'Not available'
                      }
                      className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 py-4 pl-11 pr-4 text-sm text-gray-500 outline-none"
                    />
                  </div>
                </div>

              </div>

              {editing && (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#e96824] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#cf5418] disabled:opacity-60"
                  >
                    <FaSave />
                    {saving ? 'Saving Changes...' : 'Save Changes'}
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      setFormData({
                        name: profile.name || '',
                        phone: profile.phone || ''
                      })
                      setEditing(false)
                      setError('')
                    }}
                    className="rounded-xl border border-gray-200 px-8 py-4 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>

          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            to="/my-orders"
            className="rounded-2xl border border-gray-100 bg-white p-6 transition hover:border-orange-300"
          >
            <h3 className="font-extrabold text-[#20201e]">My Orders</h3>
            <p className="mt-2 text-sm text-gray-500">
              View and track your food orders.
            </p>
          </Link>

          <Link
            to="/"
            className="rounded-2xl border border-gray-100 bg-white p-6 transition hover:border-orange-300"
          >
            <h3 className="font-extrabold text-[#20201e]">Explore Menu</h3>
            <p className="mt-2 text-sm text-gray-500">
              Discover delicious food from our menu.
            </p>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default MyProfile
