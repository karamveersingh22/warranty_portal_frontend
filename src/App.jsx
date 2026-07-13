import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import CustomerLayout from './components/CustomerLayout'
import AdminLayout from './components/AdminLayout'
import CustomerLanding from './pages/customer/Landing'
import CustomerRegister from './pages/customer/Register'
import CustomerLogin from './pages/customer/Login'
import OTPVerification from './pages/customer/OTPVerification'
import AdminLogin from './pages/admin/AdminLogin'
import CustomerLogout from './pages/customer/CustomerLogout'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import CustomerProfile from './pages/customer/Profile'
import RegisterProduct from './pages/customer/RegisterProduct'
import MyProducts from './pages/customer/MyProducts'
import ProductDetail from './pages/customer/ProductDetail'
import CustomerWarrantyRules from './pages/customer/WarrantyRules'
import CustomerEnquiry from './pages/customer/Enquiry'
import CustomerSupport from './pages/customer/Support'
import CustomerDealers from './pages/customer/Dealers'
import CustomerCatalogue from './pages/customer/Catalogue'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUploadDBF from './pages/admin/UploadDBF'
import AdminImportHistory from './pages/admin/ImportHistory'
import AdminProducts from './pages/admin/Products'
import AdminPieceSearch from './pages/admin/PieceSearch'
import AdminPieceDetail from './pages/admin/PieceDetail'
import AdminCustomers from './pages/admin/Customers'
import AdminCustomerDetail from './pages/admin/CustomerDetail'
import AdminEnquiries from './pages/admin/Enquiries'
import AdminEnquiryDetail from './pages/admin/EnquiryDetail'
import WarrantyRulesAdmin from './pages/admin/WarrantyRulesAdmin'
import RegistrationRequests from './pages/admin/RegistrationRequests'
import SupportAdmin from './pages/admin/SupportAdmin'
import './App.css'

function PublicScreen({ children }) {
  return (
    <main className="min-h-screen bg-surface-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">{children}</div>
    </main>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PublicScreen><CustomerLanding /></PublicScreen>} />
          <Route path="/login" element={<PublicScreen><CustomerLogin /></PublicScreen>} />
          <Route path="/verify-otp" element={<PublicScreen><OTPVerification /></PublicScreen>} />
          <Route path="/catalogue" element={<PublicScreen><CustomerCatalogue /></PublicScreen>} />

          <Route path="/customer">
            <Route index element={<PublicScreen><CustomerLanding /></PublicScreen>} />
            <Route path="register" element={<PublicScreen><CustomerRegister /></PublicScreen>} />
            <Route path="login" element={<Navigate to="/login" replace />} />
            <Route path="verify-otp" element={<Navigate to="/verify-otp" replace />} />
            <Route element={<ProtectedRoute requiredRole="customer" />}>
              <Route element={<CustomerLayout />}>
                <Route path="dashboard" element={<CustomerDashboard />} />
                <Route path="profile" element={<CustomerProfile />} />
                <Route path="register-product" element={<RegisterProduct />} />
                <Route path="my-products" element={<MyProducts />} />
                <Route path="product/:piece" element={<ProductDetail />} />
                <Route path="enquiry" element={<CustomerEnquiry />} />
                <Route path="warranty-rules" element={<CustomerWarrantyRules />} />
                <Route path="support" element={<CustomerSupport />} />
                <Route path="dealers" element={<CustomerDealers />} />
                <Route path="logout" element={<CustomerLogout />} />
              </Route>
            </Route>
          </Route>

          <Route path="/admin">
            <Route index element={<Navigate to="/login" replace state={{ from: { pathname: '/admin/dashboard' } }} />} />
            <Route path="login" element={<PublicScreen><AdminLogin /></PublicScreen>} />
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="upload-dbf" element={<AdminUploadDBF />} />
                <Route path="import-history" element={<AdminImportHistory />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="registration-requests" element={<RegistrationRequests />} />
                <Route path="piece-search" element={<AdminPieceSearch />} />
                <Route path="piece/:piece" element={<AdminPieceDetail />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="customer/:id" element={<AdminCustomerDetail />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
                <Route path="enquiry/:id" element={<AdminEnquiryDetail />} />
                <Route path="warranty-rules" element={<WarrantyRulesAdmin />} />
                <Route path="support" element={<SupportAdmin />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </AuthProvider>
  )
}

export default App
