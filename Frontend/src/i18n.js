import React, { createContext, useContext, useState } from 'react'

const translations = {
  en: {
  loading: 'Loading...',
    dashboard: 'Dashboard',
    income: 'Income',
    expense: 'Expense',
    remaining: 'Remaining',
    spend_limit: 'Spend Limit',
    ai_insight: 'AI Insight',
    add_log: 'Add Log',
    savings_goal: 'Savings Goal',
    income_engine: 'Income Engine',
    seven_day_avg: "7-day average income",
    daily_spend_limit: 'Daily spend limit (dynamic)',
    bad_day_mode_active: 'Bad Day Mode: Active — savings paused.',
    emergency_buffer: 'Emergency Buffer',
    recommended_buffer: 'Recommended buffer before savings',
    multiplier: 'Multiplier',
    apply: 'Apply',
    income_last14: 'Income last 14 days',
    hover_bars: 'Hover bars for details',
    smart_allocator: 'Smart Savings Allocator',
    todays_net: "Today's Net Savings",
    percentage_mode: 'Percentage Mode',
    custom_amount: 'Custom Amount',
    allocation_percentage: 'Allocation Percentage',
    save_log: 'Save Log',
    track_today: "Track today's income and expenses.",
    earned_today: 'Earned Today (₹)',
    total_expense_today: 'Total Expense Today: ₹',
    no_savings: 'No Savings Available',
    bad_day_message: 'Bad Day Mode is active — savings allocations are temporarily paused.'
  },
  hi: {
  loading: 'लोड हो रहा है...',
    dashboard: 'डैशबोर्ड',
    income: 'आय',
    expense: 'खर्च',
    remaining: 'बचा हुआ',
    spend_limit: 'खर्च सीमा',
    ai_insight: 'एआई सुझाव',
    add_log: 'लॉग जोड़ें',
    savings_goal: 'बचत लक्ष्य',
    income_engine: 'आय इंजन',
    seven_day_avg: '7-दिन औसत आय',
    daily_spend_limit: 'दैनिक खर्च सीमा (डायनामिक)',
    bad_day_mode_active: 'बुरा दिन मोड सक्रिय — बचत रोकी गई है।',
    emergency_buffer: 'आपातकालीन बफ़र',
    recommended_buffer: 'बचत से पहले अनुशंसित बफ़र',
    multiplier: 'गुणक',
    apply: 'लागू करें',
    income_last14: 'पिछले 14 दिनों की आय',
    hover_bars: 'विवरण के लिए बार पर होवर करें',
    smart_allocator: 'स्मार्ट बचत आवंटक',
    todays_net: 'आज की शुद्ध बचत',
    percentage_mode: 'प्रतिशत मोड',
    custom_amount: 'कस्टम राशि',
    allocation_percentage: 'आवंटन प्रतिशत',
    save_log: 'लॉग सहेजें',
    track_today: 'आज की आय और खर्च ट्रैक करें।',
    earned_today: 'आज कमाया (₹)',
    total_expense_today: 'आज का कुल खर्च: ₹',
    no_savings: 'कोई बचत उपलब्ध नहीं',
    bad_day_message: 'बुरा दिन मोड सक्रिय है — बचत अस्थायी रूप से रोकी गई है।'
  },
  ta: {
  loading: 'ஏற்காக ஏற்றுகிறது...',
    dashboard: 'டாஷ்போர்டு',
    income: 'வருமானம்',
    expense: 'செலவு',
    remaining: 'மீதமிருக்கும்',
    spend_limit: 'செலவு வரம்பு',
    ai_insight: 'ஏ.ஐ. அறிவுரை',
    add_log: 'லாக் சேர்',
    savings_goal: 'சேமிப்பு இலக்கு',
    income_engine: 'வருமான இயந்திரம்',
    seven_day_avg: '7-ஞாயிற்று சராசரி வருமானம்',
    daily_spend_limit: 'தினசரி செலவின் வரம்பு (இயங்கும்)',
    bad_day_mode_active: 'மோசமான நாள் முறை செயல்பாட்டில் — சேமிப்புகள் நிறுத்தப்பட்டுள்ளன.',
    emergency_buffer: 'அவசர பொதி',
    recommended_buffer: 'சேமிப்புக்கு முன் பரிந்துரைக்கப்பட்ட பொதி',
    multiplier: 'மடக்கி',
    apply: 'பயன்படுத்து',
    income_last14: 'கடந்த 14 நாட்களின் வருமானம்',
    hover_bars: 'விவரங்களுக்கு பட்டைகளில் மூலகவும்',
    smart_allocator: 'ஸ்மார்ட் சேமிப்பு ஒதுக்கீட்டாளர்',
    todays_net: 'இன்றைய நிகர சேமிப்பு',
    percentage_mode: 'சதவீத முறை',
    custom_amount: 'தனிப்பயன் தொகை',
    allocation_percentage: 'ஒதுக்கீட்டு சதவீதம்',
    save_log: 'லாக் சேமி',
    track_today: 'இன்றைய வருமானம் மற்றும் செலவுகளை கண்காணிக்கவும்.',
    earned_today: 'இன்று சம்பாதித்தது (₹)',
    total_expense_today: 'இன்று மொத்த செலவு: ₹',
    no_savings: 'சேமிப்புகள் கிடையாது',
    bad_day_message: 'மோசமான நாள் முறை செயல்பாட்டில் உள்ளது — சேமிப்பு ஒதுக்கீடுகள் தற்காலிகமாக நிறுத்தப்பட்டுள்ளன.'
  }
}

const I18nContext = createContext();

export function I18nProvider({ children, defaultLang='en' }){
  const [lang, setLang] = useState(defaultLang);

  const t = (key) => {
    return translations[lang] && translations[lang][key] ? translations[lang][key] : translations['en'][key] || key;
  }

  return React.createElement(
    I18nContext.Provider,
    { value: { lang, setLang, t } },
    children
  )
}

export function useI18n(){
  return useContext(I18nContext);
}

export default I18nContext;
