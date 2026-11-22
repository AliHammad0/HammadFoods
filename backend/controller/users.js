
import User, { ContactMessage } from '../model/users.js'
import jwt from 'jsonwebtoken'
import * as config from '../config/config.js'

// GENERATE JWT
const generateToken = (user) => {
  if (!config.SECRET_KEY) {
    throw new Error('SECRET_KEY is missing in config')
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    config.SECRET_KEY,
    {
      expiresIn: '7d'
    }
  )
}

// AUTHENTICATE LOGGED-IN USER
const getAuthenticatedUser = async (req) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Authentication required. Please login.')
    error.statusCode = 401
    throw error
  }

  const token = authHeader.split(' ')[1]

  const decoded = jwt.verify(token, config.SECRET_KEY)

  const user = await User.findById(decoded.id)

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  return user
}

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Please fill all required fields'
      })
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        ok: false,
        message: 'Name must contain at least 2 characters'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid email address'
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        ok: false,
        message: 'Password must be at least 8 characters'
      })
    }

    const existingUser = await User.findOne({
      email: normalizedEmail
    })

    if (existingUser) {
      return res.status(409).json({
        ok: false,
        message: 'Email already registered'
      })
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone || ''
    })

    const token = generateToken(user)

    return res.status(201).json({
      ok: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    })

  } catch (error) {
    console.error('SIGNUP ERROR:', error)

    return res.status(500).json({
      ok: false,
      message: 'Signup failed',
      error: error.message
    })
  }
}

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Email and password are required'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const user = await User.findOne({
      email: normalizedEmail
    }).select('+password')

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid email or password'
      })
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid email or password'
      })
    }

    const token = generateToken(user)

    return res.status(200).json({
      ok: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    })

  } catch (error) {
    console.error('LOGIN ERROR:', error)

    return res.status(500).json({
      ok: false,
      message: 'Login failed',
      error: error.message
    })
  }
}

// MY PROFILE - GET
export const getMyProfile = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req)

    return res.status(200).json({
      ok: true,
      message: 'Profile fetched successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    })

  } catch (error) {
    console.error('GET PROFILE ERROR:', error)

    return res.status(error.statusCode || 401).json({
      ok: false,
      message: error.statusCode ? error.message : 'Invalid or expired token'
    })
  }
}

// MY PROFILE - UPDATE
export const updateMyProfile = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req)

    const { name, phone } = req.body

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({
          ok: false,
          message: 'Name must contain at least 2 characters'
        })
      }

      if (name.trim().length > 60) {
        return res.status(400).json({
          ok: false,
          message: 'Name cannot exceed 60 characters'
        })
      }

      user.name = name.trim()
    }

    if (phone !== undefined) {
      user.phone = String(phone).trim()
    }

    await user.save()

    return res.status(200).json({
      ok: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    })

  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error)

    return res.status(error.statusCode || 400).json({
      ok: false,
      message: error.statusCode ? error.message : 'Profile update failed'
    })
  }
}

// CONTACT
export const createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message
    } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        ok: false,
        message: 'Please fill all required fields'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid email address'
      })
    }

    const contact = await ContactMessage.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone || '',
      subject: subject.trim(),
      message: message.trim()
    })

    return res.status(201).json({
      ok: true,
      message: 'Your message has been sent successfully',
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject
      }
    })

  } catch (error) {
    console.error('CONTACT ERROR:', error)

    return res.status(500).json({
      ok: false,
      message: 'Contact submission failed',
      error: error.message
    })
  }
}
