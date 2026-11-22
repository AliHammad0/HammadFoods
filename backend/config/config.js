
import dotenv from 'dotenv'

dotenv.config({ path: './backend/.env' })

export const PORT = process.env.PORT || 8080
export const SECRET_KEY = process.env.SECRET_KEY
export const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY
export const MONGO_URI = process.env.MONGO_URI
