
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  FaSearch,
  FaShoppingBag,
  FaPlus,
  FaTimes,
  FaUtensils,
  FaMinus,
  FaTrash,
  FaFire
} from 'react-icons/fa'

import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart
} from '../redux/slices/cartSlices'

const API_URL = (
  import.meta.env.VITE_API_URL ||
  'https://hammadfoods-backend.vercel.app/api/v1'
).replace(/\/+$/, '')

const foodImages = [
  'https://g-cdn.blinkco.io/ordering-system/55363/dish_image/1761382396626.jpg',
  'https://g-cdn.blinkco.io/ordering-system/55363/dish_image/1761544653909.jpg',
  'https://g-cdn.blinkco.io/ordering-system/55363/dish_image/1761478660242.jpg',
  'https://g-cdn.blinkco.io/ordering-system/55363/dish_image/1761544719049.jpg',
  'https://g-cdn.blinkco.io/ordering-system/55363/dish_image/1761478560981.jpg',
  'https://g-cdn.blinkco.io/ordering-system/55363/dish_image/1761478599644.jpg'
]

const formatPrice = price =>
  `Rs. ${Number(price || 0).toLocaleString('en-PK')}`

const getPrice = product => {
  const price = Number(product.price || 0)
  const discountPrice = Number(product.discountPrice || 0)

  return discountPrice > 0 && discountPrice < price
    ? discountPrice
    : price
}

const getProductId = product => product._id || product.id

const Product = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const cart = useSelector(state => state.cart?.items || [])

  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [showCart, setShowCart] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/products`)
      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Unable to load products')
      }

      setProducts(Array.isArray(data.products) ? data.products : [])
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Categories
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map(product => product.category)
          .filter(Boolean)
      )
    ]

    return ['All', ...uniqueCategories]
  }, [products])

  // Search and category filtering
  const filteredProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    return products.filter(product => {
      const matchesSearch =
        !searchTerm ||
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm)

      const matchesCategory =
        activeCategory === 'All' ||
        product.category === activeCategory

      return matchesSearch && matchesCategory
    })
  }, [products, search, activeCategory])

  // Group products by category
  const groupedProducts = useMemo(() => {
    return categories
      .filter(category => category !== 'All')
      .map(category => ({
        category,
        items: filteredProducts.filter(
          product => product.category === category
        )
      }))
      .filter(section => section.items.length > 0)
  }, [categories, filteredProducts])

  // Add to Redux Cart
  const handleAddToCart = product => {
    if (product.isAvailable === false) return
    dispatch(addToCart(product))
  }

  // Increase quantity
  const handleIncrease = id => {
    dispatch(increaseQuantity(id))
  }

  // Decrease quantity
  const handleDecrease = (id, quantity) => {
    if (quantity <= 1) {
      dispatch(removeFromCart(id))
      return
    }

    dispatch(decreaseQuantity(id))
  }

  // Remove item
  const handleRemove = id => {
    dispatch(removeFromCart(id))
  }

  // Receive Add to Cart from another page
  useEffect(() => {
    const handleExternalAddToCart = event => {
      const { product, quantity = 1 } = event.detail || {}

      if (!product || product.isAvailable === false) return

      const count = Math.max(1, Number(quantity) || 1)

      for (let i = 0; i < count; i++) {
        dispatch(addToCart(product))
      }

      setShowCart(true)
    }

    window.addEventListener(
      'hammad:add-to-cart',
      handleExternalAddToCart
    )

    return () => {
      window.removeEventListener(
        'hammad:add-to-cart',
        handleExternalAddToCart
      )
    }
  }, [dispatch])

  // Cart calculations
  const cartCount = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  )

  const cartTotal = cart.reduce(
    (total, item) =>
      total + getPrice(item) * Number(item.quantity || 0),
    0
  )

  // Open product details
  const openProduct = id => {
    navigate(`/product/${id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Open Checkout
  const handleCheckout = () => {
    if (cart.length === 0) return

    setShowCart(false)
    navigate('/checkout')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Product count for each category
  const getCategoryCount = category => {
    if (category === 'All') return products.length

    return products.filter(
      product => product.category === category
    ).length
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] font-['Arial',sans-serif] text-[#242424]">

      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">

          <div
            onClick={() => {
              navigate('/')
              setActiveCategory('All')
              setSearch('')
            }}
            className="cursor-pointer"
          >
            <h1 className="text-2xl font-black tracking-tight text-[#222]">
              HAMMAD<span className="text-[#e63b32]">FOODS</span>
            </h1>

            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[2px] text-gray-400">
              Freshness in every bite
            </p>
          </div>

          {/* Search */}
          <div className="relative hidden w-full max-w-md md:block">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search your favourite food..."
              className="h-11 w-full rounded-full border border-gray-200 bg-[#f8f8f8] pl-11 pr-5 text-sm outline-none transition focus:border-[#e63b32] focus:bg-white"
            />
          </div>

          {/* Cart */}
          <button
            onClick={() => setShowCart(true)}
            className="relative flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#e63b32] px-5 text-sm font-bold text-white transition hover:bg-[#c92d25]"
          >
            <FaShoppingBag />
            <span>My Cart</span>

            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-[#e63b32]">
              {cartCount}
            </span>
          </button>

        </div>

        {/* Mobile Search */}
        <div className="px-4 pb-4 md:hidden">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search food..."
              className="h-11 w-full rounded-full border border-gray-200 bg-[#f8f8f8] pl-11 pr-4 text-sm outline-none focus:border-[#e63b32]"
            />
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-7 px-4 py-7 sm:px-6 lg:grid-cols-[245px_minmax(0,1fr)] lg:px-10">

        {/* Category Sidebar */}
        <aside className="h-fit lg:sticky lg:top-28">

          <div className="rounded-xl border border-gray-200 bg-white p-5">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fff0ee] text-[#e63b32]">
                <FaUtensils />
              </div>

              <div>
                <h2 className="font-bold">Our Menu</h2>
                <p className="text-xs text-gray-400">
                  Explore categories
                </p>
              </div>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Categories
              </p>

              <span className="text-xs text-gray-400">
                {categories.length - 1}
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                    activeCategory === category
                      ? 'bg-[#e63b32] font-bold text-white'
                      : 'bg-[#f8f8f8] text-gray-600 hover:bg-[#fff0ee] hover:text-[#e63b32]'
                  }`}
                >
                  <span>{category}</span>

                  <span
                    className={`text-xs ${
                      activeCategory === category
                        ? 'text-white/80'
                        : 'text-gray-400'
                    }`}
                  >
                    {getCategoryCount(category)}
                  </span>
                </button>
              ))}
            </div>

          </div>

          {/* Sidebar Cart Summary */}
          <div className="mt-5 hidden rounded-xl bg-[#242424] p-5 text-white lg:block">

            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">Your Order</p>
              <FaShoppingBag className="text-[#ff7770]" />
            </div>

            <p className="mt-3 text-3xl font-black">{cartCount}</p>

            <p className="text-xs text-gray-400">
              Items in your cart
            </p>

            <div className="my-4 border-t border-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Subtotal</span>
              <span className="font-bold">
                {formatPrice(cartTotal)}
              </span>
            </div>

            <button
              onClick={() => setShowCart(true)}
              className="mt-5 w-full rounded-lg bg-[#e63b32] py-3 text-sm font-bold text-white transition hover:bg-[#c92d25]"
            >
              View Cart
            </button>

          </div>
        </aside>

        {/* Product Content */}
        <main className="min-w-0">

          {/* Page Heading */}
          <div className="mb-6 rounded-xl bg-[#242424] px-5 py-7 text-white sm:px-8">

            <p className="mb-2 text-xs font-bold uppercase tracking-[3px] text-[#ff7770]">
              Welcome to Hammad Foods
            </p>

            <div className="flex flex-wrap items-end justify-between gap-4">

              <div>
                <h2 className="text-2xl font-black sm:text-3xl">
                  Order Your Favourite Food
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-300">
                  Explore our menu and enjoy freshly prepared meals.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold">
                <FaFire className="text-[#ff7770]" />
                Freshly Prepared
              </div>

            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-xl border border-gray-200 bg-white py-24 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-red-100 border-t-[#e63b32]" />

              <p className="mt-4 text-sm text-gray-500">
                Loading menu...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-white px-5 py-16 text-center">

              <FaUtensils className="mx-auto text-3xl text-gray-300" />

              <h3 className="mt-4 font-bold text-red-600">
                Unable to load menu
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {error}
              </p>

              <button
                onClick={fetchProducts}
                className="mt-5 rounded-lg bg-[#e63b32] px-6 py-3 text-sm font-bold text-white"
              >
                Try Again
              </button>

            </div>
          )}

          {/* Empty */}
          {!loading && !error && products.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white py-20 text-center">

              <FaUtensils className="mx-auto text-3xl text-gray-300" />

              <h3 className="mt-4 font-bold">
                Menu is currently empty
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Products will appear here when added.
              </p>

            </div>
          )}

          {/* No Search Results */}
          {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white py-20 text-center">

              <FaSearch className="mx-auto text-2xl text-gray-300" />

              <h3 className="mt-4 font-bold">No food found</h3>

              <p className="mt-2 text-sm text-gray-500">
                Try searching with another name.
              </p>

              <button
                onClick={() => {
                  setSearch('')
                  setActiveCategory('All')
                }}
                className="mt-4 text-sm font-bold text-[#e63b32]"
              >
                Clear Search
              </button>

            </div>
          )}

          {/* Product Sections */}
          {!loading && !error && groupedProducts.length > 0 && (
            <div className="space-y-8">

              {groupedProducts.map(section => (
                <section
                  key={section.category}
                  id={`category-${section.category}`}
                  className="scroll-mt-32"
                >

                  {/* Category Heading */}
                  <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">

                    <div>
                      <h3 className="text-lg font-black sm:text-xl">
                        {section.category}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        {section.items.length} items available
                      </p>
                    </div>

                    <span className="rounded-full bg-[#fff0ee] px-3 py-1.5 text-xs font-bold text-[#e63b32]">
                      {section.items.length} Items
                    </span>

                  </div>

                  {/* Product List */}
                  <div className="space-y-3">

                    {section.items.map((item, index) => {
                      const itemId = getProductId(item)
                      const price = getPrice(item)
                      const image =
                        item.image || foodImages[index % foodImages.length]

                      const cartItem = cart.find(
                        cartProduct =>
                          String(getProductId(cartProduct)) === String(itemId)
                      )

                      return (
                        <article
                          key={itemId}
                          className="flex min-h-[155px] gap-4 rounded-xl border border-gray-200 bg-white p-3 transition hover:border-[#f2b2ad] hover:shadow-sm sm:gap-5 sm:p-4"
                        >

                          {/* Product Image */}
                          <button
                            type="button"
                            onClick={() => openProduct(itemId)}
                            className="h-[125px] w-[125px] shrink-0 overflow-hidden rounded-lg bg-[#f7f7f7] sm:h-[145px] sm:w-[165px]"
                          >
                            <img
                              src={image}
                              alt={item.name}
                              loading="lazy"
                              onError={e => {
                                e.currentTarget.onerror = null
                                e.currentTarget.src =
                                  foodImages[index % foodImages.length]
                              }}
                              className="h-full w-full object-cover transition duration-300 hover:scale-105"
                            />
                          </button>

                          {/* Product Details */}
                          <div className="flex min-w-0 flex-1 flex-col justify-between py-1">

                            <div>

                              <div className="flex flex-wrap items-center gap-2">

                                <h4 className="text-sm font-bold leading-5 text-[#252525] sm:text-base">
                                  {item.name}
                                </h4>

                                {item.isFeatured && (
                                  <span className="rounded bg-[#fff0ee] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#e63b32]">
                                    Featured
                                  </span>
                                )}

                              </div>

                              <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500 sm:text-sm">
                                {item.description || 'Freshly prepared with quality ingredients.'}
                              </p>

                            </div>

                            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">

                              {/* Price */}
                              <div>
                                <p className="text-base font-black text-[#242424] sm:text-lg">
                                  {formatPrice(price)}
                                </p>

                                {price < Number(item.price || 0) && (
                                  <p className="text-xs text-gray-400 line-through">
                                    {formatPrice(item.price)}
                                  </p>
                                )}
                              </div>

                              {/* Add / Quantity */}
                              {item.isAvailable === false ? (
                                <span className="rounded-lg bg-gray-100 px-4 py-2.5 text-xs font-bold text-gray-400">
                                  Unavailable
                                </span>
                              ) : cartItem ? (
                                <div className="flex items-center gap-3 rounded-lg border border-[#e63b32] px-2 py-1.5">

                                  <button
                                    onClick={() =>
                                      handleDecrease(
                                        itemId,
                                        cartItem.quantity
                                      )
                                    }
                                    className="flex h-7 w-7 items-center justify-center rounded bg-[#fff0ee] text-xs text-[#e63b32]"
                                    aria-label="Decrease quantity"
                                  >
                                    <FaMinus />
                                  </button>

                                  <span className="min-w-4 text-center text-sm font-bold">
                                    {cartItem.quantity}
                                  </span>

                                  <button
                                    onClick={() => handleIncrease(itemId)}
                                    className="flex h-7 w-7 items-center justify-center rounded bg-[#e63b32] text-xs text-white"
                                    aria-label="Increase quantity"
                                  >
                                    <FaPlus />
                                  </button>

                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAddToCart(item)}
                                  className="flex items-center gap-2 rounded-lg bg-[#e63b32] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#c92d25]"
                                >
                                  <FaPlus />
                                  Add
                                </button>
                              )}

                            </div>

                          </div>

                        </article>
                      )
                    })}

                  </div>

                </section>
              ))}

            </div>
          )}

        </main>

      </div>

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-[60] flex justify-end">

          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setShowCart(false)}
            className="absolute inset-0 bg-black/50"
          />

          <aside className="relative flex h-full w-full max-w-[440px] flex-col bg-white shadow-2xl">

            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

              <div>
                <h2 className="text-xl font-black">Your Cart</h2>

                <p className="mt-1 text-xs text-gray-400">
                  {cartCount} items in your order
                </p>
              </div>

              <button
                onClick={() => setShowCart(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-[#fff0ee] hover:text-[#e63b32]"
                aria-label="Close cart"
              >
                <FaTimes />
              </button>

            </div>

            {/* Cart Items */}
            <div className="flex-1 space-y-4 overflow-y-auto p-5">

              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0ee] text-3xl text-[#e63b32]">
                    <FaShoppingBag />
                  </div>

                  <h3 className="mt-5 font-bold">
                    Your cart is empty
                  </h3>

                  <p className="mt-2 text-sm text-gray-400">
                    Add something delicious to your cart.
                  </p>

                  <button
                    onClick={() => setShowCart(false)}
                    className="mt-5 rounded-lg bg-[#e63b32] px-6 py-3 text-sm font-bold text-white"
                  >
                    Explore Menu
                  </button>

                </div>
              ) : (
                cart.map(item => {
                  const itemId = getProductId(item)

                  return (
                    <div
                      key={itemId}
                      className="flex gap-3 border-b border-gray-100 pb-4"
                    >

                      <div className="h-[75px] w-[75px] shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={item.image || foodImages[0]}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">

                        <h3 className="truncate text-sm font-bold">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm font-bold text-[#e63b32]">
                          {formatPrice(getPrice(item))}
                        </p>

                        <div className="mt-2 flex items-center gap-3">

                          <button
                            onClick={() =>
                              handleDecrease(itemId, item.quantity)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 text-xs"
                            aria-label="Decrease quantity"
                          >
                            <FaMinus />
                          </button>

                          <span className="text-sm font-bold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => handleIncrease(itemId)}
                            className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 text-xs"
                            aria-label="Increase quantity"
                          >
                            <FaPlus />
                          </button>

                        </div>

                      </div>

                      <div className="flex flex-col items-end justify-between">

                        <p className="text-sm font-bold">
                          {formatPrice(getPrice(item) * item.quantity)}
                        </p>

                        <button
                          onClick={() => handleRemove(itemId)}
                          className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                          Remove
                        </button>

                      </div>

                    </div>
                  )
                })
              )}

            </div>

            {/* Drawer Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-6">

                <div className="mb-3 flex items-center justify-between text-sm text-gray-500">
                  <span>Total Items</span>
                  <span>{cartCount}</span>
                </div>

                <div className="mb-5 flex items-center justify-between">
                  <span className="font-bold">Subtotal</span>

                  <span className="text-xl font-black">
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full rounded-lg bg-[#e63b32] py-4 text-sm font-bold text-white transition hover:bg-[#c92d25] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Proceed to Checkout
                </button>

              </div>
            )}

          </aside>

        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-5 py-8 text-center">

        <h3 className="text-xl font-black">
          HAMMAD<span className="text-[#e63b32]">FOODS</span>
        </h3>

        <p className="mt-2 text-xs text-gray-400">
          Freshness in every bite.
        </p>

        <p className="mt-4 text-[10px] text-gray-400">
          © {new Date().getFullYear()} Hammad Foods. All rights reserved.
        </p>

      </footer>

    </div>
  )
}

export default Product
