import React, { useState } from 'react';

const FraudAlertScreen = () => {
  const [toast, setToast] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleAlert = () => {
    setToast({ type: 'success', message: '✅ Alert sent to Rajan (Son)' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDismiss = () => {
    setToast({ type: 'info', message: 'Marked as safe. We\'ll keep watching.' });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{ 
      backgroundColor: '#0F1B2D', 
      fontFamily: 'sans-serif', 
      width: '100%',
      padding: '20px',     
      position: 'relative', 
      overflow: 'hidden',
      borderRadius: '20px'
    }}>
      {/* Background glow */}
      <div style={{ 
        position: 'absolute', 
        top: '-10%', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '300px', 
        height: '300px', 
        background: 'radial-gradient(circle, rgba(230,57,70,0.4) 0%, rgba(15,27,45,0) 70%)', 
        zIndex: 0 
      }}></div>
      
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>
        
        {/* Header - Language Toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', color: '#fff', fontSize: '14px', marginBottom: '30px' }}>
          <span style={{ opacity: 1, fontWeight: 'bold' }}>EN</span>
          <span style={{ margin: '0 8px', opacity: 0.5 }}>|</span>
          <span style={{ opacity: 0.5 }}>हि</span>
          <span style={{ margin: '0 8px', opacity: 0.5 }}>|</span>
          <span style={{ opacity: 0.5 }}>த</span>
        </div>

        {/* Danger Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(230,57,70,0.2)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            animation: 'pulse 2s infinite'
          }}>
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#E63946', 
              display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px' 
            }}>
              🛡️
            </div>
          </div>
        </div>

        {/* Text Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px 0' }}>⚠️ Fraud Alert Detected</h1>
          <p style={{ color: '#A0AABF', fontSize: '15px', margin: 0, lineHeight: '1.4' }}>A suspicious message was found on Amma's phone</p>
        </div>

        {/* Alert Card */}
        <div style={{ 
          backgroundColor: '#F7F3EE', 
          borderRadius: '12px', 
          borderLeft: '4px solid #E63946', 
          padding: '16px', 
          marginBottom: '20px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '4px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              HIGH RISK
            </span>
            <span style={{ color: '#6B7280', fontSize: '12px', fontWeight: '500' }}>2 mins ago</span>
          </div>

          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '12px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>Sender: KBC Lottery Official</p>
            <p style={{ margin: 0, fontSize: '14px', color: '#4B5563', lineHeight: '1.5' }}>
              {expanded ? "You have WON ₹25,00,000! Click here to claim your prize now. Do not share this link with anyone. Verify your bank details urgently." : "You have WON ₹25,00,000! Click here to claim your prize now..."}
            </p>
            <button 
              onClick={() => setExpanded(!expanded)} 
              style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '13px', fontWeight: '500', padding: 0, marginTop: '8px', cursor: 'pointer' }}
            >
              {expanded ? "View less" : "View full message"}
            </button>
          </div>

          <p style={{ margin: 0, fontSize: '14px', color: '#4B5563', lineHeight: '1.5', fontWeight: '500' }}>
            This looks like a lottery scam. These messages often steal OTPs and bank details.
          </p>
        </div>


        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
          <button 
            onClick={handleAlert}
            style={{ 
              backgroundColor: '#E63946', color: '#fff', border: 'none', borderRadius: '8px', 
              padding: '16px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '100%',
              boxShadow: '0 4px 6px rgba(230, 57, 70, 0.2)'
            }}
          >
            Alert Family Member
          </button>
          <button 
            onClick={handleDismiss}
            style={{ 
              backgroundColor: 'transparent', color: '#A0AABF', border: '1px solid #6B7280', 
              borderRadius: '8px', padding: '16px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '100%' 
            }}
          >
            Mark as Safe
          </button>
        </div>

      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: toast.type === 'success' ? '#10B981' : '#4B5563',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '24px',
          fontSize: '14px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {toast.message}
        </div>
      )}

      {/* Inline styles for animations */}
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(230,57,70,0.5); }
          70% { box-shadow: 0 0 0 15px rgba(230,57,70,0); }
          100% { box-shadow: 0 0 0 0 rgba(230,57,70,0); }
        }
        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FraudAlertScreen;
