import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { useI18n } from '../i18n';

export default function Layout({ children }) {
  const { lang, setLang, t } = useI18n();
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
          
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textDecoration: 'none' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#185FA5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <i className="ti ti-shield-check" style={{ fontSize: '24px' }}></i>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', letterSpacing: '-0.5px' }}>GigShield</span>
          </Link>

          {/* Center Links */}
          <nav style={{ display: 'flex', gap: '8px' }}>
            <Link
              to="/"
              style={{ 
                background: activePath === '/' ? '#f1f5f9' : 'transparent',
                border: 'none', padding: '10px 20px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                color: activePath === '/' ? '#185FA5' : '#64748b', fontWeight: activePath === '/' ? '600' : '500',
                fontSize: '15px', transition: 'all 0.2s', textDecoration: 'none'
              }}
            >
              <i className="ti ti-home" style={{ fontSize: '20px' }}></i>
              {t('dashboard')}
            </Link>
            
            <Link
              to="/family-shield"
              style={{ 
                background: activePath === '/family-shield' ? '#f1f5f9' : 'transparent',
                border: 'none', padding: '10px 20px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                color: activePath === '/family-shield' ? '#185FA5' : '#64748b', fontWeight: activePath === '/family-shield' ? '600' : '500',
                fontSize: '15px', transition: 'all 0.2s', textDecoration: 'none'
              }}
            >
              <i className="ti ti-shield" style={{ fontSize: '20px' }}></i>
              Family Shield
            </Link>

            <Link
              to="/scheme"
              style={{ 
                background: activePath === '/scheme' ? '#f1f5f9' : 'transparent',
                border: 'none', padding: '10px 20px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                color: activePath === '/scheme' ? '#185FA5' : '#64748b', fontWeight: activePath === '/scheme' ? '600' : '500',
                fontSize: '15px', transition: 'all 0.2s', textDecoration: 'none'
              }}
            >
              <i className="ti ti-file-text" style={{ fontSize: '20px' }}></i>
              Schemes
            </Link>

            <Link
              to="/savings-goal"
              style={{ 
                background: activePath === '/savings-goal' ? '#f1f5f9' : 'transparent',
                border: 'none', padding: '10px 20px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                color: activePath === '/savings-goal' ? '#185FA5' : '#64748b', fontWeight: activePath === '/savings-goal' ? '600' : '500',
                fontSize: '15px', transition: 'all 0.2s', textDecoration: 'none'
              }}
            >
              <i className="ti ti-target" style={{ fontSize: '20px' }}></i>
              {t('savings_goal')}
            </Link>

            <Link
              to="/add-log"
              style={{ 
                background: activePath === '/add-log' ? '#f1f5f9' : 'transparent',
                border: 'none', padding: '10px 20px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                color: activePath === '/add-log' ? '#185FA5' : '#64748b', fontWeight: activePath === '/add-log' ? '600' : '500',
                fontSize: '15px', transition: 'all 0.2s', textDecoration: 'none'
              }}
            >
              <i className="ti ti-plus" style={{ fontSize: '20px' }}></i>
              {t('add_log')}
            </Link>
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
              {['en', 'hi', 'ta'].map(l => (
                <button 
                  key={l} onClick={() => setLang(l)}
                  style={{ background: lang === l ? '#fff' : 'transparent', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', color: lang === l ? '#185FA5' : '#64748b', cursor: 'pointer', boxShadow: lang === l ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }}></div>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#185FA5', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' }}>MK</div>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px 32px' }}>
        {children}
      </main>
    </div>
  );
}
