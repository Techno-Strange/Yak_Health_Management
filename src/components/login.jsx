import React, { useEffect } from "react"; // Removed unused Suspense
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabass"; // Adjust path if needed
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. Please try again later.</h2>;
    }
    return this.props.children;
  }
}

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate('/home');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="login-container">
      <header className="login-header">
        <div className="login-header-content">
          <div className="login-logo-container">
            <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* ... svg paths ... */}
              <path d="M65.4 43.7C63.6 39.1 61.2 35.1 58.1 31.8C55 28.5 51.3 26.1 47.1 24.7C40.8 22.6 34 22.8 27.9 25.3C21.8 27.8 16.7 32.5 13.5 38.5C11.9 41.5 11.1 44.8 11.1 48.1C11.1 51.7 11.9 55.3 13.6 58.5C14.5 60.2 15.6 61.8 16.9 63.3L19.8 66.5C21.9 68.8 24.3 70.8 27 72.5C31.1 75.1 35.7 76.6 40.5 76.9C45.3 77.2 50 76.3 54.3 74.3C58.6 72.3 62.4 69.2 65.4 65.4L68.2 61.8C70.3 59.2 71.8 56.2 72.7 53.1L74.8 45.9C75 45.2 74.9 44.4 74.5 43.8C74.2 43.2 73.6 42.8 72.9 42.8L66.7 42.8C66.1 42.8 65.6 43.2 65.4 43.7Z" fill="#785B4F" stroke="#4A3C31" strokeWidth="3"/>
              <path d="M72.9 42.8C73.6 42.8 74.2 43.2 74.5 43.8C74.9 44.4 75 45.2 74.8 45.9L72.7 53.1C71.8 56.2 70.3 59.2 68.2 61.8L65.4 65.4C64.6 66.5 63.7 67.5 62.8 68.4C61.8 69.3 60.8 70.1 59.7 70.8L59.7 70.8C59.7 70.8 59.7 70.8 59.7 70.8C59.7 70.8 72.9 42.8 72.9 42.8Z" fill="#8E6E5E" />
              <path d="M25 22C25 20.3431 26.3431 19 28 19H32C33.6569 19 35 20.3431 35 22V25C35 26.6569 33.6569 28 32 28H28C26.3431 28 25 26.6569 25 25V22Z" fill="#4A3C31"/>
              <path d="M75 22C75 20.3431 76.3431 19 78 19H82C83.6569 19 85 20.3431 85 22V25C85 26.6569 83.6569 28 82 28H78C76.3431 28 75 26.6569 75 25V22Z" fill="#4A3C3V" transform="rotate(-30 80 23)"/>
              <path d="M60 45H85L80 55H55L60 45Z" fill="#B38B6D" />
            </svg>
          </div>
          <div>
            <h1>Yak Health Management System</h1>
            <p>Welcome to Yak Health Portal</p>
          </div>
        </div>
      </header>

      <main className="login-main">
        <div className="login-card">
          <div className="login-image-section">
            <img src="/assets/DSC_4420.JPG" alt="Yaks in stable" className="login-image" />
          </div>
          <div className="login-form-section">
            <h2>WELCOME</h2>
            <ErrorBoundary>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['email']}
                // The view="sign_in" prop was removed from here
              />
            </ErrorBoundary>
          </div>
        </div>
      </main>
    </div>
  );
}