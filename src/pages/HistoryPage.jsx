import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ArrowLeft, History, Database, Download, BarChart3, Calendar, Rows3, Columns, Loader2 } from 'lucide-react';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { getSessions, user } = useAuth();
  const { setCleanData, setColumns, setTableName, setChartConfigs } = useData();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
    setLoading(false);
  };

  const downloadCSV = (session) => {
    const data = session.cleanData;
    if (!data || data.length === 0) {
      alert('No data available for this session');
      return;
    }
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','), ...data.map(row => headers.map(h => `"${(row[h] ?? '').toString().replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.database}_${session.table}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportDashboard = (session) => {
    // Load session data into context and navigate to dashboard
    if (session.cleanData) {
      setCleanData(session.cleanData);
      setColumns(session.columns || Object.keys(session.cleanData[0] || {}));
      setTableName(session.table || session.database);

      // Auto-generate some chart configs
      const cols = session.columns || Object.keys(session.cleanData[0] || {});
      const autoConfigs = [];
      if (cols.length >= 1) {
        autoConfigs.push({ columns: [cols[0]], chartType: 'bar', chartLabel: 'Bar Chart', id: Date.now() });
      }
      if (cols.length >= 2) {
        autoConfigs.push({ columns: [cols[0], cols[1]], chartType: 'line', chartLabel: 'Multi-Line', id: Date.now() + 1 });
      }
      if (cols.length >= 1) {
        autoConfigs.push({ columns: [cols[Math.min(2, cols.length - 1)]], chartType: 'pie', chartLabel: 'Pie Chart', id: Date.now() + 2 });
      }
      setChartConfigs(autoConfigs);
      navigate('/dashboard-view');
    } else {
      alert('No data available for this session');
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ minHeight: '100vh', padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ padding: '10px 16px' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
            <span className="gradient-text">Search</span> History
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Your previous analysis sessions</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }} />
        </div>
      ) : sessions.length === 0 ? (
        <div className="glass-card fade-in-up" style={{ maxWidth: '500px', margin: '0 auto', padding: '60px', textAlign: 'center' }}>
          <History size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>No History Yet</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Connect a database and run an analysis to see your history here.</p>
          <button className="btn-primary" onClick={() => navigate('/connect')}>
            <Database size={16} /> Connect Database
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sessions.map((session, i) => (
            <div key={session.id || i} className="glass-card fade-in-up" style={{ padding: '24px', animationDelay: `${i * 0.1}s` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(108, 92, 231, 0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Database size={20} color="var(--accent-primary)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{session.database}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Table: {session.table}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      <Calendar size={14} /> {formatDate(session.createdAt)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      <Rows3 size={14} /> {session.originalRows || '—'} → {session.cleanRows || '—'} rows
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      <Columns size={14} /> {session.columns?.length || '—'} columns
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-secondary" onClick={() => downloadCSV(session)} style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                    <Download size={14} /> CSV
                  </button>
                  <button className="btn-primary" onClick={() => exportDashboard(session)} style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                    <BarChart3 size={14} /> Export Dashboard
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
