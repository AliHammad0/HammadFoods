
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaBoxOpen,
  FaCalendarAlt,
  FaShoppingBag,
  FaUtensils,
  FaSyncAlt
} from 'react-icons/fa'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      if (!token) {
        setError('Please login to view your orders')
        setLoading(false)
        return
      }

      const response = await fetch(`${API_URL}/orders/my-orders`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Unable to fetch your orders')
      }

      setOrders(data.orders || [])
    } catch (error) {
      setError(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const formatDate = (date) => {
    if (!date) return 'N/A'

    return new Date(date).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatPrice = (price) => {
    return `Rs. ${Number(price || 0).toLocaleString('en-PK')}`
  }

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Confirmed: 'bg-blue-100 text-blue-700',
      Preparing: 'bg-orange-100 text-orange-700',
      'Out for Delivery': 'bg-purple-100 text-purple-700',
      Delivered: 'bg-green-100 text-green-700',
      Cancelled: 'bg-red-100 text-red-700'
    }

    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div
      className="min-h-screen bg-[#fafafa] px-4 py-10 sm:px-6 lg:px-10"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <div className="mx-auto max-w-6xl">

        {/* Page Heading */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[3px] text-orange-600">
            My Account
          </p>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            My Orders
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            View and track your food orders.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl bg-white shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />

            <p className="mt-4 text-sm text-gray-500">
              Loading your orders...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <FaBoxOpen size={27} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              {error}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Please check your login session and try again.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={fetchOrders}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                <FaSyncAlt />
                Try Again
              </button>

              <Link
                to="/my-profile"
                className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Account Settings
              </Link>

              {!localStorage.getItem('token') && (
                <Link
                  to="/login"
                  className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Empty Orders */}
        {!loading && !error && orders.length === 0 && (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <FaShoppingBag size={32} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              You haven't placed any orders yet. Explore our menu and order
              your favourite food.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-7 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              <FaUtensils />
              Explore Menu
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-5">

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Total Orders:{' '}
                <span className="font-bold text-gray-900">
                  {orders.length}
                </span>
              </p>

              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
              >
                <FaSyncAlt />
                Refresh
              </button>
            </div>

            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Order Number
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-gray-900">
                      #{order.orderNumber}
                    </h3>

                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <FaCalendarAlt className="text-orange-500" />
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${getStatusColor(order.orderStatus)}`}
                  >
                    {order.orderStatus || 'Pending'}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-4 p-5 sm:px-7">
                  {order.items?.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex items-center gap-4"
                    >
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FaUtensils className="text-2xl text-orange-400" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-semibold text-gray-900">
                          {item.name}
                        </h4>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-bold text-gray-900">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                  <div>
                    <p className="text-xs text-gray-500">
                      Payment Method: {order.paymentMethod || 'COD'}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Payment Status: {order.paymentStatus || 'Pending'}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs text-gray-500">
                      Total Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-orange-600">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default MyOrders
