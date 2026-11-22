
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import * as config from './config/config.js'
import connectDB from './config/DBconfig.js'

import productRoutes from './routes/product.js'
import userRoutes from './routes/users.js'
import orderRoutes from './routes/order.js'

const app = express()

const port = config.PORT || 8080

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))

// API Routes
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/orders', orderRoutes)

// Test Route
app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Hammad Foods API is running'
  })
})

// Local Server
if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
    })
  })
}

export default app
