
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlices'

// Load saved cart from localStorage
const loadCart = () => {
  try {
    const savedCart = localStorage.getItem('hamad-foods-cart')

    return savedCart ? JSON.parse(savedCart) : { items: [] }
  } catch (error) {
    console.error('Cart loading error:', error)
    return { items: [] }
  }
}

const store = configureStore({
  reducer: {
    cart: cartReducer
  },
  preloadedState: {
    cart: loadCart()
  }
})

// Save cart whenever Redux state changes
store.subscribe(() => {
  try {
    localStorage.setItem(
      'hamad-foods-cart',
      JSON.stringify(store.getState().cart)
    )
  } catch (error) {
    console.error('Cart saving error:', error)
  }
})

export default store
