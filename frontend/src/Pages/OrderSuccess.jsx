
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaCheckCircle, FaClipboardList } from 'react-icons/fa'

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const order = location.state?.order

  if (!order) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center font-[Arial]">
        <h2 className="text-2xl font-bold text-gray-900">
          Order Information Not Found
        </h2>

        <p className="mt-2 text-gray-500">
          Please place an order to see your confirmation.
        </p>

        <Link
          to="/"
          className="mt-6 rounded-lg bg-red-600 px-7 py-3 font-semibold text-white hover:bg-red-700"
        >
          Back to Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-4 py-12 font-[Arial]">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm sm:p-10">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <FaCheckCircle className="text-5xl text-green-600" />
        </div>

        <p className="mt-7 text-sm font-bold uppercase tracking-[3px] text-green-600">
          Order Confirmed
        </p>

        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          Thank You!
        </h1>

        <p className="mt-3 leading-7 text-gray-500">
          Your order has been placed successfully. We will contact you soon.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5 text-left">

          <div className="flex items-center gap-2 text-gray-900">
            <FaClipboardList className="text-red-600" />
            <span className="font-bold">Order Details</span>
          </div>

          <div className="mt-5 space-y-4 text-sm">

            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Order Number</span>
              <span className="break-all text-right font-bold text-gray-900">
                {order.orderNumber}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Customer</span>
              <span className="font-semibold text-gray-900">
                {order.customer?.name}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-semibold text-gray-900">
                Cash on Delivery
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-gray-500">Order Status</span>
              <span className="font-semibold text-orange-600">
                {order.orderStatus}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between gap-3">
                <span className="font-bold text-gray-900">
                  Total Amount
                </span>
                <span className="text-lg font-bold text-red-600">
                  Rs. {Number(order.totalAmount).toLocaleString()}
                </span>
              </div>
            </div>

          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-8 w-full rounded-xl bg-red-600 px-6 py-4 font-bold text-white transition hover:bg-red-700"
        >
          Continue Shopping
        </button>

      </div>
    </div>
  )
}

export default OrderSuccess
