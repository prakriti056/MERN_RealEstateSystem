import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./pages/shared/LandingPage";
import Properties from "./pages/shared/Properties";
import PropertyDetails from "./pages/shared/propertyDetails";
import Login from "./pages/shared/auth/Login";
import Register from "./pages/shared/auth/Register";
import VerifyEmail from './pages/shared/auth/VerifyEmail';
import ForgotPassword from './pages/shared/auth/ForgotPassword';
import ResetPassword from './pages/shared/auth/ResetPassword';
import Profile from './pages/shared/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLayout from './components/AdminLayout';
import SellerRequests from './pages/admin/SellerRequests';
import AdminProperties from './pages/admin/AdminProperties';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminContacts from './pages/admin/AdminContacts';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerLayout from './components/SellerLayout';
import AddProperty from './pages/seller/AddProperty';
import MyProperties from './pages/seller/MyProperties';
import EditProperty from './pages/seller/EditProperty';
import { ProtectedRoute, PublicRoute } from './components/common/ProtectedRoute';
import { FaChevronUp } from 'react-icons/fa';
import { useAuth } from './context/AuthContext';
import MyInquiries from './pages/buyer/MyInquiries';
import ChatMessages from './pages/shared/ChatMessages';
import Contact from './pages/shared/Contact';
import Wishlist from './pages/buyer/Wishlist';

// to scroll to top whenever the route is change
const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

// floating scroll to top btn
const ScrollTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hanleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", hanleScroll);
    hanleScroll();

    return () => window.removeEventListener("scroll", hanleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button onClick={handleClick} className={`fixed bottom-6
    right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all
    duration-300 ${visible
        ? "scale-100 opacity-100 bg-emerald-500 text-white hover:bg-green-400"
        : " pointer-events-none scale-0 opacity-0"

      }
    `}>

      <FaChevronUp size={22} />

    </button>
  );

};

// smart lyout wrapper for seller and buyer
const SellerLayoutWrapper = () => {
  const { user } = useAuth();
  return user?.role === "seller" ? <SellerLayout /> : <Outlet />;
};


const App = () => {

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    return () => {
      document.body.style.overflowX = "";
      document.documentElement.style.overflowX = "";
    };
  }, []); // prevent horizontal overflow on the whole app

  return (
    <div className=" min-h-screen w-full overflow-x-hidden">
      <ScrollToTopOnRouteChange />
      <ScrollTopButton />

      <Routes>

        <Route element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>



        <Route path="/" element={<LandingPage />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/contact" element={<Contact />} />

        <Route 
        element={<ProtectedRoute allowedRoles={["buyer", "seller", "admin"]} />
        }
         >

          <Route element={<SellerLayoutWrapper />} >
          <Route path="/inquiries" element={<MyInquiries />} />
          <Route path="/chat-messages" element={<ChatMessages />} />
           <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
          </Route>


          <Route element={<ProtectedRoute allowedRoles={["seller"]} />} >
            <Route element={<SellerLayout />} >
              <Route path="/dashboard" element={<SellerDashboard />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/add-property" element={<AddProperty />} />
              <Route path="/my-properties" element={<MyProperties />} />
              <Route path="/edit-property/:id" element={<EditProperty />} />
            </Route>
          </Route>

          <Route element={< ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/seller-requests" element={<SellerRequests />} />
              <Route path="/admin/properties" element={<AdminProperties />} />
              <Route path="/admin/inquiries" element={<AdminInquiries />} />
              <Route path="/admin/contacts" element={<AdminContacts />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to='/' replace />} />

      </Routes>
    </div>
  );
};

export default App;