
import mongoose from 'mongoose'
import dns from 'node:dns'
import * as config from './config.js'

// Google DNS
dns.setServers([
  '8.8.8.8',
  '8.8.4.4'
])

const connectDB = async () => {
  try {
    if (!config.MONGO_URI) {
      throw new Error('MONGO_URI is missing. Check your .env file.')
    }

    const conn = await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message)
    process.exit(1)
  }
}

export default connectDB
