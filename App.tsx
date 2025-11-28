
import React, { useState, useEffect, useRef } from 'react';
import { 
  LucideLayoutDashboard, 
  LucideSprout, 
  LucideMap, 
  LucideCloudSun, 
  LucideLanguages, 
  LucideLogOut,
  LucidePlus,
  LucideUpload,
  LucideAlertTriangle,
  LucideCheckCircle,
  LucideThermometer,
  LucideDroplets,
  LucideUsers,
  LucideMessageSquare,
  LucideShoppingBag,
  LucideWarehouse,
  LucideGlobe,
  LucideSend,
  LucideUser,
  LucideLock,
  LucideMail,
  LucideArrowRight,
  LucideMapPin,
  LucideAward,
  LucideEye,
  LucidePhone,
  LucideCreditCard,
  LucideEdit3,
  LucideSave,
  LucideX,
  LucideDownload,
  LucideWheat,
  LucideMenu,
  LucideCalendar,
  LucideFileText,
  LucideImage,
  LucideSun,
  LucideCloudRain,
  LucideWind,
  LucideArrowLeft,
  LucideChevronDown,
  LucideBookOpen,
  LucideTrendingUp,
  LucideCamera,
  LucideTrash2,
  LucideHistory,
  LucideDollarSign,
  LucideXCircle,
  LucideCrosshair,
  LucideMinus,
  LucideWifiOff,
  LucideLoader2
} from 'lucide-react';
import { TRANSLATIONS, Language, FarmerProfile, CropBatch, MapPin, DemandPost, DemandCategory } from './types';
import { analyzeCropHealth, getStorageAdvice } from './services/geminiService';
import { api } from './services/api';

// --- MOCK PINS (Static for Map) ---
const MOCK_PINS: MapPin[] = [
  { id: '1', x: 45, y: 30, name: 'Rahim Mia', stock: 1200, risk: false },
  { id: '2', x: 60, y: 45, name: 'Karim Ullah', stock: 850, risk: true },
  { id: '3', x: 30, y: 60, name: 'Fatima Begum', stock: 2000, risk: false },
  { id: '4', x: 75, y: 55, name: 'Abdul Alim', stock: 450, risk: false },
  { id: '5', x: 50, y: 70, name: 'Sajib Hossain', stock: 3000, risk: true },
];

// --- LOCATION DATA ---
const BD_LOCATIONS = {
  'Dhaka': {
    'Dhaka': ['Savar', 'Dhamrai', 'Keraniganj', 'Nawabganj'],
    'Gazipur': ['Gazipur Sadar', 'Kaliakair', 'Kapasia', 'Sreepur'],
    'Narayanganj': ['Narayanganj Sadar', 'Araihazar', 'Sonargaon'],
  },
  'Chattogram': {
    'Chattogram': ['Hathazari', 'Patiya', 'Raozan', 'Sitakunda', 'Mirsarai'],
    'Cox\'s Bazar': ['Cox\'s Bazar Sadar', 'Ramu', 'Teknaf', 'Ukhiya'],
    'Cumilla': ['Cumilla Sadar', 'Daudkandi', 'Homna', 'Laksam'],
  },
  'Rajshahi': {
    'Rajshahi': ['Rajshahi Sadar', 'Bagha', 'Charghat', 'Puthia'],
    'Bogra': ['Bogra Sadar', 'Sherpur', 'Shibganj', 'Gabtali'],
    'Naogaon': ['Naogaon Sadar', 'Mohadevpur', 'Manda'],
  },
  'Khulna': {
    'Khulna': ['Khulna Sadar', 'Dumuria', 'Phultala', 'Rupsha'],
    'Jessore': ['Jessore Sadar', 'Abhaynagar', 'Bagherpara'],
  },
  'Sylhet': {
    'Sylhet': ['Sylhet Sadar', 'Beanibazar', 'Golapganj', 'Kanaighat'],
    'Moulvibazar': ['Moulvibazar Sadar', 'Kulaura', 'Sreemangal'],
  },
  'Barisal': {
    'Barisal': ['Barisal Sadar', 'Babuganj', 'Bakerganj'],
  },
  'Rangpur': {
    'Rangpur': ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia'],
    'Dinajpur': ['Dinajpur Sadar', 'Birganj', 'Biral'],
  },
  'Mymensingh': {
    'Mymensingh': ['Mymensingh Sadar', 'Muktagachha', 'Valuka'],
  }
};

// --- NAVIGATION & VIEWS ---
type ViewState = 'welcome' | 'login' | 'register' | 'dashboard' | 'community' | 'profile' | 'weather' | 'scanner' | 'add-harvest' | 'public-profile';

// --- COMPONENTS ---

const SaveSonaliLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M50 115C50 115 90 90 90 35V15H10V35C10 90 50 115 50 115Z" 
      fill="#286a4f" 
      stroke="#1a4d3a" 
      strokeWidth="3"
    />
    <path 
      d="M10 35H90" 
      stroke="#1a4d3a" 
      strokeWidth="2" 
      strokeOpacity="0.3"
    />
    <g transform="translate(0, 5)">
      <path d="M50 95C50 95 50 80 50 40" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 85C50 85 30 75 30 55" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M50 85C50 85 70 75 70 55" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="42" cy="55" rx="3.5" ry="6" fill="#fbbf24" transform="rotate(-25 42 55)"/>
      <ellipse cx="42" cy="42" rx="3.5" ry="6" fill="#fbbf24" transform="rotate(-25 42 42)"/>
      <ellipse cx="42" cy="29" rx="3.5" ry="6" fill="#fbbf24" transform="rotate(-25 42 29)"/>
      <ellipse cx="58" cy="55" rx="3.5" ry="6" fill="#fbbf24" transform="rotate(25 58 55)"/>
      <ellipse cx="58" cy="42" rx="3.5" ry="6" fill="#fbbf24" transform="rotate(25 58 42)"/>
      <ellipse cx="58" cy="29" rx="3.5" ry="6" fill="#fbbf24" transform="rotate(25 58 29)"/>
      <ellipse cx="50" cy="22" rx="3.5" ry="7" fill="#fbbf24"/>
    </g>
  </svg>
);

const Navbar = ({ lang, setLang, setView, currentView, onLogout, isOffline }: { lang: Language, setLang: (l: Language) => void, setView: (v: ViewState) => void, currentView: ViewState, onLogout: () => void, isOffline: boolean }) => {
  const t = TRANSLATIONS[lang];
  const isDashboardActive = ['dashboard', 'weather', 'scanner', 'add-harvest'].includes(currentView);

  return (
    <nav className="bg-[#1a4d3a] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer gap-3" onClick={() => setView('dashboard')}>
            <SaveSonaliLogo className="w-10 h-10 filter drop-shadow-md" />
            <span className="font-bold text-xl tracking-tight hidden sm:block">{t.appName}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            <button 
              onClick={() => setView('dashboard')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDashboardActive ? 'bg-white/10 text-white font-bold' : 'text-green-100 hover:bg-white/5'}`}
            >
              {t.dashboard}
            </button>
            <button 
              onClick={() => setView('community')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'community' ? 'bg-white/10 text-white font-bold' : 'text-green-100 hover:bg-white/5'}`}
            >
              {t.communityNeeds}
            </button>
            <button 
              onClick={() => setView('profile')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'profile' ? 'bg-white/10 text-white font-bold' : 'text-green-100 hover:bg-white/5'}`}
            >
              {t.profile}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isOffline && (
              <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded text-xs border border-yellow-500/50">
                 <LucideWifiOff className="w-3 h-3" /> Offline
              </span>
            )}

            <button 
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors border border-white/20"
            >
              <LucideGlobe className="h-4 w-4" />
              {lang === 'en' ? 'English' : 'বাংলা'}
            </button>
             <button 
              onClick={onLogout} 
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
               <LucideLogOut className="h-5 w-5" />
            </button>
             <button 
              onClick={onLogout} 
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-100 text-sm font-medium transition-colors border border-red-500/30"
            >
               <LucideLogOut className="h-4 w-4" />
               <span>{t.logout}</span>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Nav Tabs */}
      <div className="md:hidden flex bg-[#153e2e] border-t border-green-800">
        <button onClick={() => setView('dashboard')} className={`flex-1 py-3 text-center text-xs font-medium ${isDashboardActive ? 'text-white bg-white/5' : 'text-green-200'}`}>{t.dashboard}</button>
        <button onClick={() => setView('community')} className={`flex-1 py-3 text-center text-xs font-medium ${currentView === 'community' ? 'text-white bg-white/5' : 'text-green-200'}`}>{t.communityNeeds}</button>
        <button onClick={() => setView('profile')} className={`flex-1 py-3 text-center text-xs font-medium ${currentView === 'profile' ? 'text-white bg-white/5' : 'text-green-200'}`}>{t.profile}</button>
      </div>
    </nav>
  );
};

const LocationEditor = ({ value, onChange, lang }: { value: string, onChange: (v: string) => void, lang: Language }) => {
  const [division, setDivision] = useState(Object.keys(BD_LOCATIONS)[0]);
  const [district, setDistrict] = useState(Object.keys(BD_LOCATIONS['Dhaka'])[0]);
  const [upazila, setUpazila] = useState(BD_LOCATIONS['Dhaka']['Dhaka'][0]);
  const [postCode, setPostCode] = useState('');

  const handleDivisionChange = (d: string) => {
    setDivision(d);
    // @ts-ignore
    const newDistricts = Object.keys(BD_LOCATIONS[d]);
    setDistrict(newDistricts[0]);
    // @ts-ignore
    setUpazila(BD_LOCATIONS[d][newDistricts[0]][0]);
  };

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    // @ts-ignore
    setUpazila(BD_LOCATIONS[division][d][0]);
  };

  const saveLocation = () => {
     const fullLoc = `${upazila}, ${district}`;
     onChange(fullLoc);
  };
  
  const t = TRANSLATIONS[lang];

  return (
    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="col-span-2 md:col-span-1">
        <label className="text-xs text-gray-500 font-bold block mb-1">Division</label>
        <select 
          value={division} 
          onChange={(e) => handleDivisionChange(e.target.value)}
          className="w-full p-2 text-sm border rounded-md"
        >
          {Object.keys(BD_LOCATIONS).map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div className="col-span-2 md:col-span-1">
        <label className="text-xs text-gray-500 font-bold block mb-1">District</label>
        <select 
          value={district} 
          onChange={(e) => handleDistrictChange(e.target.value)}
          className="w-full p-2 text-sm border rounded-md"
        >
           {/* @ts-ignore */}
          {Object.keys(BD_LOCATIONS[division]).map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div className="col-span-2 md:col-span-1">
        <label className="text-xs text-gray-500 font-bold block mb-1">Upazila</label>
        <select 
          value={upazila} 
          onChange={(e) => setUpazila(e.target.value)}
          className="w-full p-2 text-sm border rounded-md"
        >
           {/* @ts-ignore */}
          {BD_LOCATIONS[division][district].map((u: string) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
       <div className="col-span-2 md:col-span-1">
        <label className="text-xs text-gray-500 font-bold block mb-1">{t.postCodeOptional}</label>
        <input 
          type="text" 
          value={postCode}
          onChange={(e) => setPostCode(e.target.value)}
          className="w-full p-2 text-sm border rounded-md"
          placeholder="e.g. 1200"
        />
      </div>
      <div className="col-span-2">
         <button 
           type="button" 
           onClick={saveLocation} 
           className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-bold"
         >
           Confirm Location
         </button>
      </div>
    </div>
  );
};


// --- SUB-VIEWS FOR DASHBOARD ---

const WeatherView = ({ lang, onBack, isOffline }: { lang: Language, onBack: () => void, isOffline: boolean }) => {
  const t = TRANSLATIONS[lang];
  
  if (isOffline) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in text-center">
         <button onClick={onBack} className="flex items-center gap-2 text-gray-600 mb-6 hover:text-green-700 transition">
            <LucideArrowLeft className="w-5 h-5" /> {t.backToDashboard}
         </button>
         <div className="bg-white p-12 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center">
            <LucideWifiOff className="w-20 h-20 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">You are Offline</h2>
            <p className="text-gray-500">Weather forecasts require an internet connection. Please reconnect to view the latest updates.</p>
         </div>
      </div>
    );
  }

  const getDayName = (offset: number) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const dayKey = days[d.getDay()];
    // @ts-ignore
    return t[dayKey] || dayKey;
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-600 mb-6 hover:text-green-700 transition">
        <LucideArrowLeft className="w-5 h-5" /> {t.backToDashboard}
      </button>

      <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 z-10 relative">
          <div>
             <h2 className="text-3xl font-bold mb-2">{t.weather}</h2>
             <p className="text-blue-100 text-lg">Hathazari, Chattogram</p>
             <div className="mt-6 flex items-center gap-4">
                <LucideCloudSun className="w-20 h-20 text-yellow-300" />
                <div className="text-6xl font-bold">32°C</div>
             </div>
             <p className="mt-2 text-blue-100 text-lg font-medium">{t.partlyCloudy}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 min-w-[250px]">
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><LucideDroplets className="w-5 h-5"/> {t.humidity}</span>
                  <span className="font-bold text-xl">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><LucideCloudRain className="w-5 h-5"/> {t.rainChance}</span>
                  <span className="font-bold text-xl">60%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><LucideWind className="w-5 h-5"/> {t.wind}</span>
                  <span className="font-bold text-xl">12 km/h</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl shadow-sm mb-8 flex items-start gap-4">
         <LucideAlertTriangle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
         <div>
           <h3 className="text-lg font-bold text-yellow-800 mb-1">{t.storageAdvice}</h3>
           <p className="text-yellow-700">{t.highHumidityAlert}</p>
         </div>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-4">{t.forecast}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {/* Today */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-gray-500 font-medium mb-2">{t.today}</span>
            <LucideCloudSun className="w-12 h-12 text-yellow-500 mb-3" />
            <span className="text-2xl font-bold text-gray-800">32°C</span>
            <span className="text-sm text-gray-500 text-center">{t.partlyCloudy}</span>
         </div>
         {/* Tomorrow */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-gray-500 font-medium mb-2">{t.tomorrow}</span>
            <LucideCloudRain className="w-12 h-12 text-blue-500 mb-3" />
            <span className="text-2xl font-bold text-gray-800">28°C</span>
            <span className="text-sm text-gray-500 text-center">{t.rainExpected}</span>
         </div>
         {/* Day After */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-gray-500 font-medium mb-2">{getDayName(2)}</span>
            <LucideSun className="w-12 h-12 text-orange-500 mb-3" />
            <span className="text-2xl font-bold text-gray-800">34°C</span>
            <span className="text-sm text-gray-500 text-center">{t.sunny}</span>
         </div>
      </div>
    </div>
  );
};

const ScannerView = ({ lang, onBack, isOffline }: { lang: Language, onBack: () => void, isOffline: boolean }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-600 mb-6 hover:text-green-700 transition">
        <LucideArrowLeft className="w-5 h-5" /> {t.backToDashboard}
      </button>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.aiDoctor}</h1>
        <p className="text-gray-600">{t.featureScannerDesc}</p>
      </div>

      {isOffline ? (
         <div className="bg-white p-12 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
            <LucideWifiOff className="w-20 h-20 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Scanner Offline</h2>
            <p className="text-gray-500">The Crop Doctor requires internet to analyze images using Google Gemini AI. Please connect to the internet.</p>
         </div>
      ) : (
        <CropScanner lang={lang} />
      )}
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
          <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
            <LucideCheckCircle className="w-5 h-5" /> How it works
          </h3>
          <ul className="list-disc list-inside text-sm text-green-700 space-y-2">
            <li>Take a clear photo of the affected crop area.</li>
            <li>Upload the image above.</li>
            <li>AI analyzes for common diseases and pests.</li>
            <li>Get instant treatment and storage recommendations.</li>
          </ul>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
           <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
            <LucideAward className="w-5 h-5" /> Beta Feature
          </h3>
          <p className="text-sm text-blue-700">
            The Crop Doctor AI is powered by Gemini 2.5 Flash. It is currently in beta and works best with Rice, Wheat, and Potato crops common in Bangladesh.
          </p>
        </div>
      </div>
    </div>
  );
};

const AddBatchForm = ({ lang, onAdd, onCancel, isOffline }: { lang: Language, onAdd: (b: CropBatch) => void, onCancel: () => void, isOffline: boolean }) => {
  const t = TRANSLATIONS[lang];
  const [formData, setFormData] = useState({
    cropType: '',
    weight: '',
    harvestDate: new Date().toISOString().split('T')[0],
    storageType: 'Jute Bag'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call for advice/risk
    let status: 'Fresh' | 'At Risk' = 'Fresh';
    let riskAnalysis = '';
    
    // Mock logic: if connected, try getting real advice, else use simple logic
    if (!isOffline && formData.storageType === 'Open Air') {
        try {
           const advice = await getStorageAdvice(formData.cropType, formData.storageType, lang);
           status = 'At Risk';
           riskAnalysis = advice.slice(0, 100) + '...';
        } catch (e) {
           console.log("Offline or API err");
        }
    }

    const newBatch: CropBatch = {
      id: Math.random().toString(36).substr(2, 9),
      cropType: formData.cropType,
      weight: Number(formData.weight),
      harvestDate: formData.harvestDate,
      storageType: formData.storageType as any,
      status: status,
      riskAnalysis: riskAnalysis,
      outcome: undefined
    };

    onAdd(newBatch);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.cropType}</label>
          <input 
            type="text" 
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="e.g. Rice"
            value={formData.cropType}
            onChange={e => setFormData({...formData, cropType: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.weight} ({t.unitKg})</label>
            <input 
              type="number" 
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={formData.weight}
              onChange={e => setFormData({...formData, weight: e.target.value})}
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">{t.harvestDate}</label>
             <input 
              type="date" 
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={formData.harvestDate}
              onChange={e => setFormData({...formData, harvestDate: e.target.value})}
            />
          </div>
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">{t.storageMethod}</label>
           <select 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={formData.storageType}
              onChange={e => setFormData({...formData, storageType: e.target.value})}
           >
              <option value="Silo">Silo</option>
              <option value="Jute Bag">Jute Bag</option>
              <option value="Open Air">Open Air</option>
              <option value="Cold Storage">Cold Storage</option>
           </select>
        </div>
        <div className="flex gap-3 pt-4">
           <button type="button" onClick={onCancel} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold text-gray-700">{t.cancel}</button>
           <button type="submit" disabled={loading} className="flex-1 py-2 bg-green-600 rounded-lg font-bold text-white hover:bg-green-700">
             {loading ? t.analyzing : t.submit}
           </button>
        </div>
      </form>
    </div>
  );
};

const AddHarvestView = ({ lang, onBack, onAdd, isOffline }: { lang: Language, onBack: () => void, onAdd: (b: CropBatch) => void, isOffline: boolean }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-600 mb-6 hover:text-green-700 transition">
        <LucideArrowLeft className="w-5 h-5" /> {t.backToDashboard}
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t.addBatch}</h1>
        <p className="text-gray-600 mt-2">{t.featureAddDesc}</p>
      </div>

      <AddBatchForm lang={lang} onAdd={onAdd} onCancel={onBack} isOffline={isOffline} />
    </div>
  );
}

const CropScanner = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setImage(base64String);
        runAnalysis(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (base64Data: string) => {
    setLoading(true);
    const result = await analyzeCropHealth(base64Data, lang);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all group bg-gray-50"
      >
        {image ? (
          <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
        ) : (
          <div className="space-y-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
              <LucideUpload className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-lg font-medium text-gray-600 group-hover:text-green-700">{t.uploadImage}</p>
            <p className="text-sm text-gray-400">Supports JPG, PNG</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {loading && (
        <div className="mt-8 flex flex-col items-center gap-3 text-green-600 animate-pulse">
           <LucideSprout className="w-10 h-10" /> 
           <span className="font-bold text-lg">{t.analyzing}</span>
        </div>
      )}

      {analysis && !loading && (
        <div className="mt-8 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
           <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
             <LucideFileText className="w-5 h-5 text-gray-600" />
             <span className="font-bold text-gray-700">Analysis Result</span>
           </div>
           <div className="p-6">
             <p className="text-gray-800 leading-relaxed text-lg">{analysis}</p>
           </div>
        </div>
      )}
    </div>
  );
};

// --- MISSING COMPONENTS IMPLEMENTATIONS ---

const WelcomeScreen = ({ lang, setLang, onStart }: { lang: Language, setLang: (l: Language) => void, onStart: () => void }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-800 flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="mb-8 animate-fade-in-up">
        <SaveSonaliLogo className="w-24 h-24 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2 tracking-tight">{t.appName}</h1>
        <p className="text-green-200 text-lg">{t.welcomeSubtitle}</p>
      </div>

      <div className="w-full max-w-md space-y-4 animate-fade-in-up delay-100">
        <button 
          onClick={onStart}
          className="w-full bg-[#fbbf24] text-green-900 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          {t.getStarted} <LucideArrowRight className="w-5 h-5" />
        </button>
        
        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={() => setLang('en')}
            className={`px-4 py-2 rounded-full border border-white/20 ${lang === 'en' ? 'bg-white text-green-900' : 'text-green-100 hover:bg-white/10'}`}
          >
            English
          </button>
          <button 
            onClick={() => setLang('bn')}
            className={`px-4 py-2 rounded-full border border-white/20 ${lang === 'bn' ? 'bg-white text-green-900' : 'text-green-100 hover:bg-white/10'}`}
          >
            বাংলা
          </button>
        </div>
      </div>
      
      <p className="absolute bottom-6 text-sm text-green-400/60">© 2025 SaveSonali Project</p>
    </div>
  );
};

const AuthScreen = ({ lang, onLogin, type }: { lang: Language, onLogin: () => void, type: 'login' | 'register' }) => {
  const t = TRANSLATIONS[lang];
  const [isLogin, setIsLogin] = useState(type === 'login');

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center px-6">
      <div className="max-w-md mx-auto w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <SaveSonaliLogo className="w-12 h-12 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-900">{isLogin ? t.login : t.createAccount}</h2>
          <p className="text-gray-500 text-sm mt-1">{isLogin ? t.loginMessage : t.joinMessage}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.mobileNumber}</label>
            <div className="relative">
              <LucidePhone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input type="tel" className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="017..." />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
            <div className="relative">
              <LucideLock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input type="password" className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="••••••••" />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.fullName}</label>
              <div className="relative">
                <LucideUser className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input type="text" className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Rahim Mia" />
              </div>
            </div>
          )}

          <button 
            onClick={onLogin}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition-colors shadow-lg shadow-green-700/20"
          >
            {isLogin ? t.login : t.registerNow}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-700 font-medium hover:underline text-sm"
          >
            {isLogin ? t.newToApp : t.alreadyHaveAccount}
          </button>
        </div>
      </div>
    </div>
  );
};

const MapDashboard = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative h-[300px] w-full">
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm flex items-center gap-2">
        <LucideMap className="w-3 h-3" /> {t.mapView}
      </div>
      
      {/* Mock Map Background */}
      <div className="w-full h-full bg-blue-50 relative">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Simple abstract land masses */}
          <path d="M0 0 H100 V100 H0 Z" fill="#e0f2fe" />
          <path d="M10 20 Q30 5 50 20 T90 20 V80 Q70 95 50 80 T10 80 Z" fill="#dcfce7" stroke="#86efac" strokeWidth="0.5" />
          
          {MOCK_PINS.map(pin => (
            <g key={pin.id} transform={`translate(${pin.x}, ${pin.y})`} className="cursor-pointer hover:opacity-80">
              <circle r="4" fill={pin.risk ? "#ef4444" : "#22c55e"} stroke="white" strokeWidth="1.5" />
              <text y="-6" fontSize="3" textAnchor="middle" fill="#1f2937" fontWeight="bold">{pin.name}</text>
            </g>
          ))}
        </svg>
      </div>
      
      <div className="absolute bottom-2 right-2 bg-white/90 p-2 rounded text-[10px] text-gray-500">
        Demo Map Data
      </div>
    </div>
  );
};

const BatchDetailsModal = ({ batch, onClose, lang, onUpdateStatus }: { batch: CropBatch, onClose: () => void, lang: Language, onUpdateStatus: (id: string, s: 'Sold'|'Lost', o: 'Gain'|'Loss') => void }) => {
  const t = TRANSLATIONS[lang];
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all">
        <div className="bg-green-700 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <LucideWheat className="w-5 h-5" /> {t.batchDetails}
          </h3>
          <button onClick={onClose}><LucideX className="w-6 h-6" /></button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">{t.cropType}</p>
              <p className="text-2xl font-bold text-gray-800">{batch.cropType}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${batch.status === 'At Risk' ? 'bg-red-100 text-red-700' : batch.status === 'Sold' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
              {batch.status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
             <div>
                <p className="text-xs text-gray-500">{t.weight}</p>
                <p className="font-semibold">{batch.weight} {t.unitKg}</p>
             </div>
             <div>
                <p className="text-xs text-gray-500">{t.harvestDate}</p>
                <p className="font-semibold">{batch.harvestDate}</p>
             </div>
             <div>
                <p className="text-xs text-gray-500">{t.storageMethod}</p>
                <p className="font-semibold">{batch.storageType}</p>
             </div>
             <div>
                <p className="text-xs text-gray-500">ID</p>
                <p className="font-mono text-xs">{batch.id}</p>
             </div>
          </div>

          {batch.riskAnalysis && (
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <p className="text-xs font-bold text-yellow-800 uppercase mb-1">{t.riskAnalysisLabel}</p>
              <p className="text-sm text-yellow-900 leading-relaxed">{batch.riskAnalysis}</p>
            </div>
          )}
          
          {batch.status !== 'Sold' && batch.status !== 'Lost' && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => { onUpdateStatus(batch.id, 'Sold', 'Gain'); onClose(); }}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-blue-700"
              >
                <LucideDollarSign className="w-4 h-4" /> {t.markSold}
              </button>
              <button 
                onClick={() => { onUpdateStatus(batch.id, 'Lost', 'Loss'); onClose(); }}
                className="flex items-center justify-center gap-2 bg-red-100 text-red-700 py-2 rounded-lg font-bold text-sm hover:bg-red-200"
              >
                <LucideAlertTriangle className="w-4 h-4" /> {t.reportLoss}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardHome = ({ lang, user, onViewProfile, setView, downloadCSV, onSelectBatch, onDeleteBatch }: { 
  lang: Language, 
  user: FarmerProfile, 
  onViewProfile: () => void, 
  setView: (v: ViewState) => void,
  downloadCSV: (batches: CropBatch[]) => void,
  onSelectBatch: (b: CropBatch) => void,
  onDeleteBatch: (id: string) => void
}) => {
  const t = TRANSLATIONS[lang];
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-gradient-to-r from-green-700 to-green-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
           <div className="relative z-10">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-green-100 text-sm font-medium mb-1">{t.welcomeBack},</p>
                 <h2 className="text-3xl font-bold">{user.name}</h2>
               </div>
               <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.name}`} alt="avatar" className="w-12 h-12 rounded-full bg-white/20 p-1" />
             </div>
             
             <div className="mt-8 grid grid-cols-2 gap-4">
               <div>
                 <p className="text-green-200 text-xs">{t.totalStock}</p>
                 <p className="text-2xl font-bold">{user.totalStock.toLocaleString()} <span className="text-sm font-normal">{t.unitKg}</span></p>
               </div>
               <div>
                 <p className="text-green-200 text-xs">{t.activeHarvests}</p>
                 <p className="text-2xl font-bold">{user.batches.length}</p>
               </div>
             </div>
           </div>
           
           <LucideWheat className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
        </div>

        <div className="flex-1 grid grid-cols-2 gap-3">
          <button onClick={() => setView('add-harvest')} className="bg-white p-4 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition flex flex-col items-center justify-center text-center gap-2 group">
             <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
               <LucidePlus className="w-6 h-6" />
             </div>
             <span className="text-sm font-bold text-gray-700">{t.addBatch}</span>
          </button>
          
          <button onClick={() => setView('weather')} className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition flex flex-col items-center justify-center text-center gap-2 group">
             <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <LucideCloudSun className="w-6 h-6" />
             </div>
             <span className="text-sm font-bold text-gray-700">{t.weather}</span>
          </button>
          
          <button onClick={() => setView('scanner')} className="bg-white p-4 rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition flex flex-col items-center justify-center text-center gap-2 group">
             <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
               <LucideCamera className="w-6 h-6" />
             </div>
             <span className="text-sm font-bold text-gray-700">{t.aiDoctor}</span>
          </button>
          
          <button onClick={() => setView('community')} className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition flex flex-col items-center justify-center text-center gap-2 group">
             <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
               <LucideUsers className="w-6 h-6" />
             </div>
             <span className="text-sm font-bold text-gray-700">{t.communityNeeds}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
           <div className="flex justify-between items-center">
             <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2"><LucideLayoutDashboard className="w-5 h-5 text-gray-500" /> {t.myCrops}</h3>
             <button onClick={() => downloadCSV(user.batches)} className="text-green-600 text-sm font-medium hover:underline flex items-center gap-1">
               <LucideDownload className="w-4 h-4" /> CSV
             </button>
           </div>
           
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             {user.batches.length === 0 ? (
               <div className="p-8 text-center text-gray-500">
                 <LucideSprout className="w-12 h-12 mx-auto mb-2 opacity-30" />
                 <p>{t.featureAddDesc}</p>
               </div>
             ) : (
               <div className="divide-y divide-gray-100">
                 {user.batches.map(batch => (
                   <div key={batch.id} className="p-4 hover:bg-gray-50 transition flex justify-between items-center group">
                     <div className="flex items-center gap-4 cursor-pointer" onClick={() => onSelectBatch(batch)}>
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center ${batch.status === 'At Risk' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                         <LucideWheat className="w-5 h-5" />
                       </div>
                       <div>
                         <p className="font-bold text-gray-800">{batch.cropType}</p>
                         <p className="text-xs text-gray-500">{batch.harvestDate} • {batch.storageType}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="text-right mr-2 hidden sm:block">
                         <p className="font-bold text-gray-800">{batch.weight} {t.unitKg}</p>
                         <p className={`text-xs font-medium ${batch.status === 'At Risk' ? 'text-red-600' : 'text-green-600'}`}>{batch.status}</p>
                       </div>
                       <button onClick={() => onDeleteBatch(batch.id)} className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                         <LucideTrash2 className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>
        
        <div className="space-y-4">
           <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2"><LucideMapPin className="w-5 h-5 text-gray-500" /> {t.mapView}</h3>
           <MapDashboard lang={lang} />
           
           <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mt-4">
              <h4 className="font-bold text-yellow-800 mb-1 flex items-center gap-2"><LucideTrendingUp className="w-4 h-4" /> Market Insight</h4>
              <p className="text-xs text-yellow-800">Potato prices are up 5% in Chattogram due to high demand.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const ProfileView = ({ lang, user, onUpdate, onLogout }: { lang: Language, user: FarmerProfile, onUpdate: (u: FarmerProfile) => void, onLogout: () => void }) => {
  const t = TRANSLATIONS[lang];
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSave = () => {
    onUpdate(formData);
    setEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
       <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="h-32 bg-green-700 relative">
            <button onClick={onLogout} className="absolute top-4 right-4 bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition">
               <LucideLogOut className="w-5 h-5" />
            </button>
          </div>
          <div className="px-8 pb-8">
             <div className="relative -top-12 flex justify-between items-end mb-2">
                <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.name}`} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md" />
                <button 
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition ${editing ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {editing ? <><LucideSave className="w-4 h-4" /> {t.saveChanges}</> : <><LucideEdit3 className="w-4 h-4" /> {t.editProfile}</>}
                </button>
             </div>
             
             <div className="space-y-6">
                <div>
                   {editing ? (
                     <input 
                       className="text-2xl font-bold border-b border-gray-300 outline-none w-full pb-1"
                       value={formData.name}
                       onChange={e => setFormData({...formData, name: e.target.value})}
                     />
                   ) : (
                     <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                   )}
                   <p className="text-gray-500 flex items-center gap-1 mt-1">
                     <LucideMapPin className="w-4 h-4" /> 
                     {editing ? <LocationEditor value={formData.location} onChange={(l) => setFormData({...formData, location: l})} lang={lang} /> : user.location}
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-2">{t.contactInfo}</p>
                      <div className="space-y-3">
                         <div className="flex items-center gap-3">
                            <LucidePhone className="w-5 h-5 text-gray-400" />
                            {editing ? (
                              <input className="bg-white p-1 rounded border text-sm" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                            ) : (
                              <span className="font-medium">{user.mobile}</span>
                            )}
                         </div>
                         <div className="flex items-center gap-3">
                            <LucideCreditCard className="w-5 h-5 text-gray-400" />
                            <span className="font-medium text-gray-600">{user.nid}</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-2">{t.farmDetails}</p>
                      <div className="space-y-3">
                         <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">{t.farmSize}</span>
                            <span className="font-medium">{user.farmSize}</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">{t.soilType}</span>
                            <span className="font-medium">{user.soilType}</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const DemandBoard = ({ lang, demands, onAddDemand }: { lang: Language, demands: DemandPost[], onAddDemand: (d: DemandPost) => void }) => {
  const t = TRANSLATIONS[lang];
  const [showForm, setShowForm] = useState(false);
  const [newDemand, setNewDemand] = useState({ title: '', category: 'Buyer Needed', description: '', contact: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDemand({
      id: Date.now().toString(),
      farmerName: 'Me',
      category: newDemand.category as DemandCategory,
      title: newDemand.title,
      description: newDemand.description,
      date: new Date().toISOString().split('T')[0],
      contact: newDemand.contact
    });
    setShowForm(false);
    setNewDemand({ title: '', category: 'Buyer Needed', description: '', contact: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
       <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.communityNeeds}</h1>
            <p className="text-gray-500 text-sm">{t.communitySubtitle}</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-green-700 flex items-center gap-2"
          >
            <LucidePlus className="w-5 h-5" /> {t.postNeed}
          </button>
       </div>

       {showForm && (
         <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-green-100 animate-slide-down">
           <h3 className="font-bold text-lg mb-4">{t.postNeed}</h3>
           <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                placeholder={t.title} 
                required 
                className="w-full p-2 border rounded"
                value={newDemand.title}
                onChange={e => setNewDemand({...newDemand, title: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                 <select 
                    className="p-2 border rounded"
                    value={newDemand.category}
                    onChange={e => setNewDemand({...newDemand, category: e.target.value})}
                 >
                   <option>{t.buyerNeeded}</option>
                   <option>{t.storageHelp}</option>
                   <option>{t.exportInfo}</option>
                   <option>{t.general}</option>
                 </select>
                 <input 
                    placeholder={t.contactInfo} 
                    required 
                    className="p-2 border rounded"
                    value={newDemand.contact}
                    onChange={e => setNewDemand({...newDemand, contact: e.target.value})}
                 />
              </div>
              <textarea 
                placeholder={t.description} 
                required 
                className="w-full p-2 border rounded h-24"
                value={newDemand.description}
                onChange={e => setNewDemand({...newDemand, description: e.target.value})}
              />
              <div className="flex gap-2">
                 <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded">{t.cancel}</button>
                 <button type="submit" className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700">{t.submit}</button>
              </div>
           </form>
         </div>
       )}

       <div className="grid gap-4">
          {demands.map(post => (
             <div key={post.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                   <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                     post.category === 'Buyer Needed' ? 'bg-blue-100 text-blue-700' : 
                     post.category === 'Storage Equipment' ? 'bg-orange-100 text-orange-700' : 
                     'bg-gray-100 text-gray-700'
                   }`}>
                     {post.category}
                   </span>
                   <span className="text-xs text-gray-400">{post.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mt-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{post.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                   <div className="flex items-center gap-2 text-sm text-gray-500">
                      <LucideUser className="w-4 h-4" /> {post.farmerName}
                   </div>
                   <button className="text-green-600 text-sm font-bold flex items-center gap-1 hover:underline">
                      <LucidePhone className="w-4 h-4" /> {t.respond}
                   </button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};


// Updated App Component
function App() {
  const [view, setView] = useState<ViewState>('welcome');
  const [lang, setLang] = useState<Language>('en');
  
  // App Data State (Loaded from API)
  const [user, setUser] = useState<FarmerProfile | null>(null);
  const [demands, setDemands] = useState<DemandPost[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<CropBatch | null>(null);
  const [loading, setLoading] = useState(true);

  // Online/Offline State
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // 1. Connection Listener
    const handleStatusChange = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    // 2. Load Data from Local Storage API
    const initData = async () => {
      setLoading(true);
      const userProfile = await api.getUserProfile();
      const demandPosts = await api.getDemands();
      setUser(userProfile);
      setDemands(demandPosts);
      setLoading(false);
    };
    initData();

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  // Actions
  const handleUpdateProfile = async (updatedUser: FarmerProfile) => {
    const saved = await api.updateUserProfile(updatedUser);
    setUser(saved);
  };

  const addBatch = async (batch: CropBatch) => {
    if (!user) return;
    const updatedBatches = [batch, ...user.batches];
    const updatedStock = user.totalStock + batch.weight;
    const updatedUser = { ...user, batches: updatedBatches, totalStock: updatedStock };
    
    // Save to API
    const saved = await api.updateUserProfile(updatedUser);
    setUser(saved);
    setView('dashboard');
  };
  
  const deleteBatch = async (id: string) => {
    if (!user) return;
    const updatedBatches = user.batches.filter(b => b.id !== id);
    // Recalculate stock
    const deletedBatch = user.batches.find(b => b.id === id);
    let newStock = user.totalStock;
    if (deletedBatch && deletedBatch.status !== 'Sold' && deletedBatch.status !== 'Lost') {
       newStock -= deletedBatch.weight;
    }
    const updatedUser = { ...user, batches: updatedBatches, totalStock: newStock };
    const saved = await api.updateUserProfile(updatedUser);
    setUser(saved);
  };
  
  const updateBatchStatus = async (id: string, status: 'Sold' | 'Lost', outcome: 'Gain' | 'Loss') => {
    if (!user) return;
    const updatedBatches = user.batches.map(b => 
      b.id === id ? { ...b, status: status, outcome: outcome } : b
    );
    const batch = user.batches.find(b => b.id === id);
    let newStock = user.totalStock;
    if (batch) newStock -= batch.weight;

    const updatedUser = { ...user, batches: updatedBatches, totalStock: newStock };
    const saved = await api.updateUserProfile(updatedUser);
    setUser(saved);
  };

  const addDemand = async (post: DemandPost) => {
    const updated = await api.addDemand(post);
    setDemands(updated);
  };

  const downloadCSV = (batches: CropBatch[]) => {
    const headers = ['ID', 'Crop Type', 'Weight (kg)', 'Harvest Date', 'Storage Type', 'Status', 'Outcome'];
    const rows = batches.map(b => [b.id, b.cropType, b.weight, b.harvestDate, b.storageType, b.status, b.outcome || '']);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `harvest_data_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-green-700">
         <LucideLoader2 className="w-12 h-12 animate-spin mb-4" />
         <p className="font-bold">Loading SaveSonali...</p>
      </div>
    );
  }

  // Pass necessary props to views
  // Note: I'm casting functions here for brevity as they are defined above
  
  let content;
  if (view === 'welcome') {
    content = <WelcomeScreen lang={lang} setLang={setLang} onStart={() => setView('login')} />;
  }
  else if (view === 'login' || view === 'register') {
    content = <AuthScreen lang={lang} onLogin={() => setView('dashboard')} type={view === 'login' ? 'login' : 'register'} />;
  }
  else if (view === 'profile' && user) {
    content = <ProfileView lang={lang} user={user} onUpdate={handleUpdateProfile} onLogout={() => setView('welcome')} />;
  }
  else if (view === 'community') {
    content = <DemandBoard lang={lang} demands={demands} onAddDemand={addDemand} />;
  }
  else if (view === 'weather') {
    content = <WeatherView lang={lang} onBack={() => setView('dashboard')} isOffline={isOffline} />;
  }
  else if (view === 'scanner') {
    content = <ScannerView lang={lang} onBack={() => setView('dashboard')} isOffline={isOffline} />;
  }
  else if (view === 'add-harvest') {
    content = <AddHarvestView lang={lang} onBack={() => setView('dashboard')} onAdd={addBatch} isOffline={isOffline} />;
  }
  else if (user) {
    content = (
      <DashboardHome 
        lang={lang} 
        user={user} 
        onViewProfile={() => setView('profile')} 
        setView={setView} 
        downloadCSV={downloadCSV}
        onSelectBatch={setSelectedBatch}
        onDeleteBatch={deleteBatch}
      />
    );
  } else {
    content = <WelcomeScreen lang={lang} setLang={setLang} onStart={() => setView('login')} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {view !== 'welcome' && view !== 'login' && view !== 'register' && (
         <Navbar lang={lang} setLang={setLang} setView={setView} currentView={view} onLogout={() => setView('welcome')} isOffline={isOffline} />
      )}
      {content}
      {selectedBatch && (
        <BatchDetailsModal 
          batch={selectedBatch} 
          onClose={() => setSelectedBatch(null)} 
          lang={lang}
          onUpdateStatus={updateBatchStatus}
        />
      )}
    </div>
  );
}

export default App;
