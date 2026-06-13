import React, { useState, useEffect } from 'react';

const FraudAlertScreen = () => {
  const [currentScreen, setCurrentScreen] = useState('scanning');
  const [notifiedContacts, setNotifiedContacts] = useState(new Set());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (currentScreen === 'scanning') {
      const timer = setTimeout(() => {
        setCurrentScreen('alert');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleNotify = (id) => {
  setNotifiedContacts(prev => {
    const updated = new Set(prev);
    updated.add(id);
    return updated;
  });
};

  const handleReport = () => {
    setCurrentScreen('success');
  };

  const handleSafe = () => {
    setCurrentScreen('scanning');
    setToast('Marked safe. Continuing to monitor.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleBackToShield = () => {
    setCurrentScreen('scanning');
  };

  return (

    

    <div
  style={{
    backgroundColor: '#0F1B2D',
    fontFamily: 'sans-serif',
    width: '100%',
    minHeight: '900px',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '20px',
    color: '#fff'
  }}
>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"/>
      
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column',
        boxSizing: 'border-box'

      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <i className="ti ti-shield-check" style={{ fontSize: '24px', color: '#2D8A4E' }}></i>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Message Shield</h1>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>Watching Amma's phone for suspicious messages</p>
      </div>

      <div style={{ flex: 1, position: 'relative', paddingBottom: '70px' }}>
        {/* Screen 1: Scanning */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, padding: '32px 20px',
          opacity: currentScreen === 'scanning' ? 1 : 0,
          transform: currentScreen === 'scanning' ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 0.4s ease-in-out',
          pointerEvents: currentScreen === 'scanning' ? 'auto' : 'none'
        }}>
          {/* Scanning Animation */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
                border: '2px solid #3b82f6', animation: 'scanPulse 2s infinite'
              }}></div>
              <div style={{
                position: 'absolute', width: '140%', height: '140%', borderRadius: '50%',
                border: '2px solid rgba(59, 130, 246, 0.3)', animation: 'scanPulse 2s infinite 1s'
              }}></div>
              <div style={{ width: '56px', height: '56px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                <i className="ti ti-device-mobile" style={{ fontSize: '28px', color: '#3b82f6' }}></i>
              </div>
            </div>
            <div style={{ marginTop: '24px', backgroundColor: 'rgba(45,138,78,0.1)', color: '#2D8A4E', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
              <i className="ti ti-radar" style={{ marginRight: '6px' }}></i>
              Scanning 3 linked devices
            </div>
          </div>

          <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Recent Safe Messages</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { sender: 'SBI Bank', time: '2 mins ago' },
              { sender: 'Jio Recharge', time: '15 mins ago' },
              { sender: 'Aadhaar Update', time: '1 hr ago' }
            ].map((msg, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#334155' }}>{msg.sender}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{msg.time}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2D8A4E', fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(45,138,78,0.1)', padding: '4px 8px', borderRadius: '8px' }}>
                  <i className="ti ti-shield-check"></i> Safe
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Screen 2 & 3: Alert Flow */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          opacity: currentScreen === 'alert' ? 1 : 0,
          transform: currentScreen === 'alert' ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: currentScreen === 'alert' ? 'auto' : 'none',
          paddingBottom: '20px'
        }}>
          {/* Red Alert Banner */}
          <div style={{ backgroundColor: 'rgba(230,57,70,0.1)', borderBottom: '1px solid rgba(230,57,70,0.2)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ animation: 'alertPulse 1s infinite' }}>
              <i className="ti ti-alert-triangle-filled" style={{ fontSize: '28px', color: '#E63946' }}></i>
            </div>
            <div>
              <div style={{ color: '#E63946', fontWeight: 'bold', fontSize: '14px', lineHeight: '1.2' }}>Suspicious message detected on Amma's phone</div>
              <div style={{ color: '#E63946', fontSize: '12px', marginTop: '2px', opacity: 0.8 }}>Just now</div>
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            {/* Message Preview Card */}
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', borderLeft: '4px solid #E63946', padding: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ backgroundColor: 'rgba(230,57,70,0.1)', color: '#E63946', padding: '4px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                  HIGH RISK
                </span>
                <i className="ti ti-messages" style={{ color: '#94a3b8' }}></i>
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1e293b', marginBottom: '8px' }}>Sender: KBC Lottery Helpline</div>
              <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '14px', color: '#475569', fontStyle: 'italic', marginBottom: '16px', lineHeight: '1.5' }}>
                "Congratulations! You have WON ₹25,00,000 in KBC Lucky Draw. Send your Aadhaar + bank details to claim. Offer expires in 2 hours."
              </div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#334155', fontWeight: '600' }}>Why it's suspicious:</h4>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                <li style={{ marginBottom: '4px' }}>Asks for Aadhaar and bank details — no real lottery does this</li>
                <li>Creates urgency with a fake deadline to pressure you</li>
              </ul>
            </div>

            {/* Family Alert Card */}
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', borderLeft: '4px solid #F59E0B', padding: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <i className="ti ti-users" style={{ color: '#F59E0B', fontSize: '20px' }}></i>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b', fontWeight: 'bold' }}>Alert a family member?</h3>
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>We'll notify them immediately so they can help</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { id: 'rk', initials: 'RK', name: 'Rajan', rel: 'Son' },
                  { id: 'pm', initials: 'PM', name: 'Priya', rel: 'Daughter' }
                ].map(contact => {
                  const isNotified = notifiedContacts.has(contact.id);
                  return (
                    <div key={contact.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#475569', fontSize: '14px' }}>
                          {contact.initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1e293b' }}>{contact.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{contact.rel}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleNotify(contact.id)}
                        style={{ 
                          backgroundColor: isNotified ? 'rgba(45,138,78,0.1)' : '#fff', 
                          color: isNotified ? '#2D8A4E' : '#3b82f6', 
                          border: `1px solid ${isNotified ? '#2D8A4E' : '#bfdbfe'}`, 
                          padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s'
                        }}
                      >
                        {isNotified ? <><i className="ti ti-check"></i> Alerted</> : 'Notify'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={handleReport}
                style={{ backgroundColor: '#E63946', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(230,57,70,0.3)' }}
              >
                <i className="ti ti-flag" style={{ fontSize: '20px' }}></i> Report as Scam
              </button>
              <button 
                onClick={handleSafe}
                style={{ backgroundColor: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <i className="ti ti-check" style={{ fontSize: '20px' }}></i> Mark as Safe
              </button>
            </div>
          </div>
        </div>

        {/* Screen 4: Success State */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, padding: '40px 20px',
          opacity: currentScreen === 'success' ? 1 : 0,
          transform: currentScreen === 'success' ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: currentScreen === 'success' ? 'auto' : 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}>
          <div style={{ 
            width: '80px', height: '80px', backgroundColor: '#2D8A4E', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '24px',
            animation: currentScreen === 'success' ? 'scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none',
            boxShadow: '0 10px 15px -3px rgba(45,138,78,0.3)'
          }}>
            <i className="ti ti-check" style={{ fontSize: '48px', strokeWidth: 3 }}></i>
          </div>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '24px', color: '#1e293b', fontWeight: 'bold' }}>Scam Reported</h2>
          <p
  style={{
    margin: '0 0 40px 0',
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.6'
  }}
>
  Thank you for keeping your family safe.
  We've flagged this number and alerted Rajan.
</p>

<button
  onClick={handleBackToShield}
  style={{
    backgroundColor: '#1e293b',
    color: '#fff',
    border: 'none',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '300px'
  }}
>
  Back to Shield
</button>
</div>
      </div>

      {/* Bottom Tab Bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#fff', borderTop: '1px solid #e2e8f0', padding: '12px 20px',
        display: 'flex', justifyContent: 'space-around', zIndex: 10
      }}>
        {[
          { icon: 'ti-home', label: 'Home' },
          { icon: 'ti-shield', label: 'Shield', active: true },
          { icon: 'ti-user', label: 'Profile' }
        ].map((tab, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: tab.active ? '#3b82f6' : '#94a3b8', gap: '4px' }}>
            <i className={`ti ${tab.icon}`} style={{ fontSize: '24px' }}></i>
            <span style={{ fontSize: '10px', fontWeight: tab.active ? 'bold' : 'normal' }}>{tab.label}</span>
          </div>
        ))}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#2D8A4E', color: '#fff', padding: '12px 24px', borderRadius: '24px',
          fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap', zIndex: 20,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', animation: 'toastUp 0.3s ease-out'
        }}>
          {toast}
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes scanPulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes alertPulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes scaleUp {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes toastUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FraudAlertScreen;
