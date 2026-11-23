
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaCheckCircle, FaClipboardList } from 'react-icons/fa'

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const order = location.state?.order

  const [timeLeft, setTimeLeft] = useState(30 * 60)

  useEffect(() => {
    if (!order) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [order])

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const seconds = String(timeLeft % 60).padStart(2, '0')

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
    <div className="min-h-[75vh] bg-gray-50 px-4 py-12 font-[Arial]">

      <style>{`
        @keyframes chefBounce {
          0%, 100% {
            transform: translateY(0) rotate(-3deg);
          }
          50% {
            transform: translateY(-13px) rotate(3deg);
          }
        }

        @keyframes pizzaSpin {
          0%, 100% {
            transform: translateY(0) rotate(-10deg);
          }
          50% {
            transform: translateY(-24px) rotate(15deg);
          }
        }

        @keyframes fireFlicker {
          0%, 100% {
            transform: scale(1) rotate(-4deg);
            opacity: 0.85;
          }
          50% {
            transform: scale(1.2) rotate(5deg);
            opacity: 1;
          }
        }

        @keyframes smokeRise {
          0% {
            transform: translateY(10px) scale(0.5);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-35px) scale(1.4);
            opacity: 0;
          }
        }

        @keyframes ovenGlow {
          0%, 100% {
            box-shadow: 0 0 12px rgba(249, 115, 22, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(249, 115, 22, 0.65);
          }
        }

        .chef-animation {
          animation: chefBounce 2s ease-in-out infinite;
        }

        .pizza-animation {
          animation: pizzaSpin 2s ease-in-out infinite;
        }

        .fire-animation {
          display: inline-block;
          animation: fireFlicker 0.7s ease-in-out infinite;
        }

        .smoke-animation {
          animation: smokeRise 2s ease-out infinite;
        }

        .oven-animation {
          animation: ovenGlow 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-10">

        {/* Success Icon */}
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

        {/* Chef Pizza Animation */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-orange-100 bg-orange-50 p-5">

          <p className="text-sm font-bold uppercase tracking-wider text-orange-700">
            Our Chef Is Preparing Your Pizza!
          </p>

          <div className="relative mx-auto mt-5 flex h-44 max-w-sm items-end justify-center">

            {/* Smoke */}
            <div className="absolute left-[35%] top-5 text-2xl opacity-50 smoke-animation">
              ☁️
            </div>

            <div className="absolute right-[30%] top-2 text-xl opacity-50 smoke-animation">
              ☁️
            </div>

            {/* Chef */}
            <div className="chef-animation absolute bottom-8 left-[13%] z-10 text-7xl">
              👨‍🍳
            </div>

            {/* Flying Pizza */}
            <div className="pizza-animation absolute right-[17%] top-5 z-20 text-6xl">
              🍕
            </div>

            {/* Oven */}
            <div className="oven-animation relative z-0 flex h-20 w-40 items-center justify-center rounded-t-[50%] border-[5px] border-orange-800 bg-orange-900">

              <div className="absolute bottom-0 h-12 w-28 rounded-t-[50%] bg-orange-950"></div>

              <div className="relative z-10 flex gap-2 text-3xl">
                <span className="fire-animation">🔥</span>
                <span className="fire-animation" style={{ animationDelay: '0.3s' }}>🔥</span>
                <span className="fire-animation" style={{ animationDelay: '0.5s' }}>🔥</span>
              </div>

            </div>

          </div>

          <p className="mt-3 text-sm font-semibold text-orange-800">
            Fresh ingredients, delicious pizza and lots of love!
          </p>

        </div>

        {/* Countdown Timer */}
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5">

          <p className="text-sm font-bold uppercase tracking-wider text-gray-700">
            Estimated Preparation Time
          </p>

          <div className="mt-3 flex items-center justify-center gap-2">

            <div className="min-w-20 rounded-xl bg-white px-4 py-3 shadow-sm">
              <p className="text-4xl font-extrabold tabular-nums text-red-600">
                {minutes}
              </p>
              <p className="mt-1 text-xs font-semibold text-gray-500">
                MINUTES
              </p>
            </div>

            <span className="text-3xl font-bold text-red-600">:</span>

            <div className="min-w-20 rounded-xl bg-white px-4 py-3 shadow-sm">
              <p className="text-4xl font-extrabold tabular-nums text-red-600">
                {seconds}
              </p>
              <p className="mt-1 text-xs font-semibold text-gray-500">
                SECONDS
              </p>
            </div>

          </div>

          <p className="mt-4 text-sm font-medium text-gray-600">
            {timeLeft > 0
              ? 'Your delicious pizza is getting ready! 🍕'
              : 'Your estimated preparation time is over!'}
          </p>

        </div>

        {/* Order Details */}
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

        {/* Continue Shopping */}
        <button
          onClick={() => navigate('/')}
          className="mt-8 w-full rounded-xl bg-red-600 px-6 py-4 font-bold text-white transition duration-300 hover:bg-red-700"
        >
          Continue Shopping
        </button>

      </div>
    </div>
  )
}

export default OrderSuccess
