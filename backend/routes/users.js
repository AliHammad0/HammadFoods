
import express from 'express'

import {
  signup,
  login,
  createContact,
  getMyProfile,
  updateMyProfile
} from '../controller/users.js'

const userRoutes = express.Router()

// AUTH ROUTES
userRoutes.post('/signup', signup)
userRoutes.post('/login', login)

// MY PROFILE ROUTES
userRoutes.get('/my-profile', getMyProfile)
userRoutes.put('/my-profile', updateMyProfile)

// CONTACT ROUTE
userRoutes.post('/contact', createContact)

export default userRoutes
