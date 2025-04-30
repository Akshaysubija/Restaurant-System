
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Menu from './components/Menu';
import OrdersPage from './components/OrdersPage';
import PaymentsPage from './components/PaymentsPage';
import ReservationPage from './components/ReservationPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer'; // Import Footer Component
import Feedback from './components/Feedback'; // Import Feedback Component
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar and Toast Container */}
        <Navbar />
        <ToastContainer />

        {/* Routes for different pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reserve"
            element={
              <ProtectedRoute>
                <ReservationPage />
              </ProtectedRoute>
            }
          />
          <Route path="/feedback" element={<Feedback />} /> {/* Add the Feedback route */}
        </Routes>

        {/* Footer Component */}
        <Footer />
        
        {/* Chatbot */}
        <Chatbot /> 
      </div>
    </Router>
  );
}

export default App;
