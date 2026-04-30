import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Database, History, LogOut, BarChart3, Sparkles, ArrowRight, Zap, FileDown } from 'lucide-react';

export default function MainDashboard() {
  const { user, logout } = useAuth();
  const { resetAll } = useData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    resetAll();
    await logout();
    navigate('/');
  };

  const cards = [
    {
      icon: <Database size={28} />,
      title: 'Connect Database',
      desc: 'Connect to MySQL or MS SQL database and extract your project data',
      action: () => navigate('/connect'),
      gradient: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
    },
    {
      icon: <History size={28} />,
      title: 'Search History',
      desc: 'View previous analysis sessions and re-export dashboards',
      action: () => navigate('/history'),
      gradient: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', background: 'var(--accent-gradient)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={24} color="white" />
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: '800' }}>
            <span className="gradient-text">DataViz</span> Pro
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user?.photoURL && (
              <img src={user.photoURL} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }} />
            )}
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.displayName || user?.email}</span>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} id="logout-btn">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Welcome */}
      <div className="fade-in-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div className="float-anim" style={{ marginBottom: '24px' }}>
          <div style={{ width: '80px', height: '80px', margin: '0 auto', background: 'var(--accent-gradient)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(108, 92, 231, 0.3)' }}>
            <Sparkles size={36} color="white" />
          </div>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '12px', letterSpacing: '-1px' }}>
          Welcome, <span className="gradient-text">{user?.displayName?.split(' ')[0] || 'User'}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
          Connect your database, analyze your data, and generate stunning dashboards with AI.
        </p>
      </div>

      {/* Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
        {cards.map((card, i) => (
          <div
            key={i}
            className="glass-card fade-in-up"
            style={{ padding: '36px', cursor: 'pointer', transition: 'all 0.3s ease', animationDelay: `${0.2 + i * 0.15}s` }}
            onClick={card.action}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(108, 92, 231, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow)'; }}
          >
            <div style={{ width: '56px', height: '56px', background: card.gradient, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'white' }}>
              {card.icon}
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>{card.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px' }}>{card.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-secondary)', fontWeight: '600', fontSize: '0.9rem' }}>
              Get Started <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="fade-in-up" style={{ maxWidth: '800px', margin: '48px auto 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', animationDelay: '0.5s' }}>
        {[
          { icon: <Zap size={20} />, label: 'AI-Powered', value: 'Gemini API' },
          { icon: <BarChart3 size={20} />, label: 'Chart Types', value: '8+ Types' },
          { icon: <FileDown size={20} />, label: 'Export', value: 'PDF & CSV' },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ color: 'var(--accent-primary)', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
