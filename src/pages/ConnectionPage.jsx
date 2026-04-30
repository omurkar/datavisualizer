import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Database, ArrowLeft, Plug, ChevronDown, Loader2, CheckCircle2, AlertCircle, Table2 } from 'lucide-react';

export default function ConnectionPage() {
  const navigate = useNavigate();
  const { dbConfig, setDbConfig, rawData, setRawData, setColumns, setTableName, tables, setTables, resetAll } = useData();
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: credentials, 2: select table

  // Use a ref to track the extraction ID that should trigger navigation
  const extractionIdRef = useRef(null);

  // Navigate ONLY when rawData changes AND it matches the current pending extraction
  useEffect(() => {
    if (extractionIdRef.current && rawData && rawData.length > 0) {
      extractionIdRef.current = null;
      navigate('/eda');
    }
  }, [rawData, navigate]);

  const handleChange = (field, value) => {
    setDbConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleConnect = async () => {
    setConnecting(true);
    setError('');
    try {
      const res = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbConfig),
      });
      const data = await res.json();
      if (data.success) {
        setTables(data.tables || []);
        setConnected(true);
        setStep(2);
      } else {
        setError(data.error || 'Connection failed');
      }
    } catch (err) {
      setError('Cannot connect to backend. Make sure the Python server is running on port 5000.');
    }
    setConnecting(false);
  };

  const handleExtract = async () => {
    if (!selectedTable || extracting) return;
    setExtracting(true);
    setError('');

    // Clear old data first to prevent stale state navigation
    setRawData(null);
    setColumns([]);
    setTableName('');

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dbConfig, table: selectedTable }),
      });
      const data = await res.json();
      if (data.success) {
        // Set a unique extraction ID before setting the data
        const extractId = Date.now().toString();
        extractionIdRef.current = extractId;
        setRawData(data.data);
        setColumns(data.columns);
        setTableName(selectedTable);
        // Navigation will happen in the useEffect when rawData updates
      } else {
        setError(data.error || 'Data extraction failed');
        setExtracting(false);
      }
    } catch (err) {
      console.error('Extract error:', err);
      setError(`Failed to extract data: ${err.message || 'Check if backend server is running on port 5000.'}`);
      setExtracting(false);
    }
  };

  const fields = [
    { key: 'host', label: 'Host', placeholder: 'localhost', type: 'text' },
    { key: 'port', label: 'Port', placeholder: '3306', type: 'text' },
    { key: 'user', label: 'Username', placeholder: 'root', type: 'text' },
    { key: 'password', label: 'Password', placeholder: '••••••••', type: 'password' },
    { key: 'database', label: 'Database Name', placeholder: 'my_database', type: 'text' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ padding: '10px 16px' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
            <span className="gradient-text">Database</span> Connection
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Connect to your MySQL database and select a project</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div style={{ maxWidth: '600px', margin: '0 auto 36px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
        {['Enter Credentials', 'Select Table'].map((label, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '700',
                background: step > i + 1 ? 'var(--success)' : step === i + 1 ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: step >= i + 1 ? 'white' : 'var(--text-muted)',
                border: `2px solid ${step >= i + 1 ? 'transparent' : 'var(--border-color)'}`,
              }}>
                {step > i + 1 ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: step === i + 1 ? '600' : '400', color: step === i + 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{label}</span>
            </div>
            {i < 1 && <div style={{ flex: 1, height: '2px', background: step > 1 ? 'var(--accent-primary)' : 'var(--border-color)', borderRadius: '1px' }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Card */}
      <div className="glass-card fade-in-up" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', background: 'rgba(225, 112, 85, 0.1)', border: '1px solid rgba(225, 112, 85, 0.3)', borderRadius: '12px', marginBottom: '24px', color: 'var(--danger)', fontSize: '0.85rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {step === 1 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(108, 92, 231, 0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={22} color="var(--accent-primary)" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>MySQL Connection</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Enter your database credentials</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {fields.map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>{f.label}</label>
                  <input
                    type={f.type}
                    className="input-field"
                    placeholder={f.placeholder}
                    value={dbConfig[f.key]}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    id={`db-${f.key}`}
                  />
                </div>
              ))}
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '28px', padding: '14px', opacity: connecting ? 0.7 : 1 }}
              onClick={handleConnect}
              disabled={connecting || !dbConfig.database}
              id="connect-btn"
            >
              {connecting ? <><div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} /> Connecting...</> : <><Plug size={18} /> Connect to Database</>}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(0, 184, 148, 0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={22} color="var(--success)" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Connected Successfully</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Database: {dbConfig.database}</p>
              </div>
            </div>

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              <Table2 size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Select a Table / Project
            </label>
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <select
                className="input-field"
                style={{ appearance: 'none', paddingRight: '40px', cursor: 'pointer' }}
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                id="table-select"
              >
                <option value="">— Choose a table —</option>
                {tables.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" onClick={() => { setStep(1); setConnected(false); }} style={{ flex: 1, justifyContent: 'center' }}>
                <ArrowLeft size={16} /> Back
              </button>
              <button
                className="btn-primary"
                style={{ flex: 2, justifyContent: 'center', opacity: extracting || !selectedTable ? 0.6 : 1 }}
                onClick={handleExtract}
                disabled={extracting || !selectedTable}
                id="extract-btn"
              >
                {extracting ? <><div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} /> Extracting...</> : <><Database size={18} /> Extract Data</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
