import { PregnancyUpdate, BabyUpdate, ForumPost, NutritionTip } from './types';

export const PREGNANCY_UPDATES: PregnancyUpdate[] = [
  {
    week: 12,
    title: "End of First Trimester",
    description: "Your baby is now the size of a lime! All major organs are formed.",
    tips: ["Stay hydrated", "Gentle stretching", "Eat small, frequent meals"],
    bodyChanges: "You might notice your morning sickness fading and your energy returning.",
    trimester: 1,
    developmentDetail: "Your baby's brain, heart, and lungs are rapidly developing. They are now starting to make small movements, although you can't feel them yet. Their tiny fingers and toes are losing their webbing.",
    fruitSize: {
      standard: { name: "Lime", emoji: "🍋", description: "About 2 inches long and weighs about half an ounce." },
      tropical: { name: "Passion Fruit", emoji: "🫐", description: "Small but full of energy!" },
      veggies: { name: "Brussels Sprout", emoji: "🥬", description: "Tiny but mighty!" }
    }
  },
  {
    week: 24,
    title: "Viability Milestone",
    description: "Baby's lungs are developing and they can now hear your voice.",
    tips: ["Talk to your baby", "Monitor for swelling", "Check your iron levels"],
    bodyChanges: "Your 'baby bump' is likely very visible now. You might feel more kicks!",
    trimester: 2,
    developmentDetail: "Baby is now developing a regular sleep-wake cycle. Their skin is still thin and translucent but will soon start to thicken. They are practicing breathing by inhaling amniotic fluid into their developing lungs.",
    fruitSize: {
      standard: { name: "Ear of Corn", emoji: "🌽", description: "About 11.8 inches long and weighs about 1.3 pounds." },
      tropical: { name: "Papaya", emoji: "🥭", description: "Growing sweet and strong!" },
      veggies: { name: "Eggplant", emoji: "🍆", description: "Substantial and healthy!" }
    }
  },
  {
    week: 36,
    title: "Getting Ready",
    description: "Baby is gaining weight rapidly and getting into position for birth.",
    tips: ["Pack your hospital bag", "Practice breathing exercises", "Rest as much as possible"],
    bodyChanges: "You may feel more pressure in your pelvis as the baby drops.",
    trimester: 3,
    developmentDetail: "Most babies are now in a head-down position. Their liver and kidneys are fully functional, and their immune system is getting a boost from your antibodies. They are shedding the fine hair (lanugo) that covered their body.",
    fruitSize: {
      standard: { name: "Honeydew Melon", emoji: "🍈", description: "About 18.6 inches long and weighs about 5.8 pounds." },
      tropical: { name: "Large Pineapple", emoji: "🍍", description: "Almost ready to meet the world!" },
      veggies: { name: "Large Pumpkin", emoji: "🎃", description: "A big harvest is coming!" }
    }
  }
];

export const BABY_UPDATES: BabyUpdate[] = [
  {
    month: 1,
    title: "The Fourth Trimester",
    description: "Your baby is adjusting to life outside the womb. Lots of sleep and skin-to-skin contact.",
    milestones: ["Briefly lifting head", "Focusing on faces", "Startling at loud noises"],
    tips: ["Sleep when baby sleeps", "Accept help from others", "Keep track of wet diapers"]
  },
  {
    month: 6,
    title: "Starting Solids",
    description: "Baby is becoming more active and might be ready for their first tastes of food.",
    milestones: ["Sitting with support", "Rolling both ways", "Babbling consonant sounds"],
    tips: ["Introduce one food at a time", "Encourage tummy time", "Read books together"]
  }
];

export const FORUM_POSTS: ForumPost[] = [
  {
    id: '1',
    author: 'Mama Sarah',
    content: 'Has anyone else experienced sudden cravings for pickles and ice cream? Is it normal?',
    timestamp: '2 hours ago',
    likes: 12,
    comments: 5,
    category: 'Pregnancy'
  },
  {
    id: '2',
    author: 'NewMom_Joy',
    content: 'My 3-month-old finally slept through the night! There is light at the end of the tunnel!',
    timestamp: '5 hours ago',
    likes: 45,
    comments: 12,
    category: 'Baby'
  }
];

export const NUTRITION_TIPS: NutritionTip[] = [
  {
    id: '1',
    title: 'Iron-Rich Foods',
    content: 'Iron is crucial for your blood supply and baby\'s development.',
    mealSuggestion: 'Spinach and lentil soup with a squeeze of lemon for better absorption.'
  },
  {
    id: '2',
    title: 'Healthy Fats',
    content: 'DHA is essential for baby\'s brain and eye development.',
    mealSuggestion: 'Grilled salmon with avocado salad.'
  }
];
