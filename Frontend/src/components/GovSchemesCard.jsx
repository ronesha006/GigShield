import React, { useState } from 'react';

const schemes = [
  {
    id: 'eshram',
    name: 'e-Shram',
    icon: '🪪',
    tag: 'Worker Registration',
    color: '#1D6FA4',
    benefit: 'Get a free worker ID card. Unlock accident insurance of ₹2 lakh and priority access to welfare schemes.',
    cta: 'Register on e-Shram →',
    steps: [
      'Keep your Aadhaar card and linked mobile number ready.',
      'Visit the official e-Shram portal or nearby CSC center.',
      'Fill in your details and receive your UAN card instantly.'
    ]
  },
  {
    id: 'pmkisan',
    name: 'PM-KISAN',
    icon: '🌾',
    tag: 'Farmer Support',
    color: '#2D8A4E',
    benefit: 'Receive ₹6,000 per year directly in your bank account if you own farmland.',
    cta: 'Check Eligibility →',
    steps: [
      'Verify your land records and Aadhaar details.',
      'Register at the PM-Kisan portal or your local Patwari.',
      'Once approved, the amount will be credited to your bank account directly.'
    ]
  },
  {
    id: 'pmsby',
    name: 'PMSBY',
    icon: '🏥',
    tag: 'Accident Insurance',
    color: '#E07B28',
    benefit: 'Get ₹2 lakh accident insurance for just ₹20/year. Available through any bank account.',
    cta: 'Enroll via Bank →',
    steps: [
      'Ensure you have an active bank account.',
      'Visit your bank branch or use net banking to enroll for PMSBY.',
      'Authorize an auto-debit of ₹20 per year from your account.'
    ]
  }
];

const GovSchemesCard = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

  const toggleExpand = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openModal = (scheme) => setActiveModal(scheme);
  const closeModal = () => setActiveModal(null);

  return (
    <div style={{
      backgroundColor: '#FFF8ED',
      fontFamily: 'sans-serif',
      width: '100%',
      padding: '24px',
      boxSizing: 'border-box',
      position: 'relative',
      borderRadius: '20px'
    }}>
      {/* Bad Day Mode Banner */}
      <div style={{
        backgroundColor: '#FFFBEB',
        borderLeft: '4px solid #F59E0B',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}>
        <span style={{ fontSize: '20px' }} aria-hidden="true">☁️</span>
        <p style={{ margin: 0, fontSize: '14px', color: '#78350F', fontWeight: '500', lineHeight: '1.4' }}>
          You've had 3 tough days. Here's real help — no strings attached.
        </p>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <span style={{ fontSize: '24px' }} aria-hidden="true">🌅</span>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#451A03' }}>Support Available For You</h2>
      </div>

      {/* Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {schemes.map(scheme => {
          const isExpanded = expandedCards[scheme.id];
          return (
            <div key={scheme.id} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              borderLeft: `4px solid ${scheme.color}`,
              padding: '16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                {/* Logo Area */}
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  backgroundColor: `${scheme.color}15`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0
                }}>
                  {scheme.icon}
                </div>

                <div style={{ flex: 1 }}>
                  {/* Category & Name */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>{scheme.name}</h3>
                      <span style={{
                        display: 'inline-block', backgroundColor: '#F3F4F6', color: '#4B5563',
                        padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600'
                      }}>
                        {scheme.tag}
                      </span>
                    </div>
                  </div>

                  {/* Benefit */}
                  <div style={{ marginTop: '12px' }}>
                    <p style={{
                      margin: 0, fontSize: '14px', color: '#4B5563', lineHeight: '1.5',
                      display: '-webkit-box', WebkitLineClamp: isExpanded ? 'unset' : 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                      {scheme.benefit}
                    </p>
                    <button
                      onClick={() => toggleExpand(scheme.id)}
                      aria-label={isExpanded ? "Show less details" : "Show more details"}
                      style={{
                        background: 'none', border: 'none', color: '#6B7280', padding: 0,
                        fontSize: '12px', marginTop: '4px', cursor: 'pointer', textDecoration: 'underline'
                      }}
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                  </div>

                  {/* CTA */}
                  <div style={{ marginTop: '16px' }}>
                    <button
                      onClick={() => openModal(scheme)}
                      aria-label={`Apply for ${scheme.name}`}
                      style={{
                        background: 'none', border: 'none', color: scheme.color, padding: 0,
                        fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center',
                        textDecoration: 'underline'
                      }}
                    >
                      {scheme.cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <p style={{ marginTop: '24px', fontSize: '12px', color: '#9CA3AF', textAlign: 'center', lineHeight: '1.5' }}>
        These are free government programs. GigShield never charges you to access them.
      </p>

      {/* Bottom Sheet Modal */}
      {activeModal && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
          }}
        >
          {/* Click away area to close */}
          <div style={{ flex: 1 }} onClick={closeModal} aria-label="Close modal"></div>
          
          <div style={{
            backgroundColor: '#FFFFFF', borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
            padding: '24px 20px', paddingBottom: '40px',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>{activeModal.icon}</span>
                <h2 id="modal-title" style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1F2937' }}>{activeModal.name}</h2>
              </div>
              <button 
                onClick={closeModal} 
                aria-label="Close"
                style={{ 
                  background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', 
                  color: '#4B5563', fontSize: '18px' 
                }}
              >
                ✕
              </button>
            </div>

            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#374151', fontWeight: 'bold' }}>How to Apply</h3>
            <ol style={{ paddingLeft: '20px', margin: '0 0 32px 0', color: '#4B5563', fontSize: '15px', lineHeight: '1.6' }}>
              {activeModal.steps.map((step, idx) => (
                <li key={idx} style={{ marginBottom: '12px' }}>{step}</li>
              ))}
            </ol>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a 
                href="#"
                aria-label="Visit Official Site"
                style={{
                  display: 'block', backgroundColor: activeModal.color, color: '#FFFFFF',
                  textAlign: 'center', padding: '16px', borderRadius: '8px',
                  textDecoration: 'none', fontWeight: 'bold', fontSize: '16px'
                }}
              >
                Visit Official Site
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Inline styles for modal animation */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default GovSchemesCard;
