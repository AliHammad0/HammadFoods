
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import Order from '../model/order.js'
import Product from '../model/product.js'
import User from '../model/users.js'
import * as config from '../config/config.js'

// CREATE ORDER
export const createOrder = async (req, res) => {
  const updatedProducts = []

  try {
    const {
      name,
      email,
      phone,
      address,
      customer,
      items,
      notes
    } = req.body

    const customerName = customer?.name || name
    const customerEmail = customer?.email || email
    const customerPhone = customer?.phone || phone
    const customerAddress = customer?.address || address

    if (
      !customerName ||
      !customerPhone ||
      !customerAddress ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        ok: false,
        message: 'Please provide customer details and order items'
      })
    }

    const productQuantities = new Map()

    for (const item of items) {
      const productId = item.product || item._id || item.id
      const quantity = Number(item.quantity)

      if (
        !mongoose.Types.ObjectId.isValid(productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          ok: false,
          message: 'Invalid product ID or quantity'
        })
      }

      productQuantities.set(
        String(productId),
        (productQuantities.get(String(productId)) || 0) + quantity
      )
    }

    const orderItems = []
    let subtotal = 0

    for (const [productId, quantity] of productQuantities) {
      const product = await Product.findOneAndUpdate(
        {
          _id: productId,
          isAvailable: true,
          stock: { $gte: quantity }
        },
        {
          $inc: { stock: -quantity }
        },
        { new: true }
      )

      if (!product) {
        throw new Error(
          `Product is unavailable or has insufficient stock: ${productId}`
        )
      }

      updatedProducts.push({
        id: product._id,
        quantity
      })

      if (product.stock === 0) {
        product.isAvailable = false
        await product.save()
      }

      const price =
        product.discountPrice > 0 &&
        product.discountPrice < product.price
          ? product.discountPrice
          : product.price

      const itemSubtotal = price * quantity
      subtotal += itemSubtotal

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price,
        quantity,
        subtotal: itemSubtotal
      })
    }

    const deliveryCharges = 0

    const order = await Order.create({
      orderNumber: `HF-${Date.now()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
      customer: {
        name: customerName,
        email: customerEmail || '',
        phone: customerPhone,
        address: customerAddress
      },
      items: orderItems,
      subtotal,
      deliveryCharges,
      totalAmount: subtotal + deliveryCharges,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      notes: notes || ''
    })

    return res.status(201).json({
      ok: true,
      message: 'Order placed successfully',
      order
    })

  } catch (error) {
    for (const item of updatedProducts) {
      try {
        const product = await Product.findById(item.id)

        if (product) {
          product.stock += item.quantity
          product.isAvailable = product.stock > 0
          await product.save()
        }
      } catch (restoreError) {
        console.error('Stock restore error:', restoreError.message)
      }
    }

    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// GET ALL ORDERS
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      ok: true,
      total: orders.length,
      orders
    })

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// GET MY ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        message: 'Please login to view your orders'
      })
    }

    if (!config.SECRET_KEY) {
      throw new Error('SECRET_KEY is missing in config')
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, config.SECRET_KEY)

    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found'
      })
    }

    const orders = await Order.find({
      'customer.email': user.email
    })
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      ok: true,
      message: 'Your orders fetched successfully',
      total: orders.length,
      orders
    })

  } catch (error) {
    console.error('GET MY ORDERS ERROR:', error)

    return res.status(401).json({
      ok: false,
      message: 'Invalid or expired login session'
    })
  }
}

// GET SINGLE ORDER
export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber
    }).populate('items.product', 'name image price')

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: 'Order not found'
      })
    }

    return res.status(200).json({
      ok: true,
      order
    })

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const status = req.body.orderStatus || req.body.status

    const allowedStatuses = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Out for Delivery',
      'Delivered',
      'Cancelled'
    ]

    if (
      typeof status !== 'string' ||
      !allowedStatuses.includes(status.trim())
    ) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid order status',
        allowedStatuses
      })
    }

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: 'Order not found'
      })
    }

    if (
      order.orderStatus === 'Cancelled' ||
      order.orderStatus === 'Delivered'
    ) {
      return res.status(400).json({
        ok: false,
        message: 'This order can no longer be updated'
      })
    }

    if (status === 'Cancelled') {
      for (const item of order.items) {
        if (!item.product) continue

        const product = await Product.findById(item.product)

        if (product) {
          product.stock += item.quantity
          product.isAvailable = product.stock > 0
          await product.save()
        }
      }
    }

    order.orderStatus = status.trim()
    await order.save()

    return res.status(200).json({
      ok: true,
      message: 'Order status updated successfully',
      order
    })

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}
