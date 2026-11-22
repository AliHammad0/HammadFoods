import app from '../backend/server.js'
import connectDB from '../backend/config/DBconfig.js'

export default async function handler(req, res) {
  try {
    await connectDB()
    return app(req, res)
  } catch (error) {
    console.error('API Error:', error.message)

    return res.status(500).json({
      ok: false,
      message: 'Server error'
    })
  }
}