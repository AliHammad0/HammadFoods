
import React, { useState } from 'react'
import {
  FaUtensils,
  FaImage,
  FaTag,
  FaDollarSign,
  FaBoxes,
  FaSave
} from 'react-icons/fa'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

const categories = [
  "Signature Pizza's",
  "Pan Pizza's",
  'Something New',
  'App-Only Offers',
  'Hot Deals',
  'Fried Section',
  'Appetizers',
  'Sandwiches',
  'Pasta',
  'Rolls',
  'Wings',
  'Fries Station',
  'Beverages',
  'Dips'
]

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    discountPrice: '0',
    image: '',
    stock: '0',
    isAvailable: true,
    isFeatured: false
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({
    type: '',
    text: ''
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setMessage({ type: '', text: '' })

      const token = localStorage.getItem('token')

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          discountPrice: Number(formData.discountPrice),
          stock: Number(formData.stock)
        })
      })

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Product creation failed')
      }

      setMessage({
        type: 'success',
        text: 'Product created successfully!'
      })

      setFormData({
        name: '',
        category: '',
        description: '',
        price: '',
        discountPrice: '0',
        image: '',
        stock: '0',
        isAvailable: true,
        isFeatured: false
      })

    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-8 font-['Arial',sans-serif] text-[#202020] md:px-8">

      <div className="mx-auto max-w-5xl">

        {/* Heading */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[#b38a4c]">
            Product Management
          </p>

          <h1 className="text-3xl font-black md:text-4xl">
            Create Product
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add a new food item to your Hammad Foods menu.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm"
        >

          {/* Basic Information */}
          <div className="border-b border-black/5 p-6 md:p-8">

            <div className="mb-6 flex items-center gap-3">
              <FaUtensils className="text-xl text-[#c89b55]" />

              <h2 className="text-lg font-black">
                Basic Information
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Product Name */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#c89b55]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c89b55]"
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write product description..."
                  rows="4"
                  required
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#c89b55]"
                />
              </div>

            </div>
          </div>

          {/* Pricing */}
          <div className="border-b border-black/5 p-6 md:p-8">

            <div className="mb-6 flex items-center gap-3">
              <FaDollarSign className="text-xl text-[#c89b55]" />

              <h2 className="text-lg font-black">
                Pricing Information
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Regular Price (Rs.) *
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 1650"
                  min="0"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#c89b55]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Discount Price (Rs.)
                </label>

                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  placeholder="Enter discount price"
                  min="0"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#c89b55]"
                />
              </div>

            </div>
          </div>

          {/* Image */}
          <div className="border-b border-black/5 p-6 md:p-8">

            <div className="mb-6 flex items-center gap-3">
              <FaImage className="text-xl text-[#c89b55]" />

              <h2 className="text-lg font-black">
                Product Image
              </h2>
            </div>

            <label className="mb-2 block text-sm font-bold">
              Image URL *
            </label>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/product-image.jpg"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#c89b55]"
            />

            {formData.image && (
              <div className="mt-5 flex h-52 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-3">
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="h-full w-full object-contain"
                  onError={e => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Stock and Settings */}
          <div className="p-6 md:p-8">

            <div className="mb-6 flex items-center gap-3">
              <FaBoxes className="text-xl text-[#c89b55]" />

              <h2 className="text-lg font-black">
                Inventory & Settings
              </h2>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold">
                Available Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                placeholder="Enter stock quantity"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#c89b55]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 p-4">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="h-4 w-4 accent-red-600"
                />

                <span className="text-sm font-bold">
                  Product Available
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 p-4">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 accent-red-600"
                />

                <span className="text-sm font-bold">
                  Featured Product
                </span>
              </label>

            </div>
          </div>

          {/* Response Message */}
          {message.text && (
            <div className={`mx-6 mb-5 rounded-xl p-4 text-sm font-bold md:mx-8 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-600'
            }`}>
              {message.text}
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col gap-3 border-t border-black/5 bg-[#faf9f6] p-6 sm:flex-row sm:justify-end md:px-8">

            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: '',
                  category: '',
                  description: '',
                  price: '',
                  discountPrice: '0',
                  image: '',
                  stock: '0',
                  isAvailable: true,
                  isFeatured: false
                })
                setMessage({ type: '', text: '' })
              }}
              className="rounded-full border border-gray-300 bg-white px-7 py-3.5 text-sm font-bold transition hover:bg-gray-100"
            >
              Reset Form
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-full bg-red-600 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaSave />

              {loading ? 'Creating...' : 'Create Product'}
            </button>

          </div>

        </form>
      </div>

    </main>
  )
}

export default CreateProduct
