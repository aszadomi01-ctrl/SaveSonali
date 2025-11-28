
import { FarmerProfile, DemandPost, CropBatch, MapPin } from '../types';

// Storage Keys
const KEYS = {
  PROFILE: 'savesonali_profile_v1',
  DEMANDS: 'savesonali_demands_v1',
  PINS: 'savesonali_pins_v1'
};

// Initial Data Seeds (Moved from App.tsx)
const INITIAL_BATCHES: CropBatch[] = [
  { id: 'b1', cropType: 'Rice (Boro)', weight: 500, harvestDate: '2025-02-10', storageType: 'Silo', status: 'Fresh' },
  { id: 'b2', cropType: 'Wheat', weight: 200, harvestDate: '2025-01-20', storageType: 'Jute Bag', status: 'At Risk', riskAnalysis: 'High moisture detected. Dry immediately.' },
  { id: 'b3', cropType: 'Potato', weight: 1000, harvestDate: '2025-02-15', storageType: 'Cold Storage', status: 'Fresh' },
  { id: 'b4', cropType: 'Corn', weight: 800, harvestDate: '2024-11-05', storageType: 'Open Air', status: 'Sold', outcome: 'Gain' },
];

const INITIAL_PROFILE: FarmerProfile = {
  id: 'u1',
  name: 'OMI',
  location: 'Hathazari, Chattogram',
  coordinates: { x: 45, y: 30 },
  totalStock: 1700,
  batches: INITIAL_BATCHES,
  mobile: '01712345678',
  nid: '1990123456789',
  password: 'password123',
  farmSize: '120 Decimals',
  soilType: 'Loamy',
  primaryCrops: ['Rice', 'Potato']
};

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

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // --- User Profile ---
  getUserProfile: async (): Promise<FarmerProfile> => {
    await delay(300); // Simulate network
    const stored = localStorage.getItem(KEYS.PROFILE);
    if (stored) return JSON.parse(stored);
    
    // Seed initial data
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
    return INITIAL_PROFILE;
  },

  updateUserProfile: async (profile: FarmerProfile): Promise<FarmerProfile> => {
    await delay(300);
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    return profile;
  },

  // --- Demands ---
  getDemands: async (): Promise<DemandPost[]> => {
    await delay(300);
    const stored = localStorage.getItem(KEYS.DEMANDS);
    if (stored) return JSON.parse(stored);

    localStorage.setItem(KEYS.DEMANDS, JSON.stringify(INITIAL_DEMANDS));
    return INITIAL_DEMANDS;
  },

  addDemand: async (post: DemandPost): Promise<DemandPost[]> => {
    await delay(300);
    const current = await api.getDemands();
    const updated = [post, ...current];
    localStorage.setItem(KEYS.DEMANDS, JSON.stringify(updated));
    return updated;
  },

  // --- Reset (For Debugging) ---
  resetData: () => {
    localStorage.removeItem(KEYS.PROFILE);
    localStorage.removeItem(KEYS.DEMANDS);
    window.location.reload();
  }
};
