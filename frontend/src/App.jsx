
import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from 'react-router-dom'

import Product from './Pages/Product'
import Footer from './Pages/Footer'
import Header from './Pages/Header'
import CreateProduct from './Pages/CreateProduct'
import SingleProduct from './Pages/SingleProduct'
import Contact from './Pages/Contact'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Checkout from './Pages/Checkout'
import OrderSuccess from './Pages/OrderSuccess'
import AdminDashboard from './Pages/AdminDashboard'
import MyOrders from './Pages/MyOrders'
import MyProfile from './Pages/MyProfile'
import ProtectedAdminRoute from './Pages/ProtectedAdminRoute'

const AppContent = () => {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen">
      {!isAdminPage && <Header />}

      <main className={isAdminPage ? '' : 'mt-8'}>
        <Routes>
          <Route path="/" element={<Product />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-profile" element={<MyProfile />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>

      {!isAdminPage && <Footer />}
    </div>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
