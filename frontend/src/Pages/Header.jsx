
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaBars,
  FaTimes,
  FaUser,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaChevronDown
} from 'react-icons/fa'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [orderType, setOrderType] = useState('Pick-Up')
  const [user, setUser] = useState(null)

  const navigate = useNavigate()

  const bannerImage =
    'https://g-cdn.blinkco.io/ordering-system/55363/web_splash/1764003553.jpg'

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    }

    checkLogin()

    window.addEventListener('storage', checkLogin)
    window.addEventListener('authChange', checkLogin)

    return () => {
      window.removeEventListener('storage', checkLogin)
      window.removeEventListener('authChange', checkLogin)
    }
  }, [])

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <>
      {/* Image Banner */}
      <div className="w-full overflow-hidden font-[Arial]">
        <Link to="/deals" className="block">
          <img
            src={bannerImage}
            alt="Special Food Deals"
            className="h-[120px] w-full object-cover object-center sm:h-[170px] md:h-[220px]"
          />
        </Link>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white font-[Arial] text-black shadow-sm">
        <div className="mx-auto max-w-7xl px-5 md:px-8">

          <div className="flex h-20 items-center justify-between gap-5">

            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-3">
              <div>
                <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                  HAMMAD <span className="text-[#c91d25]">FOODS</span>
                </h1>

                <p className="text-[9px] font-semibold tracking-[3px] text-gray-500">
                  HAMMAD FOODS
                </p>
              </div>
            </Link>

            {/* Pickup Location */}
            <div className="hidden items-center gap-3 border-l border-gray-200 pl-5 md:flex">
              <FaMapMarkerAlt className="text-lg text-[#c91d25]" />

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                  {orderType} from
                </p>

                <button className="flex items-center gap-2 text-sm font-bold">
                  Khanewal, Khanewal
                  <FaChevronDown className="text-[10px] text-gray-500" />
                </button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex">
              <Link to="/" className="transition hover:text-[#c91d25]">
                Home
              </Link>

              <Link to="/menu" className="transition hover:text-[#c91d25]">
                Menu
              </Link>

              <Link to="/deals" className="transition hover:text-[#c91d25]">
                Deals
              </Link>

              <Link to="/contact" className="transition hover:text-[#c91d25]">
                Contact
              </Link>
            </nav>

            {/* Desktop Account */}
            <div className="hidden items-center gap-3 md:flex">

              {user ? (
                <>
                  <Link
                    to="/my-profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition hover:text-[#c91d25]"
                  >
                    <FaUser />
                    My Profile
                  </Link>

                  <Link
                    to="/my-orders"
                    className="flex items-center gap-2 rounded-md bg-[#c91d25] px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
                  >
                    <FaShoppingBag />
                    My Orders
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition hover:text-[#c91d25]"
                  >
                    <FaUser />
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="rounded-md bg-[#c91d25] px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
                  >
                    Sign Up
                  </Link>
                </>
              )}

            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl text-black md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Mobile Location */}
          <div className="flex items-center justify-between border-t border-gray-100 py-3 md:hidden">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#c91d25]" />

              <div>
                <p className="text-[9px] uppercase text-gray-500">
                  {orderType} from
                </p>

                <p className="text-xs font-bold">
                  Khanewal, Khanewal
                </p>
              </div>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setOrderType('Pick-Up')}
                className={`rounded px-3 py-2 text-[10px] ${
                  orderType === 'Pick-Up'
                    ? 'bg-[#c91d25] text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Pick-Up
              </button>

              <button
                onClick={() => setOrderType('Delivery')}
                className={`rounded px-3 py-2 text-[10px] ${
                  orderType === 'Delivery'
                    ? 'bg-[#c91d25] text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Delivery
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-gray-100 bg-white px-6 py-5 shadow-lg md:hidden">

            <nav className="flex flex-col gap-5 text-sm font-semibold">
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>

              <Link to="/menu" onClick={closeMenu}>
                Menu
              </Link>

              <Link to="/deals" onClick={closeMenu}>
                Deals
              </Link>

              <Link to="/contact" onClick={closeMenu}>
                Contact
              </Link>
            </nav>

            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">

              {user ? (
                <>
                  <Link
                    to="/my-profile"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-md border border-gray-300 py-3 text-center text-sm font-bold transition hover:border-[#c91d25] hover:text-[#c91d25]"
                  >
                    <FaUser />
                    My Profile
                  </Link>

                  <Link
                    to="/my-orders"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-md bg-[#c91d25] py-3 text-center text-sm font-bold text-white transition hover:bg-black"
                  >
                    <FaShoppingBag />
                    My Orders
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-md border border-gray-300 py-3 text-center text-sm font-bold transition hover:border-[#c91d25] hover:text-[#c91d25]"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="rounded-md bg-[#c91d25] py-3 text-center text-sm font-bold text-white transition hover:bg-black"
                  >
                    Sign Up
                  </Link>
                </>
              )}

            </div>
          </div>
        )}
      </header>
    </>
  )
}

export default Header
