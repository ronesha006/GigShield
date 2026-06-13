import React, { useState, useEffect } from 'react';

// Centralized translations for the app
const t = {
  EN: {
    home: 'Home', shield: 'Shield', schemes: 'Schemes', profile: 'Profile',
    goodMorning: 'Good morning, Meena 👋', todaysEarnings: "Today's Earnings",
    safeToSpend: 'Safe to spend today', buffer: 'Emergency Buffer', filled: 'filled',
    badDayGood: '3 good days in a row! Keep it up.', activity: 'Recent Activity',
    grocery: 'Grocery', fuel: 'Auto fuel', saved: 'Saved',
    profileTitle: 'Profile', autoDriver: 'Auto Driver, Chennai',
    langPref: 'Language Preference', linkedFamily: 'Linked Family Members',
    son: 'Son', daughter: 'Daughter', addFamily: 'Add Family Member',
    shieldTitle: 'Message Shield', shieldSub: "Watching Amma's phone for suspicious messages",
    schemesTitle: 'Support Available For You', schemesSub: "3 tough days detected. Here's help available for you.",
    cancel: 'Cancel', save: 'Save', addMemberTitle: 'Add Family Member',
    nameLabel: 'Name', relationLabel: 'Relation', phoneLabel: 'Phone Number'
  },
  HI: {
    home: 'होम', shield: 'सुरक्षा', schemes: 'योजनाएं', profile: 'प्रोफ़ाइल',
    goodMorning: 'सुप्रभात, मीना 👋', todaysEarnings: "आज की कमाई",
    safeToSpend: 'खर्च के लिए सुरक्षित', buffer: 'आपातकालीन बफर', filled: 'भरा हुआ',
    badDayGood: 'लगातार 3 अच्छे दिन! ऐसे ही चलते रहें।', activity: 'हाल की गतिविधि',
    grocery: 'किराना', fuel: 'ऑटो ईंधन', saved: 'बचत',
    profileTitle: 'प्रोफ़ाइल', autoDriver: 'ऑटो चालक, चेन्नई',
    langPref: 'भाषा वरीयता', linkedFamily: 'जुड़े हुए परिवार के सदस्य',
    son: 'बेटा', daughter: 'बेटी', addFamily: 'परिवार का सदस्य जोड़ें',
    shieldTitle: 'मैसेज शील्ड', shieldSub: "अम्मा के फोन पर संदिग्ध संदेशों की निगरानी",
    schemesTitle: 'आपके लिए सहायता उपलब्ध है', schemesSub: "3 कठिन दिन। आपके लिए यहाँ सहायता उपलब्ध है।",
    cancel: 'रद्द करें', save: 'सहेजें', addMemberTitle: 'नया सदस्य जोड़ें',
    nameLabel: 'नाम', relationLabel: 'रिश्ता', phoneLabel: 'फ़ोन नंबर'
  },
  TA: {
    home: 'முகப்பு', shield: 'பாதுகாப்பு', schemes: 'திட்டங்கள்', profile: 'சுயவிவரம்',
    goodMorning: 'காலை வணக்கம், மீனா 👋', todaysEarnings: "இன்றைய வருமானம்",
    safeToSpend: 'செலவிட பாதுகாப்பானது', buffer: 'அவசரகால இருப்பு', filled: 'நிரம்பியுள்ளது',
    badDayGood: 'தொடர்ந்து 3 நல்ல நாட்கள்! தொடரவும்.', activity: 'சமீபத்திய செயல்பாடு',
    grocery: 'மளிகை', fuel: 'ஆட்டோ எரிபொருள்', saved: 'சேமிப்பு',
    profileTitle: 'சுயவிவரம்', autoDriver: 'ஆட்டோ ஓட்டுநர், சென்னை',
    langPref: 'மொழி விருப்பம்', linkedFamily: 'இணைக்கப்பட்ட குடும்ப உறுப்பினர்கள்',
    son: 'மகன்', daughter: 'மகள்', addFamily: 'உறுப்பினரைச் சேர்க்க',
    shieldTitle: 'மெசேஜ் ஷீல்ட்', shieldSub: "அம்மாவின் போனில் மெசேஜ்கள் கண்காணிக்கப்படுகிறது",
    schemesTitle: 'உங்களுக்கான ஆதரவு', schemesSub: "3 கடினமான நாட்கள். உங்களுக்கான உதவி இங்கே.",
    cancel: 'ரத்துசெய்', save: 'சேமி', addMemberTitle: 'உறுப்பினரைச் சேர்க்க',
    nameLabel: 'பெயர்', relationLabel: 'உறவு', phoneLabel: 'தொலைபேசி எண்'
  }
};

// ==========================================
// 1. HOME SCREEN
// ==========================================
const HomeScreen = ({ lang }) => {
  const text = t[lang];
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{text.goodMorning}</h1>
        <button style={{ backgroundColor: '#185FA5', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(24,95,165,0.2)' }}>
          <i className="ti ti-plus" style={{ fontSize: '20px' }}></i> Log Earnings
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px', fontWeight: '500' }}>{text.todaysEarnings}</div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2D8A4E', marginBottom: '12px' }}>₹850</div>
            <div style={{ fontSize: '16px', color: '#475569', marginBottom: '24px', fontWeight: '500' }}>{text.safeToSpend}: ₹320</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b', marginBottom: '12px', fontWeight: '500' }}>
              <span>{text.buffer}</span>
              <span>68% {text.filled}</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: '68%', backgroundColor: '#185FA5', height: '100%', borderRadius: '6px' }}></div>
            </div>
          </div>

          <div style={{ backgroundColor: '#dcfce7', borderLeft: '6px solid #22c55e', padding: '20px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <i className="ti ti-trending-up" style={{ color: '#16a34a', fontSize: '28px' }}></i>
            <div style={{ color: '#166534', fontSize: '16px', fontWeight: '600', lineHeight: '1.5' }}>{text.badDayGood}</div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{text.activity}</h2>
            <button style={{ background: 'none', border: 'none', color: '#185FA5', fontWeight: 'bold', cursor: 'pointer' }}>View All</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: text.grocery, amount: '₹120', time: '10:00 AM', icon: 'ti-shopping-cart' },
              { name: text.fuel, amount: '₹200', time: '12:00 PM', icon: 'ti-gas-station' },
              { name: text.saved, amount: '₹100', time: '03:00 PM', icon: 'ti-piggy-bank', isPositive: true },
              { name: 'Tea & Snacks', amount: '₹40', time: '05:30 PM', icon: 'ti-coffee' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', transition: 'all 0.2s', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: item.isPositive ? '#dcfce7' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.isPositive ? '#16a34a' : '#64748b' }}>
                    <i className={`ti ${item.icon}`} style={{ fontSize: '24px' }}></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>{item.name}</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>{item.time}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: item.isPositive ? '#2D8A4E' : '#475569' }}>
                  {item.isPositive ? '+' : '-'}{item.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. SHIELD SCREEN (Fraud Alert Flow)
// ==========================================
const ShieldScreen = ({ lang }) => {
  const text = t[lang];
  const [currentScreen, setCurrentScreen] = useState('scanning');
  const [notifiedContacts, setNotifiedContacts] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [familyMembers, setFamilyMembers] = useState(() => {
    const saved = localStorage.getItem('gigshield_family');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Rajan', relation: text.son, phone: '+91 98XXX XXXXX', verified: true },
      { id: '2', name: 'Priya', relation: text.daughter, phone: '+91 76XXX XXXXX', verified: true }
    ];
  });

  useEffect(() => {
    if (currentScreen === 'scanning') {
      const timer = setTimeout(() => {
        setCurrentScreen('alert');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleNotify = (id) => setNotifiedContacts(prev => new Set(prev).add(id));
  const handleReport = () => setCurrentScreen('success');
  const handleSafe = () => {
    setCurrentScreen('scanning');
    setToast('Marked safe. Continuing to monitor.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', height: 'calc(100vh - 120px)', position: 'relative' }}>
      
      {/* Scanning State */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, opacity: currentScreen === 'scanning' ? 1 : 0, pointerEvents: currentScreen === 'scanning' ? 'auto' : 'none', transition: 'opacity 0.4s', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '48px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '3px solid #3b82f6', animation: 'scanPulse 2s infinite' }}></div>
            <div style={{ position: 'absolute', width: '140%', height: '140%', borderRadius: '50%', border: '3px solid rgba(59, 130, 246, 0.3)', animation: 'scanPulse 2s infinite 1s' }}></div>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
              <i className="ti ti-device-mobile" style={{ fontSize: '40px', color: '#3b82f6' }}></i>
            </div>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>{text.shieldTitle}</h2>
          <p style={{ fontSize: '16px', color: '#64748b', margin: '0 0 24px 0' }}>{text.shieldSub}</p>
          <div style={{ backgroundColor: 'rgba(45,138,78,0.1)', color: '#2D8A4E', padding: '8px 20px', borderRadius: '24px', fontSize: '15px', fontWeight: 'bold' }}>
            <i className="ti ti-radar" style={{ marginRight: '8px' }}></i> Scanning 3 linked devices
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', color: '#1e293b', fontWeight: 'bold' }}>Recent Safe Messages</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {[ { sender: 'SBI Bank', time: '2 mins ago' }, { sender: 'Jio Recharge', time: '15 mins ago' }, { sender: 'Aadhaar Update', time: '1 hr ago' } ].map((msg, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#334155' }}>{msg.sender}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{msg.time}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2D8A4E', fontSize: '14px', fontWeight: 'bold', backgroundColor: 'rgba(45,138,78,0.1)', padding: '6px 12px', borderRadius: '12px' }}>
                  <i className="ti ti-shield-check"></i> Safe
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert State */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, opacity: currentScreen === 'alert' ? 1 : 0, pointerEvents: currentScreen === 'alert' ? 'auto' : 'none', transform: currentScreen === 'alert' ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.2)' }}>
          <div style={{ backgroundColor: '#E63946', color: '#fff', padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ animation: 'alertPulse 1s infinite' }}><i className="ti ti-alert-triangle-filled" style={{ fontSize: '32px' }}></i></div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Suspicious message detected on Amma's phone</div>
              <div style={{ fontSize: '14px', marginTop: '4px', opacity: 0.9 }}>Intercepted just now</div>
            </div>
          </div>
          
          <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ backgroundColor: 'rgba(230,57,70,0.1)', color: '#E63946', padding: '6px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.5px' }}>HIGH RISK</span>
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1e293b', marginBottom: '12px' }}>Sender: KBC Lottery Helpline</div>
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', fontSize: '16px', color: '#475569', fontStyle: 'italic', marginBottom: '24px', lineHeight: '1.6', borderLeft: '4px solid #cbd5e1' }}>
                "Congratulations! You have WON ₹25,00,000 in KBC Lucky Draw. Send your Aadhaar + bank details to claim. Offer expires in 2 hours."
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={handleReport} style={{ flex: 1, backgroundColor: '#E63946', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}><i className="ti ti-flag" style={{ fontSize: '20px' }}></i> Report Scam</button>
                <button onClick={handleSafe} style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}><i className="ti ti-check" style={{ fontSize: '20px' }}></i> Mark Safe</button>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <i className="ti ti-users" style={{ color: '#F59E0B', fontSize: '24px' }}></i>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: 'bold' }}>Alert a family member?</h3>
              </div>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748b' }}>Notify them immediately so they can assist.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {familyMembers.map(contact => {
                  const isNotified = notifiedContacts.has(contact.id);
                  const initials = contact.name.substring(0, 2).toUpperCase();
                  return (
                    <div key={contact.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: '16px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#475569', fontSize: '16px' }}>{initials}</div>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>{contact.name}</div>
                          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{contact.relation}</div>
                        </div>
                      </div>
                      <button onClick={() => handleNotify(contact.id)} style={{ backgroundColor: isNotified ? 'rgba(45,138,78,0.1)' : '#fff', color: isNotified ? '#2D8A4E' : '#3b82f6', border: `2px solid ${isNotified ? '#2D8A4E' : '#bfdbfe'}`, padding: '8px 24px', borderRadius: '24px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                        {isNotified ? <><i className="ti ti-check" style={{ fontSize: '18px' }}></i> Alerted</> : 'Notify'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success State */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, opacity: currentScreen === 'success' ? 1 : 0, pointerEvents: currentScreen === 'success' ? 'auto' : 'none', transform: currentScreen === 'success' ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s', display: 'flex', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '64px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '600px', width: '100%' }}>
          <div style={{ width: '100px', height: '100px', backgroundColor: '#2D8A4E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', margin: '0 auto 32px auto', boxShadow: '0 10px 25px rgba(45,138,78,0.3)' }}><i className="ti ti-check" style={{ fontSize: '64px', strokeWidth: 3 }}></i></div>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '32px', color: '#1e293b', fontWeight: 'bold' }}>Scam Successfully Reported</h2>
          <p style={{ margin: '0 0 48px 0', fontSize: '18px', color: '#64748b', lineHeight: '1.6' }}>Thank you for keeping your family safe. We've flagged this number and alerted the selected family members.</p>
          <button onClick={() => setCurrentScreen('scanning')} style={{ backgroundColor: '#1e293b', color: '#fff', border: 'none', padding: '20px 40px', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>Return to Shield</button>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2D8A4E', color: '#fff', padding: '16px 32px', borderRadius: '32px', fontSize: '16px', fontWeight: 'bold', whiteSpace: 'nowrap', zIndex: 100, boxShadow: '0 10px 25px rgba(45,138,78,0.3)' }}>
          {toast}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. SCHEMES SCREEN
// ==========================================
const SchemesScreen = ({ lang }) => {
  const text = t[lang];
  const [activeModal, setActiveModal] = useState(null);

  const schemes = [
    { id: 'eshram', name: 'e-Shram', icon: '🪪', tag: 'Worker Registration', color: '#1D6FA4', url: 'https://eshram.gov.in/', benefit: 'Get a free worker ID card. Unlock accident insurance of ₹2 lakh and priority access to welfare schemes.', cta: 'Register on e-Shram →', steps: ['Keep your Aadhaar card and linked mobile number ready.', 'Visit the official e-Shram portal or nearby CSC center.', 'Fill in your details and receive your UAN card instantly.'] },
    { id: 'pmkisan', name: 'PM-KISAN', icon: '🌾', tag: 'Farmer Support', color: '#2D8A4E', url: 'https://pmkisan.gov.in/', benefit: 'Receive ₹6,000 per year directly in your bank account if you own farmland.', cta: 'Check Eligibility →', steps: ['Verify your land records and Aadhaar details.', 'Register at the PM-Kisan portal or your local Patwari.', 'Once approved, the amount will be credited to your bank account directly.'] },
    { id: 'pmsby', name: 'PMSBY', icon: '🏥', tag: 'Accident Insurance', color: '#E07B28', url: 'https://jansuraksha.gov.in/', benefit: 'Get ₹2 lakh accident insurance for just ₹20/year. Available through any bank account.', cta: 'Enroll via Bank →', steps: ['Ensure you have an active bank account.', 'Visit your bank branch or use net banking to enroll for PMSBY.', 'Authorize an auto-debit of ₹20 per year from your account.'] }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ padding: '24px', backgroundColor: '#FFFBEB', borderRadius: '16px', borderLeft: '6px solid #F59E0B', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <span style={{ fontSize: '28px' }}>⚠️</span>
        <span style={{ color: '#78350F', fontWeight: '600', fontSize: '18px' }}>{text.schemesSub}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <span style={{ fontSize: '32px' }}>🌅</span>
        <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#451A03' }}>{text.schemesTitle}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        {schemes.map(scheme => (
          <div key={scheme.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', borderTop: `6px solid ${scheme.color}`, padding: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'pointer' }} onClick={() => setActiveModal(scheme)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: `${scheme.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>{scheme.icon}</div>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 'bold', color: '#1F2937' }}>{scheme.name}</h3>
                <span style={{ display: 'inline-block', backgroundColor: '#F3F4F6', color: '#4B5563', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px' }}>{scheme.tag}</span>
              </div>
            </div>
            <p style={{ margin: '0 0 24px 0', fontSize: '16px', color: '#4B5563', lineHeight: '1.6', flex: 1 }}>{scheme.benefit}</p>
            <button style={{ background: 'none', border: 'none', color: scheme.color, padding: 0, fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {scheme.cta}
            </button>
          </div>
        ))}
      </div>

      {activeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '600px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ backgroundColor: `${activeModal.color}10`, padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${activeModal.color}30` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '40px' }}>{activeModal.icon}</span>
                <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1F2937' }}>{activeModal.name}</h2>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4B5563', fontSize: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>✕</button>
            </div>
            <div style={{ padding: '32px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#374151', fontWeight: 'bold' }}>How to Apply</h3>
              <ol style={{ paddingLeft: '24px', margin: '0 0 40px 0', color: '#4B5563', fontSize: '16px', lineHeight: '1.8' }}>
                {activeModal.steps.map((step, idx) => <li key={idx} style={{ marginBottom: '16px' }}>{step}</li>)}
              </ol>
              <a href={activeModal.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', backgroundColor: activeModal.color, color: '#FFFFFF', textAlign: 'center', padding: '20px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px', transition: 'opacity 0.2s' }}>Visit Official Site</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. PROFILE SCREEN
// ==========================================
const ProfileScreen = ({ lang, setLang }) => {
  const text = t[lang];
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', relation: '', phone: '' });
  
  const [familyMembers, setFamilyMembers] = useState(() => {
    const saved = localStorage.getItem('gigshield_family');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Rajan', relation: text.son, phone: '+91 98XXX XXXXX', verified: true },
      { id: '2', name: 'Priya', relation: text.daughter, phone: '+91 76XXX XXXXX', verified: true }
    ];
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.relation || !formData.phone) return;
    const newMember = { id: Date.now().toString(), name: formData.name, relation: formData.relation, phone: formData.phone, verified: true };
    const updated = [...familyMembers, newMember];
    setFamilyMembers(updated);
    localStorage.setItem('gigshield_family', JSON.stringify(updated));
    setShowAddModal(false);
    setFormData({ name: '', relation: '', phone: '' });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 32px 0', fontSize: '28px', fontWeight: 'bold', color: '#1e293b' }}>{text.profileTitle}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', backgroundColor: '#fff', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#185FA5', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(24,95,165,0.2)' }}>MK</div>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Meena Krishnan</h2>
              <div style={{ color: '#64748b', fontSize: '16px' }}>{text.autoDriver}</div>
            </div>
          </div>

          {/* Language Pref */}
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>{text.langPref}</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['EN', 'HI', 'TA'].map(l => (
                <button 
                  key={l} onClick={() => setLang(l)}
                  style={{ flex: 1, padding: '16px', borderRadius: '12px', border: `2px solid ${lang === l ? '#185FA5' : '#e2e8f0'}`, backgroundColor: lang === l ? '#f0f9ff' : '#fff', color: lang === l ? '#185FA5' : '#64748b', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {l === 'EN' ? 'English' : l === 'HI' ? 'Hindi' : 'Tamil'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Linked Family */}
        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{text.linkedFamily}</div>
            <button onClick={() => setShowAddModal(true)} style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', backgroundColor: '#185FA5', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
              <i className="ti ti-plus" style={{ fontSize: '18px' }}></i> {text.addFamily}
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {familyMembers.map((member, index) => (
              <div key={member.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f1f5f9', padding: '20px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#475569', fontSize: '18px' }}>
                    {member.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '16px' }}>{member.name} ({member.relation})</div>
                    <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>{member.phone}</div>
                  </div>
                </div>
                <div style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-check" style={{ fontSize: '16px' }}></i> Verified
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 32px 0', fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>{text.addMemberTitle}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>{text.nameLabel}</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none' }} placeholder="E.g. Priya" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>{text.relationLabel}</label>
                <input type="text" value={formData.relation} onChange={e => setFormData({...formData, relation: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none' }} placeholder="E.g. Daughter" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>{text.phoneLabel}</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none' }} placeholder="+91 9XXXX XXXXX" required />
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#fff', color: '#64748b', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>{text.cancel}</button>
                <button type="submit" style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#185FA5', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>{text.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. MAIN APP SHELL (DESKTOP)
// ==========================================
export default function GigShieldApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [fraudAlertPending, setFraudAlertPending] = useState(true);
  const [lang, setLang] = useState('EN');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'shield') setFraudAlertPending(false);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen lang={lang} />;
      case 'shield': return <ShieldScreen lang={lang} />;
      case 'schemes': return <SchemesScreen lang={lang} />;
      case 'profile': return <ProfileScreen lang={lang} setLang={setLang} />;
      default: return <HomeScreen lang={lang} />;
    }
  };

  const tabs = [
    { id: 'home', icon: 'ti-home', label: t[lang].home },
    { id: 'shield', icon: 'ti-shield', label: t[lang].shield },
    { id: 'schemes', icon: 'ti-file-text', label: t[lang].schemes },
    { id: 'profile', icon: 'ti-user', label: t[lang].profile }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes pulseDot {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(220, 38, 38, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }
        @keyframes scanPulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes alertPulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
      
      {/* Top Navigation Bar */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => handleTabChange('home')}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#185FA5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <i className="ti ti-shield-check" style={{ fontSize: '24px' }}></i>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', letterSpacing: '-0.5px' }}>GigShield</span>
          </div>

          {/* Center Links */}
          <nav style={{ display: 'flex', gap: '8px' }}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  style={{ 
                    background: isActive ? '#f1f5f9' : 'transparent',
                    border: 'none', padding: '10px 20px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                    color: isActive ? '#185FA5' : '#64748b', fontWeight: isActive ? '600' : '500',
                    fontSize: '15px', transition: 'all 0.2s', position: 'relative'
                  }}
                >
                  <i className={`ti ${tab.icon}`} style={{ fontSize: '20px' }}></i>
                  {tab.label}
                  {tab.id === 'shield' && fraudAlertPending && (
                    <div style={{
                      position: 'absolute', top: '8px', right: '12px', width: '10px', height: '10px',
                      backgroundColor: '#dc2626', borderRadius: '50%', border: '2px solid #fff',
                      animation: 'pulseDot 2s infinite'
                    }}></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
              {['EN', 'HI', 'TA'].map(l => (
                <button 
                  key={l} onClick={() => setLang(l)}
                  style={{ background: lang === l ? '#fff' : 'transparent', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', color: lang === l ? '#185FA5' : '#64748b', cursor: 'pointer', boxShadow: lang === l ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >
                  {l}
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
        {renderScreen()}
      </main>
    </div>
  );
}
