export enum UserStage {
  PREGNANT = 'PREGNANT',
  NEW_MOM = 'NEW_MOM',
}

export interface DoctorContact {
  name: string;
  hospital: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  specialty?: string;
  notes?: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: string; // e.g., "1.2 km"
  distanceValue: number; // for sorting
  phone: string;
  type: string; // e.g., "General Hospital", "Maternity Center"
  isOpen: boolean;
  availabilityStatus?: string; // e.g., "24/7 Emergency", "Open Now"
  isMaternalCare: boolean;
  isEmergencyCare: boolean;
  isRecommended?: boolean;
  openingHours: string;
  services: string[];
  description: string;
  lat?: number;
  lng?: number;
}

export interface Appointment {
  id: string;
  title: string;
  date: string; // ISO string
  time: string; // HH:mm
  type: 'pediatrician' | 'prenatal' | 'ultrasound' | 'vaccination' | 'other';
  notes?: string;
  reminded: boolean;
  syncToNative?: boolean;
  googleEventId?: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  title: string;
  content: string;
  mood?: string;
  symptoms?: string[];
  week?: number;
  month?: number;
  photos?: string[];
}

export interface UserProfile {
  name: string;
  stage: UserStage;
  stageValue: number; // Week of pregnancy or month of baby
  dueDate?: string;
  babyBirthDate?: string;
  babyName?: string;
  doctorContact?: DoctorContact;
  appointments?: Appointment[];
  journalEntries?: JournalEntry[];
  preferences: {
    largeText: boolean;
    simpleUI: boolean;
    voiceGuidance: boolean;
    fruitTheme: 'standard' | 'tropical' | 'veggies';
    googleSyncEnabled: boolean;
  };
}

export interface PregnancyUpdate {
  week: number;
  title: string;
  description: string;
  tips: string[];
  bodyChanges: string;
  trimester: number;
  developmentDetail: string;
  fruitSize: {
    standard: { name: string; emoji: string; description: string; reasoning: string };
    tropical: { name: string; emoji: string; description: string; reasoning: string };
    veggies: { name: string; emoji: string; description: string; reasoning: string };
  };
  nextActions: string[];
}

export interface BabyUpdate {
  month: number;
  title: string;
  description: string;
  milestones: string[];
  tips: string[];
  nextActions: string[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface ForumPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  category: 'Pregnancy questions' | 'New mom support' | 'Breastfeeding' | 'Emotional well-being' | 'Baby care' | 'Recovery after childbirth';
}

export interface NutritionTip {
  id: string;
  title: string;
  content: string;
  mealSuggestion: string;
  benefits: string[];
  nutrients: string[];
}

export interface PostpartumRecovery {
  id: string;
  title: string;
  description: string;
  tips: string[];
  warningSigns: string[];
  comments?: Comment[];
  selfCareExercises?: string[];
}
