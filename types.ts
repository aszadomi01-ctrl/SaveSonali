

export type Language = 'en' | 'bn';

export interface FarmerProfile {
  id: string;
  name: string;
  location: string; // Division/District
  coordinates: { x: number; y: number }; // Percentage for the mock map
  totalStock: number; // in kg
  batches: CropBatch[];
  mobile: string;
  nid?: string;
  password?: string; // Mock password field for the UI demo
  farmSize?: string;
  soilType?: string;
  primaryCrops?: string[];
  profileImage?: string; // Base64 string for profile picture
}

export interface CropBatch {
  id: string;
  cropType: string;
  weight: number;
  harvestDate: string;
  storageType: 'Silo' | 'Jute Bag' | 'Open Air' | 'Cold Storage';
  status: 'Fresh' | 'At Risk' | 'Sold' | 'Lost'; // Added Sold/Lost statuses
  outcome?: 'Gain' | 'Loss'; // Track financial/yield outcome
  imageUrl?: string;
  riskAnalysis?: string;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  rainChance: number;
  condition: string;
  advisory: string;
}

export interface MapPin {
  id: string;
  x: number;
  y: number;
  name: string;
  stock: number;
  risk: boolean;
}

export type DemandCategory = 'Buyer Needed' | 'Storage Equipment' | 'Export Inquiry' | 'General';

export interface DemandPost {
  id: string;
  farmerName: string;
  category: DemandCategory;
  title: string;
  description: string;
  date: string;
  contact: string;
}

// Translation Dictionary
export const TRANSLATIONS = {
  en: {
    appName: "SaveSonali",
    welcomeTitle: "Welcome to SaveSonali!",
    welcomeSubtitle: "We're glad you're here to make a difference in Bangladesh's food security.",
    joinMessage: "Join SaveSonali. Reduce Food Loss, Nourish Bangladesh.",
    loginMessage: "Log in to continue securing food and empowering communities.",
    createAccount: "Create Account",
    welcomeBack: "Welcome Back",
    username: "Username",
    emailPlaceholder: "Email or Username",
    passwordPlaceholder: "Password",
    termsAgree: "I agree to the Terms of Service.",
    registerNow: "Register Now",
    newToApp: "New to SaveSonali? Create an account.",
    alreadyHaveAccount: "Already have an account? Sign In",
    
    getStarted: "Get Started",
    skipSetup: "Skip setup and go to Dashboard",
    
    login: "Sign In",
    dashboard: "Dashboard",
    myCrops: "My Harvest",
    addBatch: "Log New Harvest",
    weather: "Weather & Forecast",
    aiDoctor: "Crop Doctor AI",
    mapView: "Regional Storage Map",
    storageAdvice: "Storage Advice",
    logout: "Log Out",
    backToDashboard: "Back to Dashboard",
    
    cropType: "Crop Type",
    weight: "Weight",
    unitKg: "kg",
    totalStock: "Total Stock",
    currentCrops: "Current Crops",
    harvestDate: "Harvest Date",
    storageMethod: "Storage Method",
    status: "Status",
    
    submit: "Save Record",
    analyzing: "AI Analyzing...",
    riskHigh: "High Risk",
    riskLow: "Safe",
    uploadImage: "Upload Crop Photo",
    askAI: "Ask Gemini for Advice",
    loading: "Loading...",
    location: "Location",
    exportGrade: "Export Grade",
    
    communityNeeds: "Community Needs",
    communitySubtitle: "Connect with buyers, suppliers, and other farmers.",
    postNeed: "Post a Need",
    category: "Category",
    description: "Description",
    contactInfo: "Contact Info",
    buyerNeeded: "Buyer Needed",
    storageHelp: "Storage Help",
    exportInfo: "Export Inquiry",
    general: "General",
    respond: "Contact Farmer",
    postedBy: "Posted by",
    title: "Title",
    cancel: "Cancel",
    
    profile: "Profile",
    viewProfile: "View Profile",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    nid: "NID Card No",
    mobileNumber: "Mobile Number",
    fullName: "Full Name",
    password: "Password",
    changePassword: "Change Password",
    personalInfo: "Personal Information",
    security: "Security",
    enterValidMobile: "Please enter a valid 11-digit mobile number.",
    passwordChanged: "Password last changed 30 days ago.",
    twoFactor: "Two-factor authentication is enabled.",
    
    // Farm Details
    farmDetails: "Farm Details",
    farmSize: "Farm Size (Decimal/Acres)",
    soilType: "Soil Type",
    primaryCrops: "Primary Crops",
    
    // Map & Weather
    selectPin: "Select a pin on the map to view storage details.",
    contactFarmer: "Contact Farmer",
    humidity: "Humidity",
    rainChance: "Rain",
    highHumidityAlert: "High humidity alert! Check jute bags for moisture to prevent mold.",
    forecast: "3-Day Forecast",
    today: "Today",
    tomorrow: "Tomorrow",
    sunday: "Sunday",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    wind: "Wind",
    sunny: "Sunny",
    partlyCloudy: "Partly Cloudy",
    rainExpected: "Rain Expected",

    // Status
    newFarmer: "New Farmer",
    firstHarvest: "First Harvest",
    batches: "Batches",

    // Modal
    batchDetails: "Batch Details",
    close: "Close",
    riskAnalysisLabel: "Risk Analysis",
    batchId: "Batch ID",
    viewFullProfile: "View Full Profile",
    
    // Features
    featureWeatherDesc: "Check humidity and rain alerts to protect your stock.",
    featureScannerDesc: "Detect diseases and get instant storage advice.",
    featureAddDesc: "Log a new harvest to track inventory and sales.",

    // History & Actions
    activeHarvests: "Active Harvests",
    harvestHistory: "Harvest History",
    markSold: "Mark Sold",
    reportLoss: "Report Loss",
    delete: "Delete",
    gain: "Gain",
    loss: "Loss",
    outcome: "Outcome",
    finalizeHarvest: "Finalize Harvest",
    confirmDelete: "Are you sure you want to delete this record?",
    postCodeOptional: "Post Code (Optional)",
  },
  bn: {
    appName: "সেভসোনালী",
    welcomeTitle: "সেভসোনালী-তে স্বাগতম!",
    welcomeSubtitle: "বাংলাদেশের খাদ্য নিরাপত্তা নিশ্চিতে আপনার অংশগ্রহণে আমরা আনন্দিত।",
    joinMessage: "সেভসোনালী-তে যোগ দিন। খাদ্য অপচয় রোধ করুন, বাংলাদেশকে সমৃদ্ধ করুন।",
    loginMessage: "খাদ্য সুরক্ষা এবং সম্প্রদায়কে ক্ষমতায়ন করতে লগ ইন করুন।",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    welcomeBack: "ফিরে আসায় স্বাগতম",
    username: "ব্যবহারকারীর নাম",
    emailPlaceholder: "ইমেল বা ব্যবহারকারীর নাম",
    passwordPlaceholder: "পাসওয়ার্ড",
    termsAgree: "আমি ব্যবহারের শর্তাবলী মেনে চলছি।",
    registerNow: "নিবন্ধন করুন",
    newToApp: "সেভসোনালী-তে নতুন? অ্যাকাউন্ট তৈরি করুন।",
    alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে? লগ ইন করুন",
    
    getStarted: "শুরু করুন",
    skipSetup: "সেটআপ এড়িয়ে ড্যাশবোর্ডে যান",
    
    login: "লগ ইন",
    dashboard: "ড্যাশবোর্ড",
    myCrops: "আমার ফসল",
    addBatch: "নতুন ফসল যোগ করুন",
    weather: "আবহাওয়া ও পূর্বাভাস",
    aiDoctor: "শস্য ডাক্তার (AI)",
    mapView: "আঞ্চলিক ম্যাপ",
    storageAdvice: "সংরক্ষণ পরামর্শ",
    logout: "লগ আউট",
    backToDashboard: "ড্যাশবোর্ডে ফিরে যান",
    
    cropType: "ফসলের ধরন",
    weight: "ওজন",
    unitKg: "কেজি",
    totalStock: "মোট মজুদ",
    currentCrops: "বর্তমান ফসল",
    harvestDate: "ফসল কাটার তারিখ",
    storageMethod: "সংরক্ষণ পদ্ধতি",
    status: "অবস্থা",
    
    submit: "সংরক্ষণ করুন",
    analyzing: "বিশ্লেষণ করা হচ্ছে...",
    riskHigh: "ঝুঁকিপূর্ণ",
    riskLow: "নিরাপদ",
    uploadImage: "ফসলের ছবি আপলোড করুন",
    askAI: "জেমিনি পরামর্শ নিন",
    loading: "লোড হচ্ছে...",
    location: "অবস্থান",
    exportGrade: "রপ্তানিযোগ্য",
    
    communityNeeds: "কমিউনিটি চাহিদা",
    communitySubtitle: "ক্রেতা, সরবরাহকারী এবং অন্য কৃষকদের সাথে সংযোগ করুন।",
    postNeed: "চাহিদা পোস্ট করুন",
    category: "বিভাগ",
    description: "বিবরণ",
    contactInfo: "যোগাযোগের তথ্য",
    buyerNeeded: "ক্রেতা প্রয়োজন",
    storageHelp: "সংরক্ষণ সহায়তা",
    exportInfo: "রপ্তানি তথ্য",
    general: "সাধারণ",
    respond: "যোগাযোগ করুন",
    postedBy: "পোস্ট করেছেন",
    title: "শিরোনাম",
    cancel: "বাতিল",
    
    profile: "প্রোফাইল",
    viewProfile: "প্রোফাইল দেখুন",
    editProfile: "সম্পাদনা করুন",
    saveChanges: "পরিবর্তন সংরক্ষণ করুন",
    nid: "জাতীয় পরিচয়পত্র নং",
    mobileNumber: "মোবাইল নম্বর",
    fullName: "পুরো নাম",
    password: "পাসওয়ার্ড",
    changePassword: "পাসওয়ার্ড পরিবর্তন",
    personalInfo: "ব্যক্তিগত তথ্য",
    security: "নিরাপত্তা",
    enterValidMobile: "দয়া করে সঠিক ১১-সংখ্যার মোবাইল নম্বর দিন।",
    passwordChanged: "শেষ পাসওয়ার্ড পরিবর্তন ৩০ দিন আগে।",
    twoFactor: "দ্বি-স্তরের প্রমাণীকরণ চালু আছে।",
    
    // Farm Details
    farmDetails: "খামারের বিবরণ",
    farmSize: "খামারের আকার (শতক/একর)",
    soilType: "মাটির ধরন",
    primaryCrops: "প্রধান ফসল",
    
    // Map & Weather
    selectPin: "সংরক্ষণ বিবরণ দেখতে মানচিত্রের একটি পিনে ক্লিক করুন।",
    contactFarmer: "কৃষকের সাথে যোগাযোগ করুন",
    humidity: "আর্দ্রতা",
    rainChance: "বৃষ্টি",
    highHumidityAlert: "উচ্চ আর্দ্রতা সতর্কতা! ছাতা পড়া রোধ করতে পাটের বস্তা পরীক্ষা করুন।",
    forecast: "৩ দিনের পূর্বাভাস",
    today: "আজ",
    tomorrow: "আগামীকাল",
    sunday: "রবিবার",
    monday: "সোমবার",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    wind: "বাতাস",
    sunny: "রৌদ্রোজ্জ্বল",
    partlyCloudy: "আংশিক মেঘলা",
    rainExpected: "বৃষ্টির সম্ভাবনা",

    // Status
    newFarmer: "নতুন কৃষক",
    firstHarvest: "প্রথম ফসল",
    batches: "ব্যাচ",

    // Modal
    batchDetails: "ব্যাচ বিস্তারিত",
    close: "বন্ধ করুন",
    riskAnalysisLabel: "ঝুঁকি বিশ্লেষণ",
    batchId: "ব্যাচ আইডি",
    viewFullProfile: "প্রোফাইল দেখুন",

    // Features
    featureWeatherDesc: "আর্দ্রতা এবং বৃষ্টির সতর্কতা পরীক্ষা করুন।",
    featureScannerDesc: "রোগ সনাক্ত করুন এবং সংরক্ষণের পরামর্শ নিন।",
    featureAddDesc: "মজুদ এবং বিক্রয় ট্র্যাক করতে নতুন ফসল যোগ করুন।",

    // History & Actions
    activeHarvests: "সক্রিয় ফসল",
    harvestHistory: "ফসল ইতিহাস",
    markSold: "বিক্রয় চিহ্নিত করুন",
    reportLoss: "ক্ষতি রিপোর্ট করুন",
    delete: "মুছে ফেলুন",
    gain: "লাভ",
    loss: "ক্ষতি",
    outcome: "ফলাফল",
    finalizeHarvest: "ফসল চূড়ান্ত করুন",
    confirmDelete: "আপনি কি নিশ্চিত যে আপনি এই রেকর্ডটি মুছে ফেলতে চান?",
    postCodeOptional: "পোস্ট কোড (ঐচ্ছিক)",
  }
};