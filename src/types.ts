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
    standard: { name: string; emoji: string; description: string; reasoning: string };
    tropical: { name: string; emoji: string; description: string; reasoning: string };
    veggies: { name: string; emoji: string; description: string; reasoning: string };
  };
}

export interface BabyUpdate {
  month: number;
  title: string;
  description: string;
  milestones: string[];
  tips: string[];
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
