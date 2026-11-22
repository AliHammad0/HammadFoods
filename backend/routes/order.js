
import express from 'express'

import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus
} from '../controller/order.js'

import {
  protect,
  adminOnly
} from '../middleware/authMiddleware.js'

const orderRoutes = express.Router()

// Customer: Place Order
orderRoutes.post('/', createOrder)

// Customer: View Own Orders
orderRoutes.get('/my-orders', protect, getMyOrders)

// Admin: View All Orders
orderRoutes.get('/', protect, adminOnly, getAllOrders)

// Admin: Update Order Status
orderRoutes.put('/:id/status', protect, adminOnly, updateOrderStatus)

// Public: Track Single Order
orderRoutes.get('/:orderNumber', getSingleOrder)

export default orderRoutes
