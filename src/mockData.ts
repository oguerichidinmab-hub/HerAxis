import { PregnancyUpdate, BabyUpdate, ForumPost, NutritionTip, PostpartumRecovery } from './types';

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
      standard: { 
        name: "Lime", 
        emoji: "🍋", 
        description: "About 2 inches long and weighs about half an ounce.",
        reasoning: "At week 12, your baby is roughly 2 inches long from head to bottom. A lime perfectly matches this length and the small, firm shape of your baby at this stage."
      },
      tropical: { 
        name: "Passion Fruit", 
        emoji: "🫐", 
        description: "Small but full of energy!",
        reasoning: "Passion fruit is chosen for its similar weight and size to a 12-week fetus, representing the concentrated growth happening right now."
      },
      veggies: { 
        name: "Brussels Sprout", 
        emoji: "🥬", 
        description: "Tiny but mighty!",
        reasoning: "A Brussels sprout is a great visual for the compact but complex structure of your baby, who now has all their major organs formed."
      }
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
      standard: { 
        name: "Ear of Corn", 
        emoji: "🌽", 
        description: "About 11.8 inches long and weighs about 1.3 pounds.",
        reasoning: "Your baby is getting longer! An ear of corn represents the length of your baby from head to heel, which is about 12 inches now."
      },
      tropical: { 
        name: "Papaya", 
        emoji: "🥭", 
        description: "Growing sweet and strong!",
        reasoning: "A papaya matches the weight and the 'filling out' shape of your baby as they start to gain more fat."
      },
      veggies: { 
        name: "Eggplant", 
        emoji: "🍆", 
        description: "Substantial and healthy!",
        reasoning: "The eggplant is a classic comparison for week 24 because its weight and length closely mirror a developing fetus at this milestone."
      }
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
      standard: { 
        name: "Honeydew Melon", 
        emoji: "🍈", 
        description: "About 18.6 inches long and weighs about 5.8 pounds.",
        reasoning: "At week 36, your baby is nearly full-term. A honeydew melon captures the significant weight and rounded shape of your baby as they prepare for birth."
      },
      tropical: { 
        name: "Large Pineapple", 
        emoji: "🍍", 
        description: "Almost ready to meet the world!",
        reasoning: "A large pineapple is used to visualize the height and weight of your baby, who is now taking up most of the space in your uterus."
      },
      veggies: { 
        name: "Large Pumpkin", 
        emoji: "🎃", 
        description: "A big harvest is coming!",
        reasoning: "The large pumpkin represents the final growth spurt. Your baby is now heavy and substantial, just like a harvest-ready pumpkin."
      }
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
    month: 3,
    title: "Smiles and Coos",
    description: "Your baby is becoming more social and starting to show their personality.",
    milestones: ["Social smiling", "Supporting head firmly", "Opening and closing hands"],
    tips: ["Talk and sing to your baby", "Introduce more floor play", "Establish a bedtime routine"]
  },
  {
    month: 6,
    title: "Starting Solids",
    description: "Baby is becoming more active and might be ready for their first tastes of food.",
    milestones: ["Sitting with support", "Rolling both ways", "Babbling consonant sounds"],
    tips: ["Introduce one food at a time", "Encourage tummy time", "Read books together"]
  },
  {
    month: 9,
    title: "On the Move",
    description: "Baby is exploring their world more actively, often by crawling or scooting.",
    milestones: ["Crawling", "Pulling to stand", "Using pincer grasp"],
    tips: ["Baby-proof your home", "Play hide-and-seek", "Offer finger foods"]
  },
  {
    month: 12,
    title: "First Steps",
    description: "A major milestone year! Your baby is transitioning into toddlerhood.",
    milestones: ["Standing alone", "Taking first steps", "Saying 'mama' or 'dada'"],
    tips: ["Celebrate the first birthday!", "Encourage independent play", "Switch to a cup"]
  }
];

export const FORUM_POSTS: ForumPost[] = [
  {
    id: '1',
    author: 'Mama Sarah',
    content: 'Has anyone else experienced sudden cravings for pickles and ice cream? Is it normal? I feel a bit silly but it is so strong!',
    timestamp: '2 hours ago',
    likes: 12,
    comments: [
      { id: 'c1', author: 'NewMom_Joy', content: 'Totally normal, Mama! I had it with peanut butter too. You are doing great!', timestamp: '1 hour ago' },
      { id: 'c2', author: 'Aisha_B', content: 'Welcome to the club! It\'s the hormones and your body working hard. Enjoy those pickles!', timestamp: '45 mins ago' }
    ],
    category: 'Pregnancy questions'
  },
  {
    id: '2',
    author: 'NewMom_Joy',
    content: 'My 3-month-old finally slept through the night! There is light at the end of the tunnel! Sending sleep dust to everyone.',
    timestamp: '5 hours ago',
    likes: 45,
    comments: [
      { id: 'c3', author: 'Mama Sarah', content: 'That is amazing! Enjoy the rest.', timestamp: '4 hours ago' }
    ],
    category: 'Baby care'
  },
  {
    id: '3',
    author: 'Grace_M',
    content: 'Feeling a bit overwhelmed today. The house is a mess and I just want to cry. Is this just the baby blues or something more?',
    timestamp: '1 hour ago',
    likes: 28,
    comments: [
      { id: 'c4', author: 'Aisha_B', content: 'Sending you a huge hug, Grace. It is okay to cry. Have you spoken to a peer counselor here? They are wonderful listeners.', timestamp: '30 mins ago' },
      { id: 'c5', author: 'Mama Sarah', content: 'You are not alone. We all have these days. Be gentle with yourself.', timestamp: '15 mins ago' }
    ],
    category: 'Emotional well-being'
  },
  {
    id: '4',
    author: 'Aisha_B',
    content: 'Breastfeeding was so hard at first, but we finally found our rhythm! To any new moms struggling: it gets easier, I promise.',
    timestamp: '8 hours ago',
    likes: 56,
    comments: [
      { id: 'c6', author: 'Grace_M', content: 'Thank you for this. I needed to hear it today.', timestamp: '7 hours ago' }
    ],
    category: 'Breastfeeding'
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

export const POSTPARTUM_RECOVERY: PostpartumRecovery[] = [
  {
    id: 'physical',
    title: 'Physical Recovery',
    description: 'The first 6 weeks after birth are a time of intense healing. Your body is returning to its pre-pregnancy state.',
    tips: [
      "Rest as much as possible—sleep when the baby sleeps.",
      "Use a peri bottle with warm water after using the bathroom.",
      "Wear comfortable, loose-fitting clothing and supportive bras.",
      "Stay hydrated and eat fiber-rich foods to avoid constipation."
    ],
    warningSigns: [
      "Heavy bleeding (soaking a pad in an hour)",
      "Severe abdominal pain",
      "Fever over 100.4°F (38°C)",
      "Redness or swelling in your legs"
    ]
  },
  {
    id: 'nutrition',
    title: 'Nutrition for Healing',
    description: 'Your body needs extra nutrients to heal and, if you are breastfeeding, to produce milk.',
    tips: [
      "Continue taking your prenatal vitamins as recommended.",
      "Eat plenty of protein (lean meats, beans, eggs) for tissue repair.",
      "Include Vitamin C (citrus, berries) to help with wound healing.",
      "Don't skip meals—keep healthy snacks like nuts and fruit nearby."
    ],
    warningSigns: [
      "Extreme fatigue that doesn't improve with rest",
      "Dizziness or fainting",
      "Sudden, unexplained weight loss"
    ]
  },
  {
    id: 'csection',
    title: 'C-Section Care',
    description: 'A C-section is major abdominal surgery and requires specific care for the incision.',
    tips: [
      "Keep the incision site clean and dry.",
      "Support your incision with a pillow when coughing or laughing.",
      "Avoid lifting anything heavier than your baby.",
      "Walk gently to promote circulation and prevent blood clots."
    ],
    warningSigns: [
      "Redness, warmth, or drainage from the incision",
      "The incision starts to pull apart",
      "Severe pain at the incision site"
    ]
  }
];

export const POSTPARTUM_MENTAL_HEALTH: PostpartumRecovery[] = [
  {
    id: 'baby-blues',
    title: 'The Baby Blues',
    description: 'Up to 80% of new mothers experience the "baby blues" in the first week or two after birth.',
    tips: [
      "Be patient with yourself—your hormones are shifting rapidly.",
      "Talk to your partner or a friend about how you are feeling.",
      "Try to get as much rest as possible.",
      "Accept help with chores and meals."
    ],
    warningSigns: [
      "Feelings persist beyond two weeks",
      "Difficulty caring for yourself or your baby",
      "Feelings of intense hopelessness"
    ],
    selfCareExercises: [
      "Gentle stretching for 5 minutes",
      "Deep breathing (4-7-8 technique)",
      "Listening to a calming playlist"
    ],
    comments: [
      { id: 'mh1', author: 'Mama Sarah', content: 'I felt this so much in the first week. It does get better!', timestamp: '2 days ago' }
    ]
  },
  {
    id: 'ppd',
    title: 'Postpartum Depression',
    description: 'PPD is a serious but treatable condition that can occur anytime in the first year after birth.',
    tips: [
      "Reach out to your doctor or a mental health professional.",
      "Join a support group for new mothers.",
      "Prioritize basic needs: sleep, food, and water.",
      "Remember that this is not your fault and you are not alone."
    ],
    warningSigns: [
      "Thoughts of hurting yourself or your baby",
      "Severe mood swings or persistent sadness",
      "Withdrawal from family and friends"
    ],
    selfCareExercises: [
      "Short 10-minute walk outside",
      "Journaling your thoughts for 5 minutes",
      "Calling a trusted friend for a chat"
    ],
    comments: [
      { id: 'mh2', author: 'NewMom_Joy', content: 'Please reach out if you feel this way. You are not alone.', timestamp: '1 day ago' }
    ]
  },
  {
    id: 'anxiety',
    title: 'Postpartum Anxiety',
    description: 'Many mothers experience intrusive thoughts or excessive worry about their baby\'s safety.',
    tips: [
      "Practice grounding exercises like deep breathing.",
      "Limit caffeine intake which can worsen anxiety.",
      "Write down your worries to get them out of your head.",
      "Speak with a therapist specializing in maternal mental health."
    ],
    warningSigns: [
      "Panic attacks or constant racing heart",
      "Inability to sleep even when the baby is sleeping",
      "Obsessive checking on the baby"
    ],
    selfCareExercises: [
      "5-4-3-2-1 grounding technique",
      "Mindful coloring or drawing",
      "Progressive muscle relaxation"
    ],
    comments: [
      { id: 'mh3', author: 'Aisha_B', content: 'The grounding exercises really helped me when I felt overwhelmed.', timestamp: '5 hours ago' }
    ]
  }
];

export const PELVIC_FLOOR_EXERCISES: PostpartumRecovery[] = [
  {
    id: 'kegels',
    title: 'Kegel Exercises',
    description: 'Kegels help strengthen the muscles that support your bladder, uterus, and bowels.',
    tips: [
      "Identify the right muscles (imagine stopping the flow of urine).",
      "Squeeze for 3-5 seconds, then relax for 3-5 seconds.",
      "Repeat 10 times, 3 times a day.",
      "Don't hold your breath while doing them."
    ],
    warningSigns: [
      "Pain while performing exercises",
      "No improvement in leaking after several weeks",
      "Feeling of a bulge in the vaginal area"
    ]
  },
  {
    id: 'breathing',
    title: 'Diaphragmatic Breathing',
    description: 'Deep breathing helps coordinate your diaphragm and pelvic floor.',
    tips: [
      "Place one hand on your chest and one on your belly.",
      "Inhale deeply through your nose, letting your belly expand.",
      "Exhale slowly through your mouth, feeling your belly fall.",
      "Focus on relaxing your pelvic floor on the inhale."
    ],
    warningSigns: [
      "Dizziness or lightheadedness",
      "Shortness of breath",
      "Chest pain"
    ]
  },
  {
    id: 'core',
    title: 'Core Connection',
    description: 'Gently re-engaging your deep core muscles (transverse abdominis).',
    tips: [
      "Lie on your back with knees bent.",
      "Exhale and gently pull your belly button toward your spine.",
      "Hold for a few seconds while continuing to breathe.",
      "Start with very small movements and build up."
    ],
    warningSigns: [
      "Coning or doming in the center of your abdomen",
      "Lower back pain",
      "Pelvic pressure"
    ]
  }
];
