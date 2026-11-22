
import React, { useState } from 'react'
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaUtensils
} from 'react-icons/fa'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  })

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({
    type: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setStatus({
      type: '',
      message: ''
    })

    try {
      const response = await fetch(`${API_URL}/users/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const responseText = await response.text()

      let data

      try {
        data = JSON.parse(responseText)
      } catch {
        throw new Error(
          `Invalid API response (${response.status}). Please check your backend URL.`
        )
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Unable to send your message.')
      }

      setStatus({
        type: 'success',
        message: data.message || 'Your message has been sent successfully!'
      })

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Unable to send your message. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-[#faf8f4] text-[#20201e]"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white px-6 py-24 text-center md:py-32">
        <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-orange-100/60 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-orange-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-xs font-bold uppercase tracking-[3px] text-orange-600">
            <FaUtensils />
            We'd love to hear from you
          </span>

          <h1 className="text-5xl font-extrabold tracking-tight text-[#20201e] md:text-7xl">
            Let's Talk <span className="text-orange-500">Food.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-gray-500 md:text-base">
            Have a question, suggestion, or just want to say hello?
            Our team at Hamad Foods is always happy to connect with you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">

          {/* Contact Information */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[3px] text-orange-600">
              Get in touch
            </span>

            <h2 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              We're here to <span className="text-orange-600">help.</span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-gray-500">
              Your experience matters to us. Contact our team for orders,
              feedback, business inquiries, or any questions.
            </p>

            <div className="mt-10 space-y-7">
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <FaPhoneAlt />
                </div>

                <div>
                  <h3 className="font-bold">Call Us</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Have something to ask? Give us a call.
                  </p>
                  <p className="mt-2 text-sm font-bold">
                    Add your phone number
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <FaEnvelope />
                </div>

                <div>
                  <h3 className="font-bold">Email Us</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Send us your questions and suggestions.
                  </p>
                  <p className="mt-2 text-sm font-bold">
                    Add your email address
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <h3 className="font-bold">Our Location</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Visit us and experience the taste.
                  </p>
                  <p className="mt-2 text-sm font-bold">
                    Add your business address
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <FaClock />
                </div>

                <div>
                  <h3 className="font-bold">Working Hours</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We're ready to serve you.
                  </p>
                  <p className="mt-2 text-sm font-bold">
                    Add your business hours
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-10 border-t border-gray-200 pt-7">
              <p className="mb-4 text-sm font-bold">
                Follow us on social media
              </p>

              <div className="flex gap-3">
                {[
                  { icon: <FaInstagram />, href: '#', label: 'Instagram' },
                  { icon: <FaFacebookF />, href: '#', label: 'Facebook' },
                  { icon: <FaWhatsapp />, href: '#', label: 'WhatsApp' }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_15px_60px_rgba(0,0,0,0.05)] md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold">
                Send us a message
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Fill out the form below and we'll get back to you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Full Name
                  </label>

                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-3.5 text-sm outline-none transition focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Email Address
                  </label>

                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-3.5 text-sm outline-none transition focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 0000000"
                    className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-3.5 text-sm outline-none transition focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Subject
                  </label>

                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-3.5 text-sm outline-none transition focus:border-orange-500"
                  >
                    <option>General Inquiry</option>
                    <option>Order Related</option>
                    <option>Feedback</option>
                    <option>Complaint</option>
                    <option>Business Inquiry</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Your Message
                </label>

                <textarea
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Write your message here..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-3.5 text-sm outline-none transition focus:border-orange-500"
                />
              </div>

              {status.message && (
                <div
                  role="alert"
                  className={`rounded-xl p-4 text-sm ${
                    status.type === 'success'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#e96824] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#cf5418] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Sending Message...' : 'Send Message'}
                {!loading && <FaPaperPlane />}
              </button>

              <p className="text-center text-xs text-gray-400">
                Thank you for choosing Hamad Foods.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="bg-[#211e19] px-6 py-16 text-center text-white">
        <h2 className="text-3xl font-extrabold md:text-4xl">
          Good Food. Great Connections.
        </h2>

        <p className="mt-4 text-sm text-gray-400">
          Hamad Foods — Made with passion, served with love.
        </p>
      </section>
    </div>
  )
}

export default Contact
