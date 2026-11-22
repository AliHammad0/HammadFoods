
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add product to cart
    addToCart: (state, action) => {
      const product = action.payload
      const productId = product._id || product.id

      if (!productId) return

      const existingProduct = state.items.find(
        (item) => String(item._id || item.id) === String(productId)
      )

      if (existingProduct) {
        existingProduct.quantity += 1
      } else {
        state.items.push({
          ...product,
          quantity: 1
        })
      }
    },

    // Increase product quantity
    increaseQuantity: (state, action) => {
      const product = state.items.find(
        (item) => String(item._id || item.id) === String(action.payload)
      )

      if (product) {
        product.quantity += 1
      }
    },

    // Decrease product quantity
    decreaseQuantity: (state, action) => {
      const product = state.items.find(
        (item) => String(item._id || item.id) === String(action.payload)
      )

      if (product && product.quantity > 1) {
        product.quantity -= 1
      }
    },

    // Remove product from cart
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => String(item._id || item.id) !== String(action.payload)
      )
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = []
    }
  }
})

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart
} = cartSlice.actions

export default cartSlice.reducer
