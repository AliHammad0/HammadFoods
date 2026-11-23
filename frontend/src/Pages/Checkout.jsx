
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../redux/slices/cartSlices'

const API_URL = (
  import.meta.env.VITE_API_URL ||
  'https://hammadfoods-backend.vercel.app/api/v1'
).replace(/\/+$/, '')

const formatPrice = price =>
  `Rs. ${Number(price || 0).toLocaleString('en-PK')}`

const Checkout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cartItems = useSelector(state => state.cart.items)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const subtotal = cartItems.reduce((total, item) => {
    const price =
      Number(item.discountPrice) > 0 &&
      Number(item.discountPrice) < Number(item.price)
        ? Number(item.discountPrice)
        : Number(item.price)

    return total + price * Number(item.quantity || 1)
  }, 0)

  const deliveryCharges = subtotal >= 5000 ? 0 : 250
  const totalAmount = subtotal + deliveryCharges

  const handleChange = e => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    if (cartItems.length === 0) {
      setError('Your cart is empty.')
      return
    }

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      setError('Please fill in all required fields.')
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      setError('Please login before placing your order.')
      navigate('/login')
      return
    }

    try {
      setLoading(true)

      const orderData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
        paymentMethod: 'COD',
        items: cartItems.map(item => ({
          product: item._id || item.id,
          quantity: Number(item.quantity || 1)
        }))
      }

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Unable to place order.')
      }

      if (!data.order) {
        throw new Error(
          'Order response was incomplete. Please contact support.'
        )
      }

      dispatch(clearCart())

      navigate('/order-success', {
        state: {
          order: data.order
        }
      })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div
        className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        <h2 className="text-2xl font-bold text-gray-900">
          Your Cart is Empty
        </h2>

        <p className="mt-2 text-gray-500">
          Add some delicious food before checkout.
        </p>

        <button
          onClick={() => navigate('/')}
          className="mt-6 rounded-lg bg-[#e96824] px-7 py-3 font-semibold text-white transition hover:bg-[#cf5418]"
        >
          Explore Menu
        </button>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[3px] text-[#e96824]">
            Hammad Foods
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-gray-500">
            Complete your details to place your order.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-8 lg:grid-cols-5"
        >
          <div className="space-y-6 lg:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Delivery Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    minLength={2}
                    maxLength={60}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#e96824] focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Phone Number *
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="03XXXXXXXXX"
                      autoComplete="tel"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#e96824] focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      autoComplete="email"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#e96824] focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Complete Delivery Address *
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House number, street, area, city..."
                    rows={4}
                    required
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#e96824] focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Order Notes (Optional)
                  </label>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions?"
                    rows={3}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#e96824] focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Payment Method
              </h2>

              <div className="flex items-center gap-4 rounded-xl border-2 border-[#e96824] bg-orange-50 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl">
                  💵
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Cash on Delivery
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Pay when your order arrives.
                  </p>
                </div>

                <div className="ml-auto h-5 w-5 rounded-full border-[6px] border-[#e96824] bg-white" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="max-h-72 space-y-4 overflow-y-auto">
                {cartItems.map((item, index) => {
                  const price =
                    Number(item.discountPrice) > 0 &&
                    Number(item.discountPrice) < Number(item.price)
                      ? Number(item.discountPrice)
                      : Number(item.price)

                  return (
                    <div
                      key={item._id || item.id || index}
                      className="flex gap-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={event => {
                          event.currentTarget.style.display = 'none'
                        }}
                        className="h-16 w-16 rounded-xl bg-gray-100 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-gray-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Qty: {item.quantity || 1}
                        </p>
                      </div>

                      <p className="whitespace-nowrap font-semibold text-gray-900">
                        {formatPrice(price * Number(item.quantity || 1))}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="my-6 border-t border-gray-200" />

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span>
                    {deliveryCharges === 0
                      ? 'Free'
                      : formatPrice(deliveryCharges)}
                  </span>
                </div>

                {subtotal < 5000 && (
                  <p className="text-xs text-gray-500">
                    Add {formatPrice(5000 - subtotal)} more to get free delivery.
                  </p>
                )}
              </div>

              <div className="my-6 border-t border-gray-200" />

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  Total
                </span>

                <span className="text-2xl font-bold text-[#e96824]">
                  {formatPrice(totalAmount)}
                </span>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-7 w-full rounded-xl bg-[#e96824] px-5 py-4 font-bold text-white transition hover:bg-[#cf5418] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="mt-4 text-center text-xs text-gray-500">
                Your order will be placed with Cash on Delivery.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
