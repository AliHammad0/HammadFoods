
import express from 'express'

import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
} from '../controller/product.js'

import {
  protect,
  adminOnly
} from '../middleware/authMiddleware.js'

const productRoutes = express.Router()

// Public: Get All Products
productRoutes.get('/', getAllProducts)

// Public: Get Single Product
productRoutes.get('/:id', getSingleProduct)

// Admin: Create Product
productRoutes.post('/', protect, adminOnly, createProduct)

// Admin: Update Product
productRoutes.put('/:id', protect, adminOnly, updateProduct)

// Admin: Delete Product
productRoutes.delete('/:id', protect, adminOnly, deleteProduct)

export default productRoutes
