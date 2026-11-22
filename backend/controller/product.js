import Product from '../model/product.js'
import slugify from 'slugify'

// Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      discountPrice,
      image,
      stock,
      isAvailable,
      isFeatured
    } = req.body

    if (!name || !description || !category || price === undefined || !image) {
      return res.status(400).json({
        ok: false,
        message: 'Please provide all required product fields'
      })
    }

    const product = await Product.create({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      description,
      category,
      price,
      discountPrice,
      image,
      stock,
      isAvailable,
      isFeatured
    })

    res.status(201).json({
      ok: true,
      message: 'Product created successfully',
      product
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })

    res.status(200).json({
      ok: true,
      total: products.length,
      products
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Get Single Product
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: 'Product not found'
      })
    }

    res.status(200).json({
      ok: true,
      product
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body }

    if (updateData.name) {
      updateData.slug = slugify(updateData.name, {
        lower: true,
        strict: true
      })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    )

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: 'Product not found'
      })
    }

    res.status(200).json({
      ok: true,
      message: 'Product updated successfully',
      product
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: 'Product not found'
      })
    }

    res.status(200).json({
      ok: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}