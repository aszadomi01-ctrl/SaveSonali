
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
  LucideMinus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TRANSLATIONS, Language, FarmerProfile, CropBatch, MapPin, DemandPost, DemandCategory } from './types';
import { analyzeCropHealth, getStorageAdvice } from './services/geminiService';

// --- MOCK DATA ---
const MOCK_PINS: MapPin[] = [
  { id: '1', x: 45, y: 30, name: 'Rahim Mia', stock: 1200, risk: false },
  { id: '2', x: 60, y: 45, name: 'Karim Ullah', stock: 850, risk: true },
  { id: '3', x: 30, y: 60, name: 'Fatima Begum', stock: 2000, risk: false },
  { id: '4', x: 75, y: 55, name: 'Abdul Alim', stock: 450, risk: false },
  { id: '5', x: 50, y: 70, name: 'Sajib Hossain', stock: 3000, risk: true },
];

const INITIAL_BATCHES: CropBatch[] = [
  { id: 'b1', cropType: 'Rice (Boro)', weight: 500, harvestDate: '2025-02-10', storageType: 'Silo', status: 'Fresh' },
  { id: 'b2', cropType: 'Wheat', weight: 200, harvestDate: '2025-01-20', storageType: 'Jute Bag', status: 'At Risk', riskAnalysis: 'High moisture detected. Dry immediately.' },
  { id: 'b3', cropType: 'Potato', weight: 1000, harvestDate: '2025-02-15', storageType: 'Cold Storage', status: 'Fresh' },
  { id: 'b4', cropType: 'Corn', weight: 800, harvestDate: '2024-11-05', storageType: 'Open Air', status: 'Sold', outcome: 'Gain' },
];

const INITIAL_DEMANDS: DemandPost[] = [
  {
    id: 'd1',
    farmerName: 'Karim Ullah',
    category: 'Buyer Needed',
    title: '500kg Boro Rice for Sale',
    description: 'Fresh harvest available. Looking for wholesalers in Dhaka or Rangpur. Price negotiable.',
    date: '2024-05-15',
    contact: '01700000000'
  },
  {
    id: 'd2',
    farmerName: 'Sajib Hossain',
    category: 'Storage Equipment',
    title: 'Need Moisture Meter',
    description: 'Looking to rent or buy a digital moisture meter for 2 days to check my wheat stock.',
    date: '2024-05-14',
    contact: '01800000000'
  },
  {
    id: 'd3',
    farmerName: 'Fatima Begum',
    category: 'Export Inquiry',
    title: 'Exporting Organic Potatoes',
    description: 'I have a batch of organic potatoes. Need information on export requirements for the Middle East.',
    date: '2024-05-12',
    contact: '01900000000'
  }
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

const Navbar = ({ lang, setLang, setView, currentView, onLogout }: { lang: Language, setLang: (l: Language) => void, setView: (v: ViewState) => void, currentView: ViewState, onLogout: () => void }) => {
  const t = TRANSLATIONS[lang];
  // Helper to check if we are in a sub-view of dashboard
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

const LocationEditor = ({ 
  value, 
  onChange, 
  lang 
}: { 
  value: string, 
  onChange: (v: string) => void, 
  lang: Language 
}) => {
  // Parse current location
  const parts = value.split(', ').map(p => p.trim());
  
  const [division, setDivision] = useState(Object.keys(BD_LOCATIONS)[0]);
  const [district, setDistrict] = useState(Object.keys(BD_LOCATIONS['Dhaka'])[0]);
  const [upazila, setUpazila] = useState(BD_LOCATIONS['Dhaka']['Dhaka'][0]);
  const [village, setVillage] = useState('');
  const [postCode, setPostCode] = useState('');

  // Update parent when any part changes
  useEffect(() => {
    // Reconstruct full string
    const fullLoc = `${upazila}, ${district}, ${division} - ${postCode} ${village ? '(' + village + ')' : ''}`;
  }, [division, district, upazila, village, postCode]);

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

const WeatherView = ({ lang, onBack }: { lang: Language, onBack: () => void }) => {
  const t = TRANSLATIONS[lang];
  
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

const ScannerView = ({ lang, onBack }: { lang: Language, onBack: () => void }) => {
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

      <CropScanner lang={lang} />
      
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

const AddBatchForm = ({ lang, onAdd, onCancel }: { lang: Language, onAdd: (b: CropBatch) => void, onCancel: () => void }) => {
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
    
    // Mock logic for demo
    if (formData.storageType === 'Open Air') {
        const advice = await getStorageAdvice(formData.cropType, formData.storageType, lang);
        status = 'At Risk';
        riskAnalysis = advice.slice(0, 100) + '...';
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

const AddHarvestView = ({ lang, onBack, onAdd }: { lang: Language, onBack: () => void, onAdd: (b: CropBatch) => void }) => {
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

      <AddBatchForm lang={lang} onAdd={onAdd} onCancel={onBack} />
    </div>
  );
}

// Reused Components for Sub-views

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
        className="border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-harvest-500 hover:bg-harvest-50 transition-all group bg-gray-50"
      >
        {image ? (
          <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
        ) : (
          <div className="space-y-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
              <LucideUpload className="w-10 h-10 text-harvest-600" />
            </div>
            <p className="text-lg font-medium text-gray-600 group-hover:text-harvest-700">{t.uploadImage}</p>
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
        <div className="mt-8 flex flex-col items-center gap-3 text-harvest-600 animate-pulse">
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

// --- DASHBOARD HOME VIEW ---

const DashboardHome = ({ 
  lang, 
  user, 
  onViewProfile, 
  setView, 
  downloadCSV,
  onSelectBatch,
  onDeleteBatch
}: { 
  lang: Language, 
  user: FarmerProfile, 
  onViewProfile: () => void, 
  setView: (v: ViewState) => void,
  downloadCSV: (b: CropBatch[]) => void,
  onSelectBatch: (b: CropBatch) => void,
  onDeleteBatch: (id: string) => void
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const activeBatches = user.batches.filter(b => b.status !== 'Sold' && b.status !== 'Lost');
  const historyBatches = user.batches.filter(b => b.status === 'Sold' || b.status === 'Lost');
  
  const displayedBatches = activeTab === 'active' ? activeBatches : historyBatches;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <DashboardHeader lang={lang} user={user} onViewProfile={onViewProfile} />

      {/* Feature Navigation Cards - BIG INTERFERENCE UPDATE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Add Harvest Card */}
        <button 
          onClick={() => setView('add-harvest')}
          className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-harvest-400 transition-all group text-left flex flex-col h-full min-h-[280px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-harvest-600 mb-6 group-hover:scale-110 transition-transform shadow-sm">
            <LucidePlus className="w-10 h-10" />
          </div>
          <h3 className="relative z-10 text-2xl font-bold text-gray-900 mb-3 group-hover:text-harvest-700">{t.addBatch}</h3>
          <p className="relative z-10 text-gray-500 text-base mb-6 flex-grow leading-relaxed">{t.featureAddDesc}</p>
          <div className="relative z-10 flex items-center text-harvest-600 font-bold text-lg group-hover:gap-2 transition-all">
            {t.getStarted} <LucideArrowRight className="w-5 h-5 ml-2" />
          </div>
        </button>

        {/* Weather Card */}
        <button 
          onClick={() => setView('weather')}
          className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-400 transition-all group text-left flex flex-col h-full min-h-[280px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform shadow-sm">
            <LucideCloudSun className="w-10 h-10" />
          </div>
          <h3 className="relative z-10 text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700">{t.weather}</h3>
          <p className="relative z-10 text-gray-500 text-base mb-6 flex-grow leading-relaxed">{t.featureWeatherDesc}</p>
          <div className="relative z-10 flex items-center text-blue-600 font-bold text-lg group-hover:gap-2 transition-all">
            View Forecast <LucideArrowRight className="w-5 h-5 ml-2" />
          </div>
        </button>

        {/* Scanner Card */}
        <button 
          onClick={() => setView('scanner')}
          className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-purple-400 transition-all group text-left flex flex-col h-full min-h-[280px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform shadow-sm">
            <LucideThermometer className="w-10 h-10" />
          </div>
          <h3 className="relative z-10 text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-700">{t.aiDoctor}</h3>
          <p className="relative z-10 text-gray-500 text-base mb-6 flex-grow leading-relaxed">{t.featureScannerDesc}</p>
          <div className="relative z-10 flex items-center text-purple-600 font-bold text-lg group-hover:gap-2 transition-all">
            Start Scan <LucideArrowRight className="w-5 h-5 ml-2" />
          </div>
        </button>
      </div>

      <MapDashboard lang={lang} />

      {/* Batches Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mt-10">
          <div className="flex bg-gray-100 p-1 rounded-xl">
             <button 
               onClick={() => setActiveTab('active')}
               className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               {t.activeHarvests}
             </button>
             <button 
               onClick={() => setActiveTab('history')}
               className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               {t.harvestHistory}
             </button>
          </div>
          
          <div className="flex items-center gap-4 p-2">
             <button 
                onClick={() => downloadCSV(user.batches)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-bold transition-colors shadow-sm text-sm"
              >
                <LucideDownload className="w-4 h-4" />
                CSV
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedBatches.length === 0 && (
             <div className="col-span-full py-12 text-center text-gray-400">
                <LucideWheat className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No records found.</p>
             </div>
          )}
          {displayedBatches.map(batch => (
            <div 
              key={batch.id} 
              onClick={() => onSelectBatch(batch)}
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all relative group cursor-pointer hover:-translate-y-1 ${activeTab === 'history' ? 'border-gray-200 opacity-90' : 'border-gray-100 hover:border-green-300'}`}
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-50 bg-gray-50/50">
                  {activeTab === 'active' ? (
                     <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${batch.status === 'At Risk' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                        {batch.status === 'At Risk' ? <LucideAlertTriangle className="w-3.5 h-3.5"/> : <LucideCheckCircle className="w-3.5 h-3.5"/>}
                        {batch.status === 'At Risk' ? t.riskHigh : t.riskLow}
                    </span>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${batch.outcome === 'Gain' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                       {batch.outcome === 'Gain' ? <LucideDollarSign className="w-3.5 h-3.5"/> : <LucideXCircle className="w-3.5 h-3.5"/>}
                       {batch.outcome === 'Gain' ? t.gain : t.loss}
                    </span>
                  )}
                  
                  {activeTab === 'history' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(confirm(t.confirmDelete)) onDeleteBatch(batch.id); }}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <LucideTrash2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  {activeTab === 'active' && (
                     <span className="text-xs text-gray-500 font-medium">{batch.harvestDate}</span>
                  )}
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{batch.cropType}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                    <LucideMapPin className="w-4 h-4 text-gray-400" /> 
                    {user.location.split(',')[0]}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <span className="block text-xs text-gray-400 mb-1">{t.weight}</span>
                      <span className="block text-xl font-bold text-gray-900">{batch.weight} <span className="text-sm font-normal text-gray-500">{t.unitKg}</span></span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <span className="block text-xs text-gray-400 mb-1">{t.storageMethod}</span>
                      <span className="block text-sm font-bold text-gray-900 truncate" title={batch.storageType}>{batch.storageType}</span>
                    </div>
                </div>
              </div>
              
              {batch.riskAnalysis && batch.status === 'At Risk' && activeTab === 'active' && (
                <div className="px-6 pb-6">
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-700 flex gap-2 items-start">
                      <LucideAlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      {batch.riskAnalysis}
                    </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};


const ProfileView = ({ lang, user, onUpdate, onLogout }: { lang: Language, user: FarmerProfile, onUpdate: (u: FarmerProfile) => void, onLogout: () => void }) => {
  const t = TRANSLATIONS[lang];
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!/^\d{11}$/.test(formData.mobile)) {
      setError(t.enterValidMobile);
      return;
    }
    if (formData.nid && formData.nid.length < 10) {
      setError("NID must be at least 10 digits");
      return;
    }
    
    setError('');
    onUpdate(formData);
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
    setIsEditing(false);
  };

  const handleChange = (field: keyof FarmerProfile, value: any) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const handleCropChange = (value: string) => {
    const crops = value.split(',').map(s => s.trim());
    handleChange('primaryCrops', crops);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleChange('profileImage', base64String);
        // Auto save for image
        onUpdate({ ...formData, profileImage: base64String });
        setSuccessMsg("Profile picture updated!");
        setTimeout(() => setSuccessMsg(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-r from-[#1a4d3a] to-[#286a4f] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group cursor-pointer" onClick={triggerImageUpload}>
            <div className="w-32 h-32 rounded-full border-4 border-white/20 bg-[#f2fcf0] flex items-center justify-center text-[#1a4d3a] shadow-lg overflow-hidden relative">
               {user.profileImage ? (
                 <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <LucideUser className="w-16 h-16" />
               )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <LucideCamera className="w-8 h-8 text-white" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </div>
          
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
            <p className="text-green-100 flex items-center justify-center md:justify-start gap-2 mb-4">
              <LucideMapPin className="w-4 h-4" /> {user.location}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm border border-white/20">
                {t.totalStock}: {user.totalStock} {t.unitKg}
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm border border-white/20">
                {t.batches}: {user.batches.length}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[140px]">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 bg-white text-[#1a4d3a] py-2 px-4 rounded-xl font-bold shadow hover:bg-green-50 transition-colors"
              >
                <LucideEdit3 className="w-4 h-4" /> {t.editProfile}
              </button>
            ) : (
              <div className="flex gap-2">
                 <button 
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-xl font-bold shadow hover:bg-green-600 transition-colors"
                >
                  <LucideSave className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setIsEditing(false); setFormData({...user}); setError(''); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/20 text-white py-2 px-4 rounded-xl font-bold shadow hover:bg-white/30 transition-colors"
                >
                  <LucideX className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg flex items-center gap-3 animate-pulse">
          <LucideAlertTriangle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}
      
      {successMsg && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg flex items-center gap-3 animate-bounce-short">
          <LucideCheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-green-700 font-medium">{successMsg}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
            <LucideUser className="w-5 h-5 text-harvest-600" />
            {t.personalInfo}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t.fullName}</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-harvest-500 focus:border-transparent transition-all"
                />
              ) : (
                <p className="text-lg font-medium text-gray-900">{user.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t.location}</label>
              {isEditing ? (
                <LocationEditor 
                  value={formData.location} 
                  onChange={(v) => handleChange('location', v)} 
                  lang={lang}
                />
              ) : (
                <p className="text-lg font-medium text-gray-900">{user.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t.mobileNumber}</label>
              <div className="flex items-center gap-3">
                <LucidePhone className="w-5 h-5 text-gray-400" />
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-harvest-500 focus:border-transparent transition-all"
                    placeholder="01XXXXXXXXX"
                    maxLength={11}
                  />
                ) : (
                  <p className="text-lg font-medium text-gray-900">{user.mobile}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t.nid}</label>
              <div className="flex items-center gap-3">
                <LucideCreditCard className="w-5 h-5 text-gray-400" />
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.nid || ''}
                    onChange={(e) => handleChange('nid', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-harvest-500 focus:border-transparent transition-all"
                    placeholder="Enter NID Number"
                  />
                ) : (
                  <p className="text-lg font-medium text-gray-900">{user.nid || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Farm Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
            <LucideSprout className="w-5 h-5 text-harvest-600" />
            {t.farmDetails}
          </h2>

           <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t.farmSize}</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.farmSize || ''}
                  onChange={(e) => handleChange('farmSize', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-harvest-500"
                  placeholder="e.g. 50 decimals"
                />
              ) : (
                <p className="text-lg font-medium text-gray-900">{user.farmSize || 'Not set'}</p>
              )}
            </div>
            
             <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t.soilType}</label>
              {isEditing ? (
                <select 
                  value={formData.soilType || ''}
                  onChange={(e) => handleChange('soilType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-harvest-500"
                >
                  <option value="">Select Soil Type</option>
                  <option value="Loamy">Loamy (Doash)</option>
                  <option value="Clay">Clay (Etel)</option>
                  <option value="Sandy">Sandy (Bele)</option>
                </select>
              ) : (
                <p className="text-lg font-medium text-gray-900">{user.soilType || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t.primaryCrops}</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.primaryCrops?.join(', ') || ''}
                  onChange={(e) => handleCropChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-harvest-500"
                  placeholder="e.g. Rice, Wheat, Potato"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.primaryCrops?.map((crop, i) => (
                    <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-100">
                      {crop}
                    </span>
                  )) || <p className="text-gray-400">Not set</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Card - Full Width */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
            <LucideLock className="w-5 h-5 text-harvest-600" />
            {t.security}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t.password}</label>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <input 
                    type="password" 
                    value={formData.password || ''}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-harvest-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-lg font-medium text-gray-900 tracking-widest">••••••••</p>
                )}
              </div>
            </div>
            
            {!isEditing && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
                <p className="flex items-start gap-2">
                  <LucideCheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  {t.passwordChanged}
                </p>
                <p className="flex items-start gap-2 mt-2">
                  <LucideCheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  {t.twoFactor}
                </p>
              </div>
            )}

            <button 
              onClick={onLogout}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 px-4 rounded-xl font-bold hover:bg-red-100 transition-colors border border-red-100"
            >
              <LucideLogOut className="w-4 h-4" /> {t.logout}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardHeader = ({ lang, user, onViewProfile }: { lang: Language, user: FarmerProfile, onViewProfile: () => void }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="bg-[#1a4d3a] rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-2xl mb-8">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-green-400 opacity-5 rounded-full blur-2xl"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
           <div className="w-24 h-24 rounded-full border-4 border-green-700/50 bg-[#286a4f] flex items-center justify-center shadow-xl overflow-hidden relative">
             {user.profileImage ? (
                <img src={user.profileImage} alt="User" className="w-full h-full object-cover" />
             ) : (
                <LucideUser className="w-10 h-10 text-green-100" />
             )}
           </div>
           <div>
             <h1 className="text-3xl md:text-4xl font-bold mb-2">
               {lang === 'en' ? `Welcome, ${user.name}` : `স্বাগতম, ${user.name}`}
             </h1>
             <p className="flex items-center gap-2 text-green-100 text-sm md:text-base mb-4 opacity-90">
               <LucideMapPin className="w-4 h-4" /> {user.location}
             </p>
             <div className="flex gap-3">
               <span className="flex items-center gap-1 bg-[#2e7d5d] px-3 py-1 rounded-full text-xs font-semibold text-green-50 border border-green-600">
                 <LucideAward className="w-3 h-3" /> {t.newFarmer}
               </span>
               <span className="flex items-center gap-1 bg-[#2e7d5d] px-3 py-1 rounded-full text-xs font-semibold text-green-50 border border-green-600">
                 <LucideSprout className="w-3 h-3" /> {t.firstHarvest}
               </span>
             </div>
             <button onClick={onViewProfile} className="mt-4 flex items-center gap-1 text-sm text-green-300 hover:text-white transition-colors font-medium group">
               {t.viewProfile} <LucideArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
        </div>

        <div className="bg-[#153e2e]/80 backdrop-blur-sm p-6 rounded-2xl border border-green-800/50 w-full md:w-auto md:min-w-[200px] text-center shadow-lg relative overflow-hidden">
           <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 rounded-full"></div>
           <div className="text-5xl font-bold mb-1 text-white relative z-10">{user.batches.filter(b=>b.status !== 'Sold' && b.status !== 'Lost').length}</div>
           <div className="text-xs uppercase tracking-widest text-green-300 font-semibold relative z-10">
             {t.currentCrops}
           </div>
        </div>
      </div>
    </div>
  );
};

const DemandBoard = ({ lang, demands, onAddDemand }: { lang: Language, demands: DemandPost[], onAddDemand: (d: DemandPost) => void }) => {
  const t = TRANSLATIONS[lang];
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    category: 'General',
    description: '',
    contact: ''
  });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    const post: DemandPost = {
      id: Date.now().toString(),
      farmerName: 'Me', 
      category: newPost.category as DemandCategory,
      title: newPost.title,
      description: newPost.description,
      date: new Date().toISOString().split('T')[0],
      contact: newPost.contact
    };
    onAddDemand(post);
    setShowForm(false);
    setNewPost({ title: '', category: 'General', description: '', contact: '' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
       <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.communityNeeds}</h1>
            <p className="text-gray-600">{t.communitySubtitle}</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg flex items-center gap-2"
          >
            <LucidePlus className="w-5 h-5" /> {t.postNeed}
          </button>
       </div>

       {showForm && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-fade-in-up">
               <h2 className="text-xl font-bold mb-4">{t.postNeed}</h2>
               <form onSubmit={handlePost} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t.title}</label>
                    <input required type="text" className="w-full p-2 border rounded-lg" value={newPost.title} onChange={e=>setNewPost({...newPost, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t.category}</label>
                    <select className="w-full p-2 border rounded-lg" value={newPost.category} onChange={e=>setNewPost({...newPost, category: e.target.value})}>
                       <option value="General">{t.general}</option>
                       <option value="Buyer Needed">{t.buyerNeeded}</option>
                       <option value="Storage Equipment">{t.storageHelp}</option>
                       <option value="Export Inquiry">{t.exportInfo}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t.description}</label>
                    <textarea required className="w-full p-2 border rounded-lg h-24" value={newPost.description} onChange={e=>setNewPost({...newPost, description: e.target.value})}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t.contactInfo}</label>
                    <input required type="text" className="w-full p-2 border rounded-lg" value={newPost.contact} onChange={e=>setNewPost({...newPost, contact: e.target.value})} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold">{t.cancel}</button>
                    <button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold">{t.submit}</button>
                  </div>
               </form>
            </div>
         </div>
       )}

       <div className="grid gap-4">
          {demands.map(post => (
             <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        post.category === 'Buyer Needed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        post.category === 'Storage Equipment' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                        'bg-gray-50 text-gray-700 border-gray-100'
                      }`}>
                        {post.category}
                      </span>
                      <span className="text-gray-400 text-sm">{post.date}</span>
                   </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                   <div className="flex items-center gap-2 text-sm text-gray-500">
                      <LucideUser className="w-4 h-4" /> {post.farmerName}
                   </div>
                   <button className="flex items-center gap-2 text-green-600 font-bold text-sm hover:underline">
                      <LucidePhone className="w-4 h-4" /> {post.contact}
                   </button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const MapDashboard = ({ lang }: { lang: Language }) => {
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const t = TRANSLATIONS[lang];
  const [showPublicProfile, setShowPublicProfile] = useState(false);

  // Mock function to route to public profile
  const handleViewPublicProfile = () => {
    // In a real app, this would use the pin ID to fetch data
    setShowPublicProfile(true);
  };

  if (showPublicProfile) {
     const mockPublicUser: FarmerProfile = {
       id: selectedPin?.id || 'public',
       name: selectedPin?.name || 'Farmer',
       location: 'Public Location',
       coordinates: {x:0, y:0},
       totalStock: selectedPin?.stock || 0,
       batches: [],
       mobile: '01XXXXXXXXX',
       primaryCrops: ['Rice', 'Wheat']
     };
     return (
       <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="p-4">
             <button onClick={() => setShowPublicProfile(false)} className="mb-4 flex items-center gap-2 text-gray-600">
               <LucideArrowLeft className="w-5 h-5"/> Back to Map
             </button>
             <ProfileView lang={lang} user={mockPublicUser} onUpdate={()=>{}} onLogout={()=>{}} />
          </div>
       </div>
     )
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden h-[500px] relative group">
      {/* Map Background Layer */}
      <div className="absolute inset-0 bg-[#eef2f3]">
        
        {/* Water / River */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#b9d3c2] opacity-0"></div> {/* Removed placeholder */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
           <path d="M-10 100 C 200 100, 300 300, 500 200 S 800 100, 1000 300 V 600 H -10 Z" fill="#aadaff" />
        </svg>

        {/* Parks */}
        <div className="absolute top-20 left-20 w-64 h-48 bg-[#c5e8c5] rounded-3xl opacity-80" style={{borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%'}}></div>
        <div className="absolute bottom-10 right-32 w-40 h-40 bg-[#c5e8c5] rounded-full opacity-80"></div>

        {/* Roads */}
        <div className="absolute top-1/2 left-0 w-full h-6 bg-white border-y-2 border-gray-200 transform -translate-y-1/2 -rotate-2"></div>
        <div className="absolute top-0 left-1/3 h-full w-5 bg-white border-x-2 border-gray-200 transform skew-x-12"></div>
        
        <div className="absolute top-2/3 left-0 w-1/2 h-4 bg-white border-y border-gray-200 rotate-12"></div>
        <div className="absolute top-0 right-1/4 h-1/2 w-4 bg-white border-x border-gray-200"></div>

        {/* Labels (Mock) */}
        <div className="absolute top-1/2 left-10 text-gray-400 font-bold text-xs uppercase tracking-widest rotate-[-2deg]">Highway N1</div>
        <div className="absolute bottom-20 right-10 text-[#2a6b46] font-bold text-xs">National Park</div>
      </div>

      {/* Pins */}
      {MOCK_PINS.map((pin) => (
         <button
            key={pin.id}
            onClick={() => setSelectedPin(pin)}
            className={`absolute transform -translate-x-1/2 -translate-y-full group focus:outline-none transition-all duration-300 z-50`}
            style={{ 
              left: `${pin.x}%`, 
              top: `${pin.y}%`
            }}
          >
            <div className={`relative flex items-center justify-center w-10 h-10 ${pin.risk ? 'text-red-500' : 'text-harvest-600'} drop-shadow-lg hover:scale-110 transition-transform`}>
              <LucideMapPin className="w-10 h-10 fill-current" />
              <div className={`absolute top-full w-3 h-1.5 bg-black/20 rounded-full blur-[1px]`}></div>
            </div>
         </button>
      ))}
      
      {/* UI Controls (Zoom, My Location) mimicking G-Maps */}
      <div className="absolute bottom-8 right-4 flex flex-col gap-2">
         <button className="bg-white p-2 rounded shadow hover:bg-gray-50 text-gray-600"><LucidePlus className="w-5 h-5"/></button>
         <button className="bg-white p-2 rounded shadow hover:bg-gray-50 text-gray-600"><LucideMinus className="w-5 h-5"/></button>
      </div>
      <button className="absolute bottom-28 right-4 bg-white p-2 rounded shadow hover:bg-gray-50 text-blue-600">
         <LucideCrosshair className="w-5 h-5"/>
      </button>

      {/* Overlay Title */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg text-xs space-y-2 z-10 border border-white/50">
          <div className="font-bold text-gray-700 text-sm flex items-center gap-2">
            <LucideMap className="w-4 h-4"/> {t.mapView}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-harvest-500"></span> {t.riskLow}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span> {t.riskHigh}
          </div>
      </div>

      {/* Floating Card for Pin Details */}
      {selectedPin && (
        <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-5 border border-white/50 animate-fade-in-up z-50">
          <button 
            onClick={() => setSelectedPin(null)}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full"
          >
            <LucideX className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md ${selectedPin.risk ? 'bg-red-500' : 'bg-harvest-500'}`}>
              {selectedPin.name[0]}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{selectedPin.name}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1"><LucideMapPin className="w-3 h-3" /> Location {selectedPin.id}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="text-xs text-gray-500">{t.weight}</div>
                <div className="font-bold text-gray-900">{selectedPin.stock} {t.unitKg}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="text-xs text-gray-500">{t.status}</div>
                <div className={`text-xs font-bold ${selectedPin.risk ? 'text-red-600' : 'text-green-600'}`}>
                  {selectedPin.risk ? t.riskHigh : t.riskLow}
                </div>
              </div>
          </div>

          <button 
            onClick={handleViewPublicProfile}
            className="w-full py-2.5 bg-[#1a4d3a] text-white rounded-xl text-sm font-medium hover:bg-[#153e2e] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
          >
            {t.viewFullProfile} <LucideArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

const BatchDetailsModal = ({ 
  batch, 
  onClose, 
  lang,
  onUpdateStatus
}: { 
  batch: CropBatch, 
  onClose: () => void, 
  lang: Language,
  onUpdateStatus: (id: string, status: 'Sold' | 'Lost', outcome: 'Gain' | 'Loss') => void
}) => {
  const t = TRANSLATIONS[lang];
  // Only show actions if active
  const isActive = batch.status !== 'Sold' && batch.status !== 'Lost';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-fade-in-up">
          <div className="bg-[#1a4d3a] px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <LucideWheat className="w-6 h-6" />
              {batch.cropType}
            </h3>
            <button onClick={onClose} className="text-green-100 hover:text-white transition-colors">
              <LucideX className="w-6 h-6" />
            </button>
          </div>
          
          <div className="px-6 py-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                 <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><LucideFileText className="w-3 h-3" /> {t.batchId}</div>
                 <div className="font-medium text-gray-900 break-all">{batch.id}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                 <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><LucideCalendar className="w-3 h-3" /> {t.harvestDate}</div>
                 <div className="font-medium text-gray-900">{batch.harvestDate}</div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
               <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                 <span className="text-gray-600 font-medium">{t.weight}</span>
                 <span className="font-bold text-lg">{batch.weight} {t.unitKg}</span>
               </div>
               <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                 <span className="text-gray-600 font-medium">{t.storageMethod}</span>
                 <span className="font-bold text-gray-800">{batch.storageType}</span>
               </div>
               <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                 <span className="text-gray-600 font-medium">{t.status}</span>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${batch.status === 'At Risk' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                    {batch.status === 'At Risk' ? <LucideAlertTriangle className="w-3 h-3"/> : <LucideCheckCircle className="w-3 h-3"/>}
                    {batch.status === 'At Risk' ? t.riskHigh : t.riskLow}
                 </span>
               </div>
            </div>

            {batch.status === 'At Risk' && batch.riskAnalysis && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                 <h4 className="text-red-800 font-bold text-sm mb-2 flex items-center gap-2">
                   <LucideAlertTriangle className="w-4 h-4" /> {t.riskAnalysisLabel}
                 </h4>
                 <p className="text-sm text-red-700">{batch.riskAnalysis}</p>
              </div>
            )}

            {isActive && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">{t.finalizeHarvest}</h4>
                <div className="grid grid-cols-2 gap-3">
                   <button 
                     onClick={() => { onUpdateStatus(batch.id, 'Sold', 'Gain'); onClose(); }}
                     className="flex items-center justify-center gap-2 py-2 bg-green-100 text-green-700 rounded-lg font-bold hover:bg-green-200 transition-colors"
                   >
                     <LucideDollarSign className="w-4 h-4"/> {t.markSold}
                   </button>
                   <button 
                     onClick={() => { onUpdateStatus(batch.id, 'Lost', 'Loss'); onClose(); }}
                     className="flex items-center justify-center gap-2 py-2 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200 transition-colors"
                   >
                     <LucideAlertTriangle className="w-4 h-4"/> {t.reportLoss}
                   </button>
                </div>
              </div>
            )}
            
            <button 
              onClick={onClose}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WelcomeScreen = ({ lang, setLang, onStart }: { lang: Language, setLang: (l: Language) => void, onStart: () => void }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-[#1a4d3a] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 opacity-5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="relative z-10 flex flex-col items-center max-w-md w-full animate-fade-in-up">
        <div className="bg-white p-6 rounded-3xl shadow-2xl mb-8">
           <SaveSonaliLogo className="w-24 h-24" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          {t.appName}
        </h1>
        <p className="text-green-100 text-lg mb-8 leading-relaxed">
          {t.welcomeSubtitle}
        </p>
        
        <div className="w-full space-y-4">
          <button 
            onClick={onStart}
            className="w-full bg-[#fbbf24] text-[#1a4d3a] font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-yellow-400 transition-all transform hover:scale-105"
          >
            {t.getStarted}
          </button>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="w-full bg-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/10"
          >
            <LucideGlobe className="w-5 h-5" />
            {lang === 'en' ? 'Switch to Bangla' : 'বাংলায় দেখুন'}
          </button>
        </div>
        
        <p className="mt-8 text-green-200/60 text-sm">
          Empowering Farmers • Securing Food
        </p>
      </div>
    </div>
  );
};

const AuthScreen = ({ lang, onLogin, type }: { lang: Language, onLogin: () => void, type: 'login' | 'register' }) => {
  const t = TRANSLATIONS[lang];
  const [mode, setMode] = useState<'login' | 'register'>(type);
  
  useEffect(() => {
    setMode(type);
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
       <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
          <div className="p-8 w-full">
             <div className="flex justify-center mb-6">
               <SaveSonaliLogo className="w-12 h-12" />
             </div>
             
             <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
               {mode === 'login' ? t.welcomeBack : t.createAccount}
             </h2>
             <p className="text-center text-gray-500 mb-8 text-sm">
               {mode === 'login' ? t.loginMessage : t.joinMessage}
             </p>
             
             <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.fullName}</label>
                    <div className="relative">
                      <LucideUser className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input type="text" className="w-full pl-10 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder={t.fullName} />
                    </div>
                  </div>
                )}
                
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">{t.username}</label>
                   <div className="relative">
                      <LucideMail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input type="text" className="w-full pl-10 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder={t.emailPlaceholder} defaultValue="demo" />
                   </div>
                </div>
                
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
                   <div className="relative">
                      <LucideLock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input type="password" className="w-full pl-10 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder={t.passwordPlaceholder} defaultValue="password" />
                   </div>
                </div>

                {mode === 'register' && (
                   <div className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" id="terms" className="rounded text-green-600 focus:ring-green-500" />
                      <label htmlFor="terms">{t.termsAgree}</label>
                   </div>
                )}
                
                <button type="submit" className="w-full bg-[#1a4d3a] text-white font-bold py-3 rounded-xl hover:bg-[#153e2e] transition-colors shadow-lg">
                   {mode === 'login' ? t.login : t.registerNow}
                </button>
             </form>
             
             <div className="mt-6 text-center text-sm">
                {mode === 'login' ? (
                   <p className="text-gray-500">
                     {t.newToApp} <button onClick={() => setMode('register')} className="text-green-700 font-bold hover:underline">{t.registerNow}</button>
                   </p>
                ) : (
                   <p className="text-gray-500">
                     {t.alreadyHaveAccount} <button onClick={() => setMode('login')} className="text-green-700 font-bold hover:underline">{t.login}</button>
                   </p>
                )}
             </div>
             
             <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                 <button onClick={onLogin} className="text-xs text-gray-400 hover:text-gray-600 font-medium">
                    {t.skipSetup}
                 </button>
             </div>
          </div>
       </div>
    </div>
  );
};

// --- MAIN APP ---

function App() {
  const [view, setView] = useState<ViewState>('welcome');
  const [lang, setLang] = useState<Language>('en');
  
  // User Profile State
  const [user, setUser] = useState<FarmerProfile>({
    id: 'u1',
    name: 'OMI',
    location: 'Hathazari, Chattogram',
    coordinates: { x: 45, y: 30 },
    totalStock: 1700,
    batches: INITIAL_BATCHES,
    mobile: '01712345678', // Default Mock Mobile
    nid: '1990123456789', // Default Mock NID
    password: 'password123',
    farmSize: '120 Decimals',
    soilType: 'Loamy',
    primaryCrops: ['Rice', 'Potato']
  });

  const [demands, setDemands] = useState<DemandPost[]>(INITIAL_DEMANDS);
  const [selectedBatch, setSelectedBatch] = useState<CropBatch | null>(null);

  const handleStart = () => {
    setView('login');
  };

  const handleLogin = () => {
    setView('dashboard');
  };
  
  const handleLogout = () => {
    setView('welcome');
  };

  const handleUpdateProfile = (updatedUser: FarmerProfile) => {
    setUser(updatedUser);
  };

  const addBatch = (batch: CropBatch) => {
    const updatedBatches = [batch, ...user.batches];
    const updatedStock = user.totalStock + batch.weight;
    setUser({ ...user, batches: updatedBatches, totalStock: updatedStock });
    // Go back to dashboard after adding
    setView('dashboard');
  };
  
  const deleteBatch = (id: string) => {
    const updatedBatches = user.batches.filter(b => b.id !== id);
    // Recalculate stock - subtract only active batches
    const deletedBatch = user.batches.find(b => b.id === id);
    let newStock = user.totalStock;
    if (deletedBatch && deletedBatch.status !== 'Sold' && deletedBatch.status !== 'Lost') {
       newStock -= deletedBatch.weight;
    }
    setUser({ ...user, batches: updatedBatches, totalStock: newStock });
  };
  
  const updateBatchStatus = (id: string, status: 'Sold' | 'Lost', outcome: 'Gain' | 'Loss') => {
    const updatedBatches = user.batches.map(b => 
      b.id === id ? { ...b, status: status, outcome: outcome } : b
    );
    // If sold or lost, remove from total active stock
    const batch = user.batches.find(b => b.id === id);
    let newStock = user.totalStock;
    if (batch) {
       newStock -= batch.weight;
    }
    setUser({ ...user, batches: updatedBatches, totalStock: newStock });
  };

  const addDemand = (post: DemandPost) => {
    setDemands([post, ...demands]);
  };

  const downloadCSV = (batches: CropBatch[]) => {
    const headers = ['ID', 'Crop Type', 'Weight (kg)', 'Harvest Date', 'Storage Type', 'Status', 'Outcome'];
    const rows = batches.map(b => [b.id, b.cropType, b.weight, b.harvestDate, b.storageType, b.status, b.outcome || '']);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `harvest_data_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render Logic
  let content;
  if (view === 'welcome') {
    return <WelcomeScreen lang={lang} setLang={setLang} onStart={handleStart} />;
  }
  else if (view === 'login' || view === 'register') {
    return <AuthScreen lang={lang} onLogin={handleLogin} type={view === 'login' ? 'login' : 'register'} />;
  }
  else if (view === 'profile') {
    content = <ProfileView lang={lang} user={user} onUpdate={handleUpdateProfile} onLogout={handleLogout} />;
  }
  else if (view === 'community') {
    content = <DemandBoard lang={lang} demands={demands} onAddDemand={addDemand} />;
  }
  else if (view === 'weather') {
    content = <WeatherView lang={lang} onBack={() => setView('dashboard')} />;
  }
  else if (view === 'scanner') {
    content = <ScannerView lang={lang} onBack={() => setView('dashboard')} />;
  }
  else if (view === 'add-harvest') {
    content = <AddHarvestView lang={lang} onBack={() => setView('dashboard')} onAdd={addBatch} />;
  }
  else {
    // Dashboard (Default)
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
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar lang={lang} setLang={setLang} setView={setView} currentView={view} onLogout={handleLogout} />
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
