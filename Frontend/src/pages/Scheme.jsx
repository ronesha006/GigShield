import React from 'react';
import FraudAlertScreen from '../components/FraudAlertScreen';
import GovSchemesCard from '../components/GovSchemesCard';

function Scheme() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '16px',
          }}
        >
          Safety & Support Center
        </h1>

        <p
          style={{
            textAlign: 'center',
            color: '#6b7280',
            marginBottom: '40px',
            fontSize: '1.1rem',
          }}
        >
          Protect yourself from fraud and discover government support schemes.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
          }}
        >
          <div
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            }}
          >
            <FraudAlertScreen />
          </div>

          <div
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            }}
          >
            <GovSchemesCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scheme;