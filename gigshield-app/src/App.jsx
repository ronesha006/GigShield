import React from 'react';
import FraudAlertScreen from './components/FraudAlertScreen';
import GovSchemesCard from './components/GovSchemesCard';

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '40px', 
      padding: '40px', 
      justifyContent: 'center', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh', 
      flexWrap: 'wrap' 
    }}>
      <div style={{ 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', 
        borderRadius: '24px', 
        overflow: 'hidden', 
        height: 'fit-content' 
      }}>
        <FraudAlertScreen />
      </div>
      <div style={{ 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', 
        borderRadius: '24px', 
        overflow: 'hidden', 
        height: 'fit-content' 
      }}>
        <GovSchemesCard />
      </div>
    </div>
  );
}

export default App;
