import { Routes, Route, Link, Navigate } from "react-router-dom";
import React, { useState, useEffect } from 'react'; 
import './App.css';
import SearchPage from "./components/SearchPage";
import YakDetail from "./components/YakDetail";
import Login from "./components/login";
import Home from "./components/home";
import YakManagement from "./components/YakManagement"; 
import Dashboard from "./components/Dashboard";
import { supabase } from "./components/supabass"; 

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); 
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- 🔒 ADMIN SETTINGS ---
  const ADMIN_EMAIL = "admin@gmail.com"; 
  const currentUserEmail = session?.user?.email?.toLowerCase().trim();
  const targetAdminEmail = ADMIN_EMAIL.toLowerCase().trim();
  const isAdmin = currentUserEmail === targetAdminEmail;

  // --- DEBUGGING ---
  useEffect(() => {
    if (session) {
      console.log("🔹 Logged in as:", currentUserEmail);
      console.log("🔸 Required Admin:", targetAdminEmail);
      console.log("✅ Is Admin?", isAdmin);
    }
  }, [session, currentUserEmail, targetAdminEmail, isAdmin]);

  const isAuthenticated = !!session;

  const YakLogo = () => (
    <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M65.4 43.7C63.6 39.1 61.2 35.1 58.1 31.8C55 28.5 51.3 26.1 47.1 24.7C40.8 22.6 34 22.8 27.9 25.3C21.8 27.8 16.7 32.5 13.5 38.5C11.9 41.5 11.1 44.8 11.1 48.1C11.1 51.7 11.9 55.3 13.6 58.5C14.5 60.2 15.6 61.8 16.9 63.3L19.8 66.5C21.9 68.8 24.3 70.8 27 72.5C31.1 75.1 35.7 76.6 40.5 76.9C45.3 77.2 50 76.3 54.3 74.3C58.6 72.3 62.4 69.2 65.4 65.4L68.2 61.8C70.3 59.2 71.8 56.2 72.7 53.1L74.8 45.9C75 45.2 74.9 44.4 74.5 43.8C74.2 43.2 73.6 42.8 72.9 42.8L66.7 42.8C66.1 42.8 65.6 43.2 65.4 43.7Z" fill="#785B4F" stroke="#4A3C31" strokeWidth="3"/>
      <path d="M72.9 42.8C73.6 42.8 74.2 43.2 74.5 43.8C74.9 44.4 75 45.2 74.8 45.9L72.7 53.1C71.8 56.2 70.3 59.2 68.2 61.8L65.4 65.4C64.6 66.5 63.7 67.5 62.8 68.4C61.8 69.3 60.8 70.1 59.7 70.8L59.7 70.8C59.7 70.8 72.9 42.8 72.9 42.8Z" fill="#8E6E5E" />
      <path d="M25 22C25 20.3431 26.3431 19 28 19H32C33.6569 19 35 20.3431 35 22V25C35 26.6569 33.6569 28 32 28H28C26.3431 28 25 26.6569 25 25V22Z" fill="#4A3C31"/>
      <path d="M75 22C75 20.3431 76.3431 19 78 19H82C83.6569 19 85 20.3431 85 22V25C85 26.6569 83.6569 28 82 28H78C76.3431 28 75 26.6569 75 25V22Z" fill="#4A3C31" transform="rotate(-30 80 23)"/>
      <path d="M60 45H85L80 55H55L60 45Z" fill="#B38B6D" />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="check-icon" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
    </svg>
  );

  const MountainIcon = () => (
    <svg className="mountain-icon" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 0L0 70H100L50 0Z" fill="#A5D6A7"/>
      <path d="M50 0L20 70H80L50 0Z" fill="#66BB6A"/>
      <path d="M60 25L50 0L40 25L45 15L50 22L55 15L60 25Z" fill="white" fillOpacity="0.8"/>
    </svg>
  );

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <>
      {isAuthenticated && (
        <header className="header">
          <div className="container flex-space-between items-center">
            <div className="logo-container flex items-center gap-x-3">
              <YakLogo />
              <div>
                <h1>Yak Health Management System</h1>
                <p>Welcome to Yak Health Portal</p>
              </div>
            </div>

            <nav className="main-nav flex items-center gap-x-6">
              <Link to="/home" className="text-gray-600 hover:text-blue-600">Home</Link>
              <Link to="/search-page" className="text-gray-600 hover:text-blue-600">Search</Link>
              
              {isAdmin && (
                <Link to="/yak-management" className="text-gray-600 hover:text-blue-600 font-bold text-green-600">Manage</Link> 
              )}

              {/* Display logged in user email */}
              {session?.user?.email && (
                <span className="text-gray-700 italic">Welcome: {session.user.email}</span>
              )}

              <button 
                onClick={() => supabase.auth.signOut()}
                className="text-red-600 hover:underline"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </header>
      )}

      <main className="container">
        <Routes>
          <Route 
            path="/" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />} 
          />
          <Route
            path="/home"
            element={isAuthenticated ? <Home isAdmin={isAdmin} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/search-page"
            element={isAuthenticated ? <SearchPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/yak-details/:id"
            element={isAuthenticated ? <YakDetail /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated && isAdmin ? <Dashboard /> : <Navigate to="/home" replace />}
          />
          <Route
            path="/yak-management"
            element={isAuthenticated && isAdmin ? <YakManagement /> : <Navigate to="/home" replace />}
          />
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />} 
          />
        </Routes>
      </main>
    </>
  );
}
