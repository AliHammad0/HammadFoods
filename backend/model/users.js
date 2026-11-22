
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    phone: {
      type: String,
      default: '',
      trim: true
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    contacts: [
      {
        subject: {
          type: String,
          required: true
        },
        message: {
          type: String,
          required: true
        },
        status: {
          type: String,
          enum: ['pending', 'read', 'resolved'],
          default: 'pending'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

// HASH PASSWORD
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return

  this.password = await bcrypt.hash(this.password, 12)
})

// COMPARE PASSWORD
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password)
}

// CONTACT MESSAGE SCHEMA
const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      default: '',
      trim: true
    },

    subject: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
)

// MODELS
const User =
  mongoose.models.User ||
  mongoose.model('User', userSchema)

export const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model('ContactMessage', contactMessageSchema)

export default User
