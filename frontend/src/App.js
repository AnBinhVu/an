import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LocationPage from './pages/LocationPage';
import CategoryPage from './pages/CategoryPage';
import PropertyPage from './pages/PropertyPage'; 
import AllPropertiesPage from './pages/AllPropertiesPage';
import PropertyDetail from './pages/Detail-PropertyPage';
import NotificationList from './pages/NotificationList_User';
import NotificationAdminPage from './pages/NotificationAdminPage';
import LoginPage from './pages/LoginPage';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/locations" element={<LocationPage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/properties" element={<PropertyPage />} />
        <Route path="/properties/apd" element={<AllPropertiesPage />} />
        <Route path="/properties/detail/:id" element={<PropertyDetail />} />
        <Route path="/notifications" element={<NotificationList />} />
        <Route path="/notifications/admin" element={<NotificationAdminPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );  
}

export default App;
