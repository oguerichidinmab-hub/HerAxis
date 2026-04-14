import { PregnancyUpdate, BabyUpdate, ForumPost, NutritionTip, PostpartumRecovery, Hospital } from './types';

export const PREGNANCY_UPDATES: PregnancyUpdate[] = [
  {
    week: 4,
    title: "Implantation & Early Growth",
    description: "Your baby is a tiny ball of cells called a blastocyst, about the size of a poppy seed.",
    tips: ["Take your prenatal vitamins", "Avoid alcohol and smoking", "Eat a balanced diet"],
    bodyChanges: "You might experience slight spotting or cramping as the embryo implants.",
    trimester: 1,
    developmentDetail: "The blastocyst is splitting into two parts: one will become the embryo, and the other will become the placenta. The amniotic sac and yolk sac are also forming.",
    fruitSize: {
      standard: { 
        name: "Poppy Seed", 
        emoji: "🌱", 
        description: "Microscopic but full of potential!",
        reasoning: "At week 4, the embryo is about 0.04 inches long, which is roughly the size of a tiny poppy seed."
      },
      tropical: { 
        name: "Chia Seed", 
        emoji: "✨", 
        description: "Smallest beginning of a big journey.",
        reasoning: "A chia seed represents the microscopic scale of your baby at this earliest stage of development."
      },
      veggies: { 
        name: "Mustard Seed", 
        emoji: "🌿", 
        description: "Faith in the smallest things.",
        reasoning: "The mustard seed is a classic comparison for the tiny but powerful start of your baby's life."
      }
    },
    realSize: {
      length: "0.04 inches (1 mm)",
      weight: "Less than 0.04 oz (1 g)"
    },
    foetusImageUrl: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=800",
    nextActions: ["Confirm pregnancy with a test", "Book your first prenatal appointment", "Start a pregnancy journal"],
    imageUrl: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=800"
  },
  {
    week: 8,
    title: "Major Organs Forming",
    description: "Your baby is now the size of a raspberry! Their heart is beating twice as fast as yours.",
    tips: ["Manage morning sickness", "Get plenty of rest", "Stay hydrated"],
    bodyChanges: "Your uterus is growing, and you might feel more frequent urges to urinate.",
    trimester: 1,
    developmentDetail: "Baby's arms and legs are growing longer, and their fingers and toes are starting to form. Their nose and upper lip are also becoming visible.",
    fruitSize: {
      standard: { 
        name: "Raspberry", 
        emoji: "🍓", 
        description: "About 0.6 inches long.",
        reasoning: "At week 8, your baby is about the size of a raspberry, with distinct limb buds and a beating heart."
      },
      tropical: { 
        name: "Coffee Bean", 
        emoji: "☕", 
        description: "Small but full of life!",
        reasoning: "A coffee bean matches the length and the slightly curved shape of the embryo at this stage."
      },
      veggies: { 
        name: "Kidney Bean", 
        emoji: "🫘", 
        description: "The shape of things to come.",
        reasoning: "The kidney bean is a perfect visual for the 'C' shape of the embryo as it develops its spine and limbs."
      }
    },
    realSize: {
      length: "0.6 inches (1.6 cm)",
      weight: "0.04 oz (1 g)"
    },
    foetusImageUrl: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=800",
    nextActions: ["First prenatal checkup", "Check your health insurance coverage", "Announce to close family if ready"],
    imageUrl: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=800"
  },
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
    },
    realSize: {
      length: "2.1 inches (5.4 cm)",
      weight: "0.49 oz (14 g)"
    },
    foetusImageUrl: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=800",
    nextActions: [
      "Schedule your next prenatal checkup",
      "Start looking into maternity wear",
      "Begin a daily prenatal yoga routine"
    ],
    imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800"
  },
  {
    week: 16,
    title: "Baby Can Hear You",
    description: "Your baby is the size of an avocado! Their ears are in place and they can hear sounds.",
    tips: ["Talk to your baby", "Monitor your weight gain", "Wear comfortable shoes"],
    bodyChanges: "Your 'glow' might be appearing as blood flow increases. You might feel 'quickening' soon.",
    trimester: 2,
    developmentDetail: "Baby's eyes are moving to the front of their head, and their legs are becoming more developed. Their nervous system is starting to function.",
    fruitSize: {
      standard: { 
        name: "Avocado", 
        emoji: "🥑", 
        description: "About 4.5 inches long.",
        reasoning: "An avocado perfectly represents the weight and length of your baby as they start to fill out and grow stronger."
      },
      tropical: { 
        name: "Pomegranate", 
        emoji: "🍎", 
        description: "Full of precious seeds of life.",
        reasoning: "The pomegranate matches the size and the growing complexity of your baby's internal systems."
      },
      veggies: { 
        name: "Large Onion", 
        emoji: "🧅", 
        description: "Layer by layer, growing stronger.",
        reasoning: "A large onion is a great visual for the size and the 'roundness' your baby is starting to achieve."
      }
    },
    realSize: {
      length: "4.6 inches (11.6 cm)",
      weight: "3.5 oz (100 g)"
    },
    foetusImageUrl: "https://images.unsplash.com/photo-1559734840-f9509ee5677f?auto=format&fit=crop&q=80&w=800",
    nextActions: ["Second trimester screening", "Start a baby name list", "Plan a babymoon if possible"],
    imageUrl: "https://images.unsplash.com/photo-1559734840-f9509ee5677f?auto=format&fit=crop&q=80&w=800"
  },
  {
    week: 20,
    title: "Halfway There!",
    description: "Your baby is the size of a banana! You're at the midpoint of your pregnancy.",
    tips: ["Get an anatomy scan", "Focus on posture", "Eat iron-rich foods"],
    bodyChanges: "Your belly button might pop out, and you're likely feeling regular movements.",
    trimester: 2,
    developmentDetail: "Baby is swallowing amniotic fluid and their taste buds are developing. They are covered in a waxy coating called vernix caseosa to protect their skin.",
    fruitSize: {
      standard: { 
        name: "Banana", 
        emoji: "🍌", 
        description: "About 6.5 inches long (head to bottom).",
        reasoning: "A banana is the classic comparison for week 20 because it matches the length of your baby from head to bottom."
      },
      tropical: { 
        name: "Mango", 
        emoji: "🥭", 
        description: "Sweet milestone!",
        reasoning: "A large mango represents the weight and the 'substantial' feel of your baby at the halfway mark."
      },
      veggies: { 
        name: "Sweet Potato", 
        emoji: "🍠", 
        description: "Nourishing and growing.",
        reasoning: "The sweet potato matches the length and the slightly curved posture of your baby in the womb."
      }
    },
    realSize: {
      length: "10.1 inches (25.6 cm)",
      weight: "10.6 oz (300 g)"
    },
    foetusImageUrl: "https://images.unsplash.com/photo-1559734840-f9509ee5677f?auto=format&fit=crop&q=80&w=800",
    nextActions: ["Anatomy ultrasound", "Register for baby gifts", "Start pelvic floor exercises"],
    imageUrl: "https://images.unsplash.com/photo-1559734840-f9509ee5677f?auto=format&fit=crop&q=80&w=800"
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
    },
    realSize: {
      length: "11.8 inches (30 cm)",
      weight: "1.3 lbs (600 g)"
    },
    foetusImageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800",
    nextActions: [
      "Book your glucose tolerance test",
      "Start moisturizing your growing belly",
      "Research local pediatricians"
    ],
    imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800"
  },
  {
    week: 28,
    title: "Third Trimester Begins",
    description: "Your baby is the size of a large eggplant! Their eyes can open and close.",
    tips: ["Monitor baby's kicks", "Check for gestational diabetes", "Sleep on your side"],
    bodyChanges: "You might experience leg cramps, heartburn, or shortness of breath.",
    trimester: 3,
    developmentDetail: "Baby's brain is developing rapidly, and they are starting to dream! Their eyelashes are growing, and they are gaining more fat to keep warm after birth.",
    fruitSize: {
      standard: { 
        name: "Large Eggplant", 
        emoji: "🍆", 
        description: "About 14.8 inches long.",
        reasoning: "A large eggplant represents the length and the increasing weight of your baby as they enter the final trimester."
      },
      tropical: { 
        name: "Dragon Fruit", 
        emoji: "🐉", 
        description: "Exotic and growing fast.",
        reasoning: "The dragon fruit matches the weight and the 'vibrant' energy of your baby's brain development."
      },
      veggies: { 
        name: "Head of Cauliflower", 
        emoji: "🥦", 
        description: "Complex and beautiful.",
        reasoning: "A head of cauliflower is a great visual for the size and the 'brain-like' complexity of your baby's development right now."
      }
    },
    realSize: {
      length: "14.8 inches (37.6 cm)",
      weight: "2.2 lbs (1 kg)"
    },
    foetusImageUrl: "https://images.unsplash.com/photo-1559734840-f9509ee5677f?auto=format&fit=crop&q=80&w=800",
    nextActions: ["Start kick counts", "Take a breastfeeding class", "Wash baby clothes and bedding"],
    imageUrl: "https://images.unsplash.com/photo-1559734840-f9509ee5677f?auto=format&fit=crop&q=80&w=800"
  },
  {
    week: 32,
    title: "Practicing Breathing",
    description: "Your baby is the size of a squash! They are practicing breathing and swallowing.",
    tips: ["Pack your hospital bag", "Do perineal massage", "Stay active but rest"],
    bodyChanges: "You might feel 'Braxton Hicks' contractions as your body prepares for labor.",
    trimester: 3,
    developmentDetail: "Baby is taking up most of the space in your uterus. Their bones are fully formed but still soft and flexible. They are practicing their sucking reflex.",
    fruitSize: {
      standard: { 
        name: "Squash", 
        emoji: "🎃", 
        description: "About 16.7 inches long.",
        reasoning: "A large squash matches the length and the 'solid' feel of your baby as they continue to gain weight."
      },
      tropical: { 
        name: "Coconut", 
        emoji: "🥥", 
        description: "Strong and protected.",
        reasoning: "A coconut represents the weight and the 'hard' skull that is protecting your baby's rapidly growing brain."
      },
      veggies: { 
        name: "Large Cabbage", 
        emoji: "🥬", 
        description: "Full of layers and life.",
        reasoning: "A large cabbage is a perfect visual for the size and the 'compact' weight of your baby at week 32."
      }
    },
    realSize: {
      length: "16.7 inches (42.4 cm)",
      weight: "3.75 lbs (1.7 kg)"
    },
    foetusImageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800",
    nextActions: ["Finalize your hospital bag", "Install the car seat", "Discuss birth preferences with your doctor"],
    imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800"
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
    },
    realSize: {
      length: "18.6 inches (47.3 cm)",
      weight: "5.8 lbs (2.6 kg)"
    },
    foetusImageUrl: "https://images.unsplash.com/photo-1559734840-f9509ee5677f?auto=format&fit=crop&q=80&w=800",
    nextActions: [
      "Finalize your birth plan",
      "Install the baby car seat",
      "Prepare some freezer-friendly meals"
    ],
    imageUrl: "https://images.unsplash.com/photo-1559734840-f9509ee5677f?auto=format&fit=crop&q=80&w=800"
  },
  {
    week: 40,
    title: "Due Date Week",
    description: "Your baby is the size of a watermelon! They are fully developed and ready to meet you.",
    tips: ["Stay calm and patient", "Watch for labor signs", "Keep moving gently"],
    bodyChanges: "You might lose your mucus plug or experience your water breaking.",
    trimester: 3,
    developmentDetail: "Baby is ready! Their lungs are fully matured, and they have enough fat to regulate their temperature. They are waiting for the right moment to make their entrance.",
    fruitSize: {
      standard: { 
        name: "Watermelon", 
        emoji: "🍉", 
        description: "About 20 inches long and weighs about 7.5 pounds.",
        reasoning: "A watermelon is the ultimate comparison for a full-term baby, representing the full weight and size of your new arrival."
      },
      tropical: { 
        name: "Jackfruit", 
        emoji: "🍈", 
        description: "The grand finale!",
        reasoning: "A jackfruit represents the maximum size and weight your baby will reach before birth."
      },
      veggies: { 
        name: "Giant Squash", 
        emoji: "🎃", 
        description: "Ready for the big day.",
        reasoning: "A giant squash captures the substantial size and the 'ready-to-be-born' feel of your baby at 40 weeks."
      }
    },
    realSize: {
      length: "20.2 inches (51.2 cm)",
      weight: "7.5 lbs (3.4 kg)"
    },
    foetusImageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800",
    nextActions: ["Go to the hospital when labor starts", "Trust your body", "Welcome your baby!"],
    imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800"
  }
];

export const BABY_UPDATES: BabyUpdate[] = [
  {
    month: 1,
    title: "The Fourth Trimester",
    description: "Your baby is adjusting to life outside the womb. Lots of sleep and skin-to-skin contact.",
    milestones: ["Briefly lifting head", "Focusing on faces", "Startling at loud noises"],
    tips: ["Sleep when baby sleeps", "Accept help from others", "Keep track of wet diapers"],
    nextActions: [
      "Schedule your 1-month pediatrician visit",
      "Start tummy time for 1-2 minutes",
      "Take lots of photos of those tiny hands!"
    ],
    imageUrl: "https://images.unsplash.com/photo-1523262316637-b9c7264a2a4d?auto=format&fit=crop&q=80&w=800"
  },
  {
    month: 3,
    title: "Smiles and Coos",
    description: "Your baby is becoming more social and starting to show their personality.",
    milestones: ["Social smiling", "Supporting head firmly", "Opening and closing hands"],
    tips: ["Talk and sing to your baby", "Introduce more floor play", "Establish a bedtime routine"],
    nextActions: [
      "Check baby's vaccine schedule",
      "Introduce a soft toy for grasping",
      "Plan a short outing for some fresh air"
    ],
    imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800"
  },
  {
    month: 6,
    title: "Starting Solids",
    description: "Baby is becoming more active and might be ready for their first tastes of food.",
    milestones: ["Sitting with support", "Rolling both ways", "Babbling consonant sounds"],
    tips: ["Introduce one food at a time", "Encourage tummy time", "Read books together"],
    nextActions: [
      "Start introducing pureed vegetables",
      "Baby-proof the low cabinets",
      "Get a high chair ready"
    ],
    imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=800"
  },
  {
    month: 9,
    title: "On the Move",
    description: "Baby is exploring their world more actively, often by crawling or scooting.",
    milestones: ["Crawling", "Pulling to stand", "Using pincer grasp"],
    tips: ["Baby-proof your home", "Play hide-and-seek", "Offer finger foods"],
    nextActions: [
      "Lower the crib mattress",
      "Introduce a variety of textures in food",
      "Start a simple 'no' and 'yes' game"
    ],
    imageUrl: "https://images.unsplash.com/photo-1510154221590-ff63e90a136f?auto=format&fit=crop&q=80&w=800"
  },
  {
    month: 12,
    title: "First Steps",
    description: "A major milestone year! Your baby is transitioning into toddlerhood.",
    milestones: ["Standing alone", "Taking first steps", "Saying 'mama' or 'dada'"],
    tips: ["Celebrate the first birthday!", "Encourage independent play", "Switch to a cup"],
    nextActions: [
      "Plan the first birthday party!",
      "Transition to whole milk (if recommended)",
      "Get baby's first pair of walking shoes"
    ],
    imageUrl: "https://images.unsplash.com/photo-1513273159383-c202762264c3?auto=format&fit=crop&q=80&w=800"
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
    mealSuggestion: 'Spinach and lentil soup with a squeeze of lemon for better absorption.',
    benefits: [
      "Prevents anemia",
      "Supports baby's brain development",
      "Reduces fatigue"
    ],
    nutrients: ["Iron", "Vitamin C", "Folate"]
  },
  {
    id: '2',
    title: 'Healthy Fats',
    content: 'DHA is essential for baby\'s brain and eye development.',
    mealSuggestion: 'Grilled salmon with avocado salad.',
    benefits: [
      "Brain development",
      "Eye health",
      "Reduces risk of preterm birth"
    ],
    nutrients: ["Omega-3", "DHA", "Vitamin D"]
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

export const HOSPITALS: Hospital[] = [
  {
    id: 'h1',
    name: 'St. Mary\'s Maternity Hospital',
    address: '123 Health Ave, Lagos, Nigeria',
    distance: '0.8 km',
    distanceValue: 0.8,
    phone: '+234 801 234 5678',
    type: 'Maternity Specialist',
    isOpen: true,
    availabilityStatus: '24/7 Emergency',
    isMaternalCare: true,
    isEmergencyCare: true,
    isRecommended: true,
    openingHours: 'Open 24 hours',
    services: ['Antenatal Care', 'Delivery', 'Postnatal Care', 'NICU', 'Emergency Surgery'],
    description: 'Recommended for antenatal and emergency maternal care. Specialized in high-risk pregnancies.',
    lat: 6.5244,
    lng: 3.3792
  },
  {
    id: 'h2',
    name: 'City General Hospital',
    address: '456 Main St, Lagos, Nigeria',
    distance: '1.5 km',
    distanceValue: 1.5,
    phone: '+234 802 345 6789',
    type: 'General Hospital',
    isOpen: true,
    availabilityStatus: 'Open Now',
    isMaternalCare: true,
    isEmergencyCare: true,
    isRecommended: false,
    openingHours: 'Open 24 hours',
    services: ['General Medicine', 'Maternity Ward', 'Pediatrics', 'Emergency Room'],
    description: 'A large public hospital with a dedicated maternity wing and 24/7 emergency services.',
    lat: 6.5300,
    lng: 3.3850
  },
  {
    id: 'h3',
    name: 'Mother & Child Care Center',
    address: '789 Family Way, Lagos, Nigeria',
    distance: '2.2 km',
    distanceValue: 2.2,
    phone: '+234 803 456 7890',
    type: 'Specialized Clinic',
    isOpen: false,
    availabilityStatus: 'Closed - Opens 8 AM',
    isMaternalCare: true,
    isEmergencyCare: false,
    isRecommended: true,
    openingHours: '8:00 AM - 6:00 PM',
    services: ['Immunization', 'Well-baby Checks', 'Nutritional Counseling', 'Lactation Support'],
    description: 'Focused on postnatal care and baby wellness. Great for routine checkups.',
    lat: 6.5150,
    lng: 3.3700
  },
  {
    id: 'h4',
    name: 'Lagos University Teaching Hospital (LUTH)',
    address: 'Idi-Araba, Surulere, Lagos',
    distance: '3.5 km',
    distanceValue: 3.5,
    phone: '+234 804 567 8901',
    type: 'Teaching Hospital',
    isOpen: true,
    availabilityStatus: '24/7 Emergency',
    isMaternalCare: true,
    isEmergencyCare: true,
    isRecommended: true,
    openingHours: 'Open 24 hours',
    services: ['Specialized Surgery', 'Neonatology', 'Obstetrics', 'Research Center'],
    description: 'Tertiary care center with advanced facilities for complex maternal and neonatal cases.',
    lat: 6.5180,
    lng: 3.3550
  },
  {
    id: 'h5',
    name: 'Graceful Birth Clinic',
    address: '10 Victoria Island, Lagos',
    distance: '4.1 km',
    distanceValue: 4.1,
    phone: '+234 805 678 9012',
    type: 'Private Clinic',
    isOpen: true,
    availabilityStatus: 'Open Now',
    isMaternalCare: true,
    isEmergencyCare: true,
    isRecommended: false,
    openingHours: 'Open 24 hours',
    services: ['Private Birthing Suites', 'Antenatal Classes', 'Doula Services'],
    description: 'Premium birthing experience with personalized care and modern amenities.',
    lat: 6.4281,
    lng: 3.4219
  },
  {
    id: 'h6',
    name: 'Hope Community Health Center',
    address: '22 Market Rd, Lagos',
    distance: '5.0 km',
    distanceValue: 5.0,
    phone: '+234 806 789 0123',
    type: 'Community Clinic',
    isOpen: true,
    availabilityStatus: 'Open Now',
    isMaternalCare: true,
    isEmergencyCare: false,
    isRecommended: false,
    openingHours: '7:00 AM - 9:00 PM',
    services: ['Primary Care', 'Maternal Health Education', 'Family Planning'],
    description: 'Affordable community-focused health center providing essential maternal support.',
    lat: 6.5400,
    lng: 3.4000
  }
];
