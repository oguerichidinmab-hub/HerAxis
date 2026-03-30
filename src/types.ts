export enum UserStage {
  PREGNANT = 'PREGNANT',
  NEW_MOM = 'NEW_MOM',
}

export interface UserProfile {
  name: string;
  stage: UserStage;
  stageValue: number; // Week of pregnancy or month of baby
  dueDate?: string;
  babyBirthDate?: string;
  preferences: {
    largeText: boolean;
    simpleUI: boolean;
    voiceGuidance: boolean;
    fruitTheme: 'standard' | 'tropical' | 'veggies';
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
    standard: { name: string; emoji: string; description: string };
    tropical: { name: string; emoji: string; description: string };
    veggies: { name: string; emoji: string; description: string };
  };
}

export interface BabyUpdate {
  month: number;
  title: string;
  description: string;
  milestones: string[];
  tips: string[];
}

export interface ForumPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  category: 'Pregnancy' | 'Baby' | 'Postpartum' | 'General';
}

export interface NutritionTip {
  id: string;
  title: string;
  content: string;
  mealSuggestion: string;
}
