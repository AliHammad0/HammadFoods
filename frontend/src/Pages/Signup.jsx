
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaUtensils
} from 'react-icons/fa'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

const Signup = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-white px-5 py-12 flex items-center justify-center"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <div className="w-full max-w-md">

        <Link to="/" className="mb-10 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
            <FaUtensils size={21} />
          </div>

          <span className="text-2xl font-extrabold tracking-tight text-[#20201e]">
            HAMAD <span className="text-orange-500">FOODS</span>
          </span>
        </Link>

        <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-[0_15px_60px_rgba(0,0,0,0.07)] sm:p-10">

          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-[3px] text-orange-600">
              Join Hamad Foods
            </span>

            <h1 className="mt-3 text-3xl font-extrabold text-[#20201e]">
              Create an account
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Create your account and become part of Hamad Foods.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-bold">
                Full Name
              </label>

              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  minLength={2}
                  className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] py-4 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Email Address
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] py-4 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Phone Number
              </label>

              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03XX XXXXXXX"
                  className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] py-4 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] py-4 pl-11 pr-12 text-sm outline-none transition focus:border-orange-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full rounded-xl bg-[#e96824] py-4 text-sm font-bold text-white transition hover:bg-[#cf5418] disabled:opacity-60"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

          </form>

          <div className="mt-7 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-orange-600 hover:text-orange-700"
            >
              Login
            </Link>
          </div>

        </div>

        <p className="mt-7 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Hamad Foods. All rights reserved.
        </p>

      </div>
    </div>
  )
}

export default Signup
