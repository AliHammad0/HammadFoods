import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true
    },

    description: {
      type: String,
      required: [true, 'Product description is required']
    },

    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true
    },

    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: 0
    },

    image: {
      type: String,
      required: [true, 'Product image is required']
    },

    stock: {
      type: Number,
      default: 0,
      min: 0
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const Product = mongoose.model('Product', productSchema)

export default Product