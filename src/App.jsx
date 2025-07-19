import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignIn from './pages/SignIn'
import RegisterAdmin from './pages/Register'
import Dashboard from './pages/Landing'
import ProductAnalysis from './pages/ProductAnalysis'
import Layout from './components/layout/Layout'
// import ProductDetails from './pages/ProductDetails'
import ProductSalesGraph from './components/products/ProductSalesGraph'
import CustomerAnalysis from './pages/CustomerAnalysis'
import CustomerDetails from './pages/customerDetails'
import ProductOrderGraph from './components/customers/ProductOrderGraph'
import OrderAnalysis from './pages/OrderAnalysis'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<RegisterAdmin />} />
        <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/ProductAnalysis" element={<ProductAnalysis/>}/>
        {/* <Route path="/product/:id" element={<ProductDetails />} /> */}
        <Route path="/product-sales/:id" element={<ProductSalesGraph />} />
        <Route path="/CustomerAnalysis" element={<CustomerAnalysis />} />
        <Route path="/customer-details/:id" element={<CustomerDetails />} />
        <Route path="/productOrdergraph" element={<ProductOrderGraph />} />
        <Route path="/orderAnalysis" element={<OrderAnalysis/>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
