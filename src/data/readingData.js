// Data structure for reading log entries
// Each entry contains comprehensive metadata for tracking and analytics

export const readingEntrySchema = {
  id: "string", // Unique identifier
  dateAdded: "string", // ISO date string
  dateRead: "string", // ISO date string (null if not read yet)
  title: "string",
  author: "string",
  link: "string", // URL to the content
  type: "string", // book, article, video, podcast, linkedin_post
  platform: "string", // For social media posts (LinkedIn, Twitter, etc.)
  language: "string", // en, es, fr, etc.
  tags: ["string"], // Array of tags for categorization
  status: "string", // read, in-progress, to-read
  rating: "number", // 1-5 stars (optional)
  ratingDescription: "string", // Optional descriptive rating
  keyInsights: "string", // Main takeaways
  quotes: ["string"], // Array of notable quotes
  impact: "number", // 1-5 scale of personal impact
  length: "string", // short, medium, long
  difficulty: "string", // beginner, intermediate, advanced
  relatedTo: ["string"], // IDs of related entries
  personalReflection: "string", // Personal thoughts and connections
  citationFormat: "string" // Properly formatted citation
};

// Sample data with diverse content types
export const allSampleData = [
  {
    id: "1",
    dateAdded: "2025-01-15",
    dateRead: "2025-01-20",
    title: "The Three Types of Data Drift",
    author: "Jane Doe",
    link: "https://linkedin.com/posts/janedoe_data-drift",
    type: "linkedin_post",
    platform: "LinkedIn",
    language: "en",
    tags: ["Machine Learning", "Data Quality", "MLOps"],
    status: "read",
    rating: 4,
    ratingDescription: "Excellent practical insights",
    keyInsights: "Data drift can be categorized into covariate shift, prior probability shift, and concept drift — each requires different detection strategies.",
    quotes: ["The key to managing data drift is early detection and automated response systems."],
    impact: 4,
    length: "short",
    difficulty: "intermediate",
    relatedTo: [],
    personalReflection: "This clarified why my anomaly detection model degraded last quarter.",
    citationFormat: 'Doe, Jane. "The Three Types of Data Drift." LinkedIn, 15 Jan. 2025, linkedin.com/posts/janedoe_data-drift.'
  },
  {
    id: "2",
    dateAdded: "2025-01-10",
    dateRead: "2025-01-25",
    title: "Atomic Habits",
    author: "James Clear",
    link: "https://jamesclear.com/atomic-habits",
    type: "book",
    platform: "",
    language: "en",
    tags: ["Productivity", "Self-Improvement", "Psychology"],
    status: "read",
    rating: 5,
    ratingDescription: "Life-changing methodology",
    keyInsights: "Small changes compound over time. Focus on systems, not goals. Make good habits obvious, attractive, easy, and satisfying.",
    quotes: [
      "You do not rise to the level of your goals. You fall to the level of your systems.",
      "Every action you take is a vote for the type of person you wish to become."
    ],
    impact: 5,
    length: "long",
    difficulty: "beginner",
    relatedTo: [],
    personalReflection: "Completely changed how I approach building new habits. Started implementing the 2-minute rule immediately.",
    citationFormat: 'Clear, James. Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones. Avery, 2018.'
  },
  {
    id: "3",
    dateAdded: "2025-02-01",
    dateRead: null,
    title: "The Future of AI in Healthcare",
    author: "Dr. Sarah Johnson",
    link: "https://youtube.com/watch?v=ai-healthcare-2025",
    type: "video",
    platform: "YouTube",
    language: "en",
    tags: ["AI", "Healthcare", "Technology", "Future Trends"],
    status: "to-read",
    rating: null,
    ratingDescription: "",
    keyInsights: "",
    quotes: [],
    impact: null,
    length: "medium",
    difficulty: "intermediate",
    relatedTo: [],
    personalReflection: "",
    citationFormat: 'Johnson, Sarah. "The Future of AI in Healthcare." YouTube, 1 Feb. 2025, youtube.com/watch?v=ai-healthcare-2025.'
  },
  {
    id: "4",
    dateAdded: "2025-01-28",
    dateRead: "2025-02-05",
    title: "Building Resilient Distributed Systems",
    author: "Martin Fowler",
    link: "https://martinfowler.com/articles/resilient-systems.html",
    type: "article",
    platform: "Personal Blog",
    language: "en",
    tags: ["Software Architecture", "Distributed Systems", "Resilience"],
    status: "read",
    rating: 4,
    ratingDescription: "Comprehensive technical guide",
    keyInsights: "Circuit breakers, bulkheads, and timeouts are essential patterns for building fault-tolerant systems. Design for failure from the beginning.",
    quotes: ["The best way to avoid failure is to fail constantly in small ways."],
    impact: 4,
    length: "long",
    difficulty: "advanced",
    relatedTo: [],
    personalReflection: "Applied circuit breaker pattern to our microservices architecture after reading this.",
    citationFormat: 'Fowler, Martin. "Building Resilient Distributed Systems." Martin Fowler, 28 Jan. 2025, martinfowler.com/articles/resilient-systems.html.'
  },
  {
    id: "5",
    dateAdded: "2025-02-03",
    dateRead: "2025-02-08",
    title: "The Tim Ferriss Show: Naval Ravikant",
    author: "Tim Ferriss",
    link: "https://tim.blog/naval-ravikant-podcast/",
    type: "podcast",
    platform: "The Tim Ferriss Show",
    language: "en",
    tags: ["Entrepreneurship", "Philosophy", "Wealth", "Happiness"],
    status: "read",
    rating: 5,
    ratingDescription: "Profound life philosophy",
    keyInsights: "Wealth is having assets that earn while you sleep. Happiness is a choice and a skill that can be developed. Specific knowledge is knowledge that cannot be trained.",
    quotes: [
      "Seek wealth, not money or status.",
      "The most important decision for your happiness is who you choose to be around."
    ],
    impact: 5,
    length: "long",
    difficulty: "intermediate",
    relatedTo: [],
    personalReflection: "Shifted my perspective on career choices and what constitutes true wealth.",
    citationFormat: 'Ferriss, Tim, host. "Naval Ravikant." The Tim Ferriss Show, 3 Feb. 2025, tim.blog/naval-ravikant-podcast/.'
  },
  {
    id: "6",
    dateAdded: "2025-02-10",
    dateRead: "2025-02-15",
    title: "The Lean Startup",
    author: "Eric Ries",
    link: "https://theleanstartup.com/",
    type: "book",
    platform: "",
    language: "en",
    tags: ["Entrepreneurship", "Product Management", "Innovation"],
    status: "read",
    rating: 4,
    ratingDescription: "Essential for product development",
    keyInsights: "Build-Measure-Learn feedback loop, validated learning, minimum viable product (MVP), pivot or persevere.",
    quotes: [
      "The only way to win is to learn faster than anyone else.",
      "The Lean Startup provides a scientific approach to creating and managing successful startups in a age when companies need to innovate more than ever."
    ],
    impact: 4,
    length: "long",
    difficulty: "intermediate",
    relatedTo: [],
    personalReflection: "Helped me understand the importance of rapid iteration and customer feedback in my side projects.",
    citationFormat: 'Ries, Eric. The Lean Startup: How Today\'s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses. Crown Business, 2011.'
  },
  {
    id: "7",
    dateAdded: "2025-02-12",
    dateRead: null,
    title: "Understanding Large Language Models",
    author: "Google AI Blog",
    link: "https://ai.googleblog.com/2025/02/understanding-large-language-models.html",
    type: "article",
    platform: "Google AI Blog",
    language: "en",
    tags: ["AI", "Natural Language Processing", "Deep Learning"],
    status: "in-progress",
    rating: null,
    ratingDescription: "",
    keyInsights: "",
    quotes: [],
    impact: null,
    length: "medium",
    difficulty: "advanced",
    relatedTo: [],
    personalReflection: "",
    citationFormat: 'Google AI Blog. "Understanding Large Language Models." Google AI Blog, 12 Feb. 2025, ai.googleblog.com/2025/02/understanding-large-language-models.html.'
  },
  {
    id: "8",
    dateAdded: "2025-02-18",
    dateRead: "2025-02-20",
    title: "The Power of Habit",
    author: "Charles Duhigg",
    link: "https://charlesduhigg.com/the-power-of-habit/",
    type: "book",
    platform: "",
    language: "en",
    tags: ["Psychology", "Habit Formation", "Behavioral Science"],
    status: "read",
    rating: 5,
    ratingDescription: "Fascinating insights into human behavior",
    keyInsights: "Habits are a three-step loop: cue, routine, reward. Understanding this loop is key to changing habits. Keystone habits can trigger widespread changes.",
    quotes: [
      "The Golden Rule of Habit Change: You can't extinguish a bad habit, you can only change it.",
      "Small wins are a steady application of a small advantage."
    ],
    impact: 5,
    length: "long",
    difficulty: "beginner",
    relatedTo: ["2"],
    personalReflection: "Provided a scientific framework for understanding and changing my own daily routines.",
    citationFormat: 'Duhigg, Charles. The Power of Habit: Why We Do What We Do in Life and Business. Random House, 2012.'
  },
  {
    id: "9",
    dateAdded: "2025-02-20",
    dateRead: "2025-02-22",
    title: "Why We Sleep",
    author: "Matthew Walker",
    link: "https://www.sleepdiplomat.com/",
    type: "book",
    platform: "",
    language: "en",
    tags: ["Health", "Science", "Sleep"],
    status: "read",
    rating: 5,
    ratingDescription: "Crucial for well-being",
    keyInsights: "Sleep deprivation is a public health crisis. Sleep is vital for memory consolidation, emotional regulation, and physical health. REM sleep is critical for creativity.",
    quotes: [
      "The shorter your sleep, the shorter your life.",
      "Sleep is not an optional lifestyle luxury. It is a nonnegotiable biological imperative."
    ],
    impact: 5,
    length: "long",
    difficulty: "intermediate",
    relatedTo: [],
    personalReflection: "Prioritized sleep much more after reading this. Noticed significant improvements in focus and mood.",
    citationFormat: 'Walker, Matthew. Why We Sleep: Unlocking the Power of Sleep and Dreams. Scribner, 2017.'
  },
  {
    id: "10",
    dateAdded: "2025-02-25",
    dateRead: null,
    title: "Mastering React Hooks",
    author: "Dan Abramov",
    link: "https://react.dev/learn/understanding-your-ui",
    type: "article",
    platform: "React Documentation",
    language: "en",
    tags: ["Programming", "React", "Frontend Development"],
    status: "to-read",
    rating: null,
    ratingDescription: "",
    keyInsights: "",
    quotes: [],
    impact: null,
    length: "medium",
    difficulty: "advanced",
    relatedTo: [],
    personalReflection: "",
    citationFormat: 'Abramov, Dan. "Understanding Your UI." React Documentation, 25 Feb. 2025, react.dev/learn/understanding-your-ui.'
  }
];

// Utility functions for data processing
export const getUniqueValues = (data, field) => {
  return [...new Set(data.map(item => item[field]).filter(Boolean))];
};

export const getTagFrequency = (data) => {
  const tagCount = {};
  data.forEach(item => {
    item.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  return tagCount;
};

export const getReadingStats = (data) => {
  const readItems = data.filter(item => item.status === 'read');
  const totalItems = data.length;
  const averageRating = readItems.reduce((sum, item) => sum + (item.rating || 0), 0) / readItems.length;
  
  return {
    totalItems,
    readItems: readItems.length,
    inProgress: data.filter(item => item.status === 'in-progress').length,
    toRead: data.filter(item => item.status === 'to-read').length,
    averageRating: Math.round(averageRating * 10) / 10,
    averageImpact: Math.round(readItems.reduce((sum, item) => sum + (item.impact || 0), 0) / readItems.length * 10) / 10
  };
};

