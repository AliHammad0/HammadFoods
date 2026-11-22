
import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaUsers,
  FaShoppingBag,
  FaUtensils,
  FaChartLine,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaPlus,
  FaEye,
  FaSyncAlt,
  FaHome
} from 'react-icons/fa'

const API_URL = (
  import.meta.env.VITE_API_URL ||
  'https://hammadfoods-backend.vercel.app/api/v1'
).replace(/\/+$/, '')

const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
]

const formatPrice = price =>
  `Rs. ${Number(price || 0).toLocaleString('en-PK')}`

const AdminDashboard = () => {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('Overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [updatingOrders, setUpdatingOrders] = useState({})
  const [statusMessage, setStatusMessage] = useState('')
  const [statusError, setStatusError] = useState('')

  const menuItems = [
    { name: 'Overview', icon: FaHome },
    { name: 'Users', icon: FaUsers },
    { name: 'Orders', icon: FaShoppingBag },
    { name: 'Products', icon: FaUtensils }
  ]

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      throw new Error('Please login first.')
    }

    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const fetchAPI = async (url, options = {}) => {
    const response = await fetch(url, options)

    const data = await response.json().catch(() => ({}))

    if (response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('authChange'))
      navigate('/login')
      throw new Error('Login session expired. Please login again.')
    }

    if (response.status === 403) {
      throw new Error('Admin permission required.')
    }

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Request failed.')
    }

    return data
  }

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    setErrors({})

    try {
      const headers = getAuthHeaders()

      const requests = [
        { key: 'products', url: `${API_URL}/products` },
        { key: 'orders', url: `${API_URL}/orders` },
        { key: 'users', url: `${API_URL}/users` }
      ]

      const results = await Promise.allSettled(
        requests.map(async request => {
          const data = await fetchAPI(request.url, {
            method: 'GET',
            headers
          })

          return { key: request.key, data }
        })
      )

      const newErrors = {}

      results.forEach((result, index) => {
        const key = requests[index].key

        if (result.status === 'fulfilled') {
          const data = result.value.data

          if (key === 'products') {
            setProducts(data.products || [])
          }

          if (key === 'orders') {
            setOrders(data.orders || [])
          }

          if (key === 'users') {
            setUsers(data.users || [])
          }
        } else {
          newErrors[key] = result.reason.message
        }
      })

      setErrors(newErrors)
    } catch (error) {
      setErrors({
        dashboard: error.message || 'Unable to load dashboard.'
      })
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrders(prev => ({
      ...prev,
      [orderId]: true
    }))

    setStatusMessage('')
    setStatusError('')

    try {
      const headers = getAuthHeaders()

      const data = await fetchAPI(
        `${API_URL}/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            orderStatus: newStatus
          })
        }
      )

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId
            ? {
                ...order,
                ...(data.order || {}),
                orderStatus: newStatus
              }
            : order
        )
      )

      setStatusMessage(
        `Order status successfully changed to ${newStatus}.`
      )
    } catch (error) {
      setStatusError(error.message || 'Something went wrong.')
    } finally {
      setUpdatingOrders(prev => ({
        ...prev,
        [orderId]: false
      }))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('authChange'))
    navigate('/login')
  }

  const totalRevenue = orders
    .filter(order => order.orderStatus !== 'Cancelled')
    .reduce(
      (total, order) => total + Number(order.totalAmount || 0),
      0
    )

  const pendingOrders = orders.filter(
    order => order.orderStatus === 'Pending'
  ).length

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: FaUsers,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: FaShoppingBag,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      title: 'Total Products',
      value: products.length,
      icon: FaUtensils,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Total Revenue',
      value: formatPrice(totalRevenue),
      icon: FaChartLine,
      color: 'bg-red-50 text-[#e63b32]'
    }
  ]

  const handleNavigation = name => {
    setActiveTab(name)
    setSidebarOpen(false)
    setStatusMessage('')
    setStatusError('')
  }

  const renderOverview = () => (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-black">Dashboard Overview</h2>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to your Hammad Foods admin panel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon

          return (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="text-xl" />
                </div>
                <span className="text-xs font-semibold text-gray-400">
                  Overview
                </span>
              </div>

              <p className="mt-5 text-sm text-gray-500">
                {stat.title}
              </p>

              <h3 className="mt-1 break-words text-2xl font-black">
                {stat.value}
              </h3>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Recent Orders</h3>
            <button
              onClick={() => handleNavigation('Orders')}
              className="text-xs font-bold text-[#e63b32]"
            >
              View All
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {orders.slice(0, 5).map(order => (
              <div
                key={order._id}
                className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    {order.customer?.name || 'Customer'}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {order.orderNumber || order._id}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold">
                    {formatPrice(order.totalAmount)}
                  </p>
                  <p className="mt-1 text-xs text-[#e63b32]">
                    {order.orderStatus || 'Pending'}
                  </p>
                </div>
              </div>
            ))}

            {!orders.length && !errors.orders && (
              <p className="py-8 text-center text-sm text-gray-400">
                No orders available.
              </p>
            )}

            {errors.orders && (
              <p className="text-sm text-red-500">{errors.orders}</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="font-bold">Quick Actions</h3>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={() => navigate('/create-product')}
              className="flex items-center gap-3 rounded-xl bg-[#fff0ee] p-4 text-left text-[#e63b32] transition hover:bg-red-100"
            >
              <FaPlus className="text-xl" />
              <span className="text-sm font-bold">Add Product</span>
            </button>

            <button
              onClick={() => handleNavigation('Orders')}
              className="flex items-center gap-3 rounded-xl bg-gray-100 p-4 text-left transition hover:bg-gray-200"
            >
              <FaShoppingBag className="text-xl" />
              <span className="text-sm font-bold">Manage Orders</span>
            </button>

            <button
              onClick={() => handleNavigation('Users')}
              className="flex items-center gap-3 rounded-xl bg-gray-100 p-4 text-left transition hover:bg-gray-200"
            >
              <FaUsers className="text-xl" />
              <span className="text-sm font-bold">View Users</span>
            </button>

            <button
              onClick={() => handleNavigation('Products')}
              className="flex items-center gap-3 rounded-xl bg-gray-100 p-4 text-left transition hover:bg-gray-200"
            >
              <FaUtensils className="text-xl" />
              <span className="text-sm font-bold">Manage Products</span>
            </button>
          </div>

          <div className="mt-5 rounded-xl bg-[#242424] p-5 text-white">
            <p className="text-sm text-gray-300">Pending Orders</p>
            <h3 className="mt-2 text-3xl font-black">{pendingOrders}</h3>
            <p className="mt-1 text-xs text-gray-400">
              Orders waiting for confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black">Manage Users</h2>
        <p className="mt-1 text-sm text-gray-500">
          View all registered customers.
        </p>
      </div>

      {errors.users ? (
        <div className="rounded-xl border border-red-200 bg-white p-6 text-sm text-red-600">
          Users API available nahi hai: {errors.users}
          <p className="mt-2 text-xs text-gray-500">
            Backend mein GET /api/v1/users endpoint check karna hoga.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Joined</th>
                </tr>
              </thead>

              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-t border-gray-100">
                    <td className="p-4 font-bold">
                      {user.name || 'N/A'}
                    </td>
                    <td className="p-4 text-gray-500">
                      {user.email || 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                        {user.role === 'admin' || user.isAdmin
                          ? 'Admin'
                          : 'Customer'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!users.length && (
            <p className="p-8 text-center text-sm text-gray-400">
              No users found.
            </p>
          )}
        </div>
      )}
    </div>
  )

  const renderOrders = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black">Manage Orders</h2>
        <p className="mt-1 text-sm text-gray-500">
          View customer orders and update their status.
        </p>
      </div>

      {statusMessage && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-700">
          {statusMessage}
        </div>
      )}

      {statusError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600">
          {statusError}
        </div>
      )}

      {errors.orders ? (
        <p className="rounded-xl border border-red-200 bg-white p-5 text-sm text-red-600">
          {errors.orders}
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4">Update Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-t border-gray-100">
                    <td className="p-4 font-bold">
                      {order.orderNumber || order._id}
                    </td>

                    <td className="p-4">
                      {order.customer?.name || 'N/A'}
                    </td>

                    <td className="p-4 text-gray-500">
                      {order.customer?.phone || 'N/A'}
                    </td>

                    <td className="p-4 font-bold">
                      {formatPrice(order.totalAmount)}
                    </td>

                    <td className="p-4">
                      {order.paymentMethod || 'COD'}
                    </td>

                    <td className="p-4">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-green-50 text-green-600'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-red-50 text-red-600'
                          : order.orderStatus === 'Out for Delivery'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-orange-50 text-orange-600'
                      }`}>
                        {order.orderStatus || 'Pending'}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={order.orderStatus || 'Pending'}
                        disabled={
                          updatingOrders[order._id] ||
                          order.orderStatus === 'Delivered' ||
                          order.orderStatus === 'Cancelled'
                        }
                        onChange={event =>
                          handleStatusChange(order._id, event.target.value)
                        }
                        className="w-44 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold outline-none transition focus:border-[#e63b32] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        {ORDER_STATUSES.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      {updatingOrders[order._id] && (
                        <p className="mt-2 text-xs font-semibold text-[#e63b32]">
                          Updating...
                        </p>
                      )}

                      {(order.orderStatus === 'Delivered' ||
                        order.orderStatus === 'Cancelled') && (
                        <p className="mt-1 text-[10px] text-gray-400">
                          Final status
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!orders.length && (
            <p className="p-8 text-center text-sm text-gray-400">
              No orders found.
            </p>
          )}
        </div>
      )}
    </div>
  )

  const renderProducts = () => (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">Manage Products</h2>
          <p className="mt-1 text-sm text-gray-500">
            View all products in your menu.
          </p>
        </div>

        <button
          onClick={() => navigate('/create-product')}
          className="flex items-center gap-2 rounded-lg bg-[#e63b32] px-5 py-3 text-sm font-bold text-white hover:bg-[#c92d25]"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {errors.products ? (
        <p className="rounded-xl border border-red-200 bg-white p-5 text-sm text-red-600">
          {errors.products}
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-t border-gray-100">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={event => {
                            event.currentTarget.style.display = 'none'
                          }}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <span className="font-bold">{product.name}</span>
                      </div>
                    </td>

                    <td className="p-4 text-gray-500">
                      {product.category}
                    </td>

                    <td className="p-4 font-bold">
                      {formatPrice(
                        product.discountPrice > 0
                          ? product.discountPrice
                          : product.price
                      )}
                    </td>

                    <td className="p-4">{product.stock ?? 0}</td>

                    <td className="p-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                        product.isAvailable
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {product.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="flex items-center gap-2 font-bold text-[#e63b32]"
                      >
                        <FaEye /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!products.length && (
            <p className="p-8 text-center text-sm text-gray-400">
              No products found.
            </p>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f7f7f7] font-['Arial',sans-serif] text-[#242424]">
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#242424] text-white transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <div>
            <h1 className="text-xl font-black">
              HAMMAD<span className="text-[#e63b32]">FOODS</span>
            </h1>
            <p className="mt-1 text-[10px] uppercase tracking-[2px] text-gray-400">
              Admin Panel
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 lg:hidden"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <div className="px-5 py-7">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[2px] text-gray-500">
            Main Menu
          </p>

          <nav className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.name)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    activeTab === item.name
                      ? 'bg-[#e63b32] text-white'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon />
                  {item.name}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-5">
          <button
            onClick={() => navigate('/')}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <FaHome /> Visit Website
          </button>

          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-[260px]">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-xl lg:hidden"
              aria-label="Open menu"
            >
              <FaBars />
            </button>

            <div>
              <h2 className="text-lg font-black">{activeTab}</h2>
              <p className="hidden text-xs text-gray-400 sm:block">
                Hammad Foods / {activeTab}
              </p>
            </div>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-bold transition hover:bg-gray-50 disabled:opacity-50"
          >
            <FaSyncAlt className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </header>

        <div className="p-4 sm:p-7">
          {loading ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-100 border-t-[#e63b32]" />
              <p className="mt-4 text-sm text-gray-500">
                Loading dashboard...
              </p>
            </div>
          ) : (
            <>
              {errors.dashboard && (
                <p className="mb-5 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-600">
                  {errors.dashboard}
                </p>
              )}

              {activeTab === 'Overview' && renderOverview()}
              {activeTab === 'Users' && renderUsers()}
              {activeTab === 'Orders' && renderOrders()}
              {activeTab === 'Products' && renderProducts()}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
