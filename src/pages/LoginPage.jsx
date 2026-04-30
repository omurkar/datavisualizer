import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Sparkles, Database, Shield, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '1100px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
        
        {/* Left - Branding */}
        <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--accent-gradient)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={26} color="white" />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              <span className="gradient-text">DataViz</span> Pro
            </span>
          </div>
          
          <h1 style={{ fontSize: '3rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '16px', letterSpacing: '-1.5px' }}>
            Transform Data into<br />
            <span className="gradient-text">Stunning Dashboards</span>
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '40px' }}>
            Connect your database, let AI clean and analyze your data, and generate beautiful Power BI-style dashboards in minutes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: <Database size={18} />, text: 'Connect MySQL & MS SQL databases' },
              { icon: <Sparkles size={18} />, text: 'AI-powered EDA & data cleaning' },
              { icon: <BarChart3 size={18} />, text: 'Auto-generate beautiful dashboards' },
              { icon: <Shield size={18} />, text: 'Export to PDF & PPT formats' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                <div style={{ color: 'var(--accent-primary)' }}>{item.icon}</div>
                <span style={{ fontSize: '0.95rem' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Login Card */}
        <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
            <div className="float-anim" style={{ marginBottom: '32px' }}>
              <div style={{ width: '80px', height: '80px', margin: '0 auto', background: 'var(--accent-gradient)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(108, 92, 231, 0.4)' }}>
                <Sparkles size={36} color="white" />
              </div>
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '8px' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '36px', fontSize: '0.95rem' }}>
              Sign in to start analyzing your data
            </p>

            {error && (
              <div style={{ padding: '12px', background: 'rgba(225, 112, 85, 0.1)', border: '1px solid rgba(225, 112, 85, 0.3)', borderRadius: '10px', marginBottom: '20px', color: 'var(--danger)', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem', borderRadius: '14px', opacity: loading ? 0.7 : 1 }}
              id="google-login-btn"
            >
              {loading ? (
                <div className="spinner" style={{ width: '22px', height: '22px', borderWidth: '2px' }}></div>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.9 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"/>
                  </svg>
                  Sign in with Google
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '24px' }}>
              Secure authentication powered by Firebase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
