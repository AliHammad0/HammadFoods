
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  FaShoppingBag,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaUtensils
} from 'react-icons/fa'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

const formatPrice = price =>
  `Rs. ${Number(price || 0).toLocaleString('en-PK')}`

const getPrice = product =>
  product.discountPrice > 0 &&
  product.discountPrice < product.price
    ? product.discountPrice
    : product.price

const SingleProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_URL}/products`)
        const data = await response.json()

        if (!response.ok || !data.ok) {
          throw new Error(data.message || 'Unable to load product')
        }

        const allProducts = data.products || []
        const selectedProduct = allProducts.find(
          item => item._id === id
        )

        if (!selectedProduct) {
          throw new Error('Product not found')
        }

        setProduct(selectedProduct)

        setRelatedProducts(
          allProducts
            .filter(
              item =>
                item._id !== selectedProduct._id &&
                item.category === selectedProduct.category
            )
            .slice(0, 4)
        )
      } catch (err) {
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
    setQuantity(1)
    setAdded(false)
  }, [id])

  const handleAddToCart = () => {
    if (!product || product.isAvailable === false) return

    window.dispatchEvent(
      new CustomEvent('hammad:add-to-cart', {
        detail: {
          product,
          quantity
        }
      })
    )

    setAdded(true)
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f6] font-['Arial',sans-serif]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#315b42]" />
          <p className="mt-4 text-sm text-gray-500">
            Loading product...
          </p>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f6] px-5 font-['Arial',sans-serif]">
        <div className="max-w-md text-center">
          <FaUtensils className="mx-auto text-4xl text-gray-300" />
          <h2 className="mt-5 text-2xl font-bold text-[#243b2c]">
            Product Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {error || 'This product is not available.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 rounded-lg bg-[#315b42] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#244632]"
          >
            Back to Menu
          </button>
        </div>
      </main>
    )
  }

  const discount =
    product.discountPrice > 0 &&
    product.discountPrice < product.price
      ? Math.round(
          ((product.price - product.discountPrice) /
            product.price) *
            100
        )
      : 0

  return (
    <main className="min-h-screen bg-[#faf9f6] font-['Arial',sans-serif] text-[#242b25]">

      {/* Header */}
      <header className="border-b border-[#e9e7df] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#315b42]"
          >
            <FaArrowLeft />
            Back to Menu
          </button>

          <h1 className="text-xl font-bold tracking-tight text-[#315b42]">
            Hammad Foods
          </h1>

          <div className="w-20" />
        </div>
      </header>

      {/* Product Details */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Image */}
          <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl bg-white p-6 md:min-h-[520px]">
            {discount > 0 && (
              <span className="absolute left-5 top-5 z-10 rounded-full bg-[#a94b37] px-4 py-2 text-xs font-bold text-white">
                {discount}% OFF
              </span>
            )}

            {product.isFeatured && (
              <span className="absolute right-5 top-5 z-10 rounded-full bg-[#315b42] px-4 py-2 text-xs font-bold text-white">
                Featured
              </span>
            )}

            <img
              src={product.image}
              alt={product.name}
              onError={e => {
                e.currentTarget.style.display = 'none'
              }}
              className="max-h-[460px] w-full object-contain"
            />

            {!product.image && (
              <FaUtensils className="text-7xl text-gray-200" />
            )}
          </div>

          {/* Information */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a17a45]">
              {product.category || 'Fresh Food'}
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-[#243b2c] md:text-5xl">
              {product.name}
            </h2>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold text-[#315b42]">
                {formatPrice(getPrice(product))}
              </span>

              {discount > 0 && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <div className="my-8 h-px bg-[#e5e2d9]" />

            <h3 className="text-sm font-bold uppercase tracking-wider text-[#243b2c]">
              Product Description
            </h3>

            <p className="mt-4 text-base leading-8 text-gray-600">
              {product.description || 'Freshly prepared with quality ingredients.'}
            </p>

            <div className="mt-8 flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-600">
                Availability:
              </span>

              <span
                className={`text-sm font-bold ${
                  product.isAvailable === false
                    ? 'text-red-500'
                    : 'text-[#315b42]'
                }`}
              >
                {product.isAvailable === false
                  ? 'Currently Unavailable'
                  : 'In Stock'}
              </span>
            </div>

            {/* Quantity */}
            <div className="mt-8">
              <p className="mb-3 text-sm font-bold">
                Select Quantity
              </p>

              <div className="flex h-12 w-fit items-center overflow-hidden rounded-lg border border-[#deded5] bg-white">
                <button
                  onClick={() =>
                    setQuantity(prev => Math.max(1, prev - 1))
                  }
                  disabled={quantity <= 1}
                  className="flex h-full w-12 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
                >
                  <FaMinus size={12} />
                </button>

                <span className="flex h-full w-12 items-center justify-center border-x border-[#deded5] text-sm font-bold">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="flex h-full w-12 items-center justify-center text-gray-600 transition hover:bg-gray-100"
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.isAvailable === false}
              className="mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#315b42] px-6 text-sm font-bold text-white transition hover:bg-[#244632] disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto sm:min-w-[250px]"
            >
              <FaShoppingBag />
              {product.isAvailable === false
                ? 'Unavailable'
                : added
                  ? 'Added to Cart'
                  : 'Add to Cart'}
            </button>

            <p className="mt-5 text-xs leading-6 text-gray-400">
              Fresh taste, quality ingredients and carefully prepared food.
            </p>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-[#e9e7df] bg-white px-5 py-14 md:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a17a45]">
              You May Also Like
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#243b2c]">
              Related Products
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map(item => (
                <button
                  key={item._id}
                  onClick={() => {
                    navigate(`/product/${item._id}`)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="overflow-hidden rounded-xl border border-[#eceae3] bg-[#faf9f6] text-left transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-48 items-center justify-center bg-white p-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <FaUtensils className="text-4xl text-gray-200" />
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-[#243b2c]">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm font-bold text-[#315b42]">
                      {formatPrice(getPrice(item))}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#243b2c] px-5 py-8 text-center text-white">
        <h3 className="text-lg font-bold">Hammad Foods</h3>
        <p className="mt-2 text-xs text-white/60">
          Fresh taste. Quality ingredients. Every time.
        </p>
      </footer>

    </main>
  )
}

export default SingleProduct
