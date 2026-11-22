
import mongoose from 'mongoose'
import * as config from './config.js'

const cached = globalThis.mongooseConnection || {
  conn: null,
  promise: null
}

globalThis.mongooseConnection = cached

const connectDB = async () => {
  if (!config.MONGO_URI) {
    throw new Error('MONGO_URI is missing. Check your environment variables.')
  }

  if (cached.conn) {
    return cached.conn
  }

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(config.MONGO_URI, {
        serverSelectionTimeoutMS: 10000
      })
    }

    cached.conn = await cached.promise

    console.log(`MongoDB Connected: ${cached.conn.connection.host}`)

    return cached.conn
  } catch (error) {
    cached.promise = null
    cached.conn = null

    console.error('MongoDB Connection Error:', error.message)
    throw error
  }
}

export default connectDB
