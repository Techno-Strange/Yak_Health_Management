import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home({ isAdmin }) {
  const navigate = useNavigate();

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

  return (
    <>
      <section className="hero-section">
        <h2>Welcome to Yak Health Portal</h2>
        <p className="subtitle">
          {isAdmin 
            ? "Veteran Dashboard — Manage all yak records, health data, and system entries" 
            : "Comprehensive health management and tracking system for your yak livestock"}
        </p>
        <img src="/assets/Bg2.JPG" alt="A robust yak" className="hero-yak-image" />
      </section>

      <section id="about" className="about-section">
        <h3 className="section-title">
          {isAdmin ? "Yak Management Dashboard" : "About Yak Management System"}
        </h3>
        <div className="about-content">
          <div className="about-text">
            {isAdmin ? (
              <p>You have full administrative access. View statistics, manage records, and monitor the entire yak health system.</p>
            ) : (
              <>
                <p>Our Yak Health Management System helps farmers and veterinarians track, monitor, and manage yak health efficiently.</p>
                <p>Access individual animal profiles, vaccination history, and generate reports instantly.</p>
              </>
            )}
            <ul className="feature-list">
              <li><CheckIcon /> Individual yak profiles</li>
              <li><CheckIcon /> Vaccination & treatment tracking</li>
              <li><CheckIcon /> Health record management</li>
              <li><CheckIcon /> Easy search & PDF reports</li>
              {isAdmin && <li><CheckIcon /> Full admin dashboard & analytics</li>}
            </ul>
          </div>
          <div className="about-visual">
            <MountainIcon />
            <p>Protecting Highland Livestock</p>
          </div>
        </div>
      </section>

      {/* Main Action Section */}
      <section className="find-section">
        <h3 className="section-title">
          {isAdmin ? "Go to Veteran Dashboard" : "Find Your Yak"}
        </h3>
        <p className="text-lg text-gray-700 mb-8">
          {isAdmin 
            ? "Access the complete admin panel with statistics, yak management, and system controls." 
            : "Quickly search for any yak by ear tag, name, or owner details."}
        </p>

        <div className="home-button-group">
          {/* Normal user → Search */}
          {!isAdmin && (
            <button 
              className="btn btn-primary btn-large" 
              onClick={() => navigate("/search-page")}
            >
              Search for Yak
            </button>
          )}

          {/* Admin → Go to Dashboard (not YakManagement) */}
          {isAdmin && (
            <button 
              className="btn btn-success btn-large font-bold text-xl"
              onClick={() => navigate("/dashboard")}   // ← This is where Dashboard is rendered for admin
            >
              Open Veteran Dashboard
            </button>
          )}
        </div>
      </section>
    </>
  );
}