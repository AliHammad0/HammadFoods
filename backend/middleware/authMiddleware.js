
import jwt from 'jsonwebtoken'
import User from '../model/users.js'
import * as config from '../config/config.js'

// Verify Login
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        message: 'Please login first'
      })
    }

    const token = authHeader.split(' ')[1]

    if (!config.SECRET_KEY) {
      return res.status(500).json({
        ok: false,
        message: 'Server authentication configuration missing'
      })
    }

    const decoded = jwt.verify(token, config.SECRET_KEY)

    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'User account not found'
      })
    }

    req.user = user

    next()
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: 'Invalid or expired login session'
    })
  }
}

// Verify Admin Role
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      ok: false,
      message: 'Access denied. Admin permission required.'
    })
  }

  next()
}
