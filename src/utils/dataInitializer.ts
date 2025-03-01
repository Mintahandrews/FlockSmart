import toast from "react-hot-toast";
import { checkSupabaseConnection, supabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";

/**
 * Initializes default data for the application
 * This function seeds the localStorage with initial data for demo purposes
 * or creates sample data in Supabase if connected
 */
export const initializeAppData = async () => {
  try {
    // Check if data already exists to avoid reset on reload
    const dataInitialized = localStorage.getItem("dataInitialized");
    if (dataInitialized === "true") return;

    // Check if we have a working Supabase connection
    const isSupabaseConnected = await checkSupabaseConnection();

    if (isSupabaseConnected) {
      await initializeSupabaseData();
    } else {
      initializeLocalStorageData();
    }

    // Mark data as initialized
    localStorage.setItem("dataInitialized", "true");
  } catch (error) {
    console.error("Error initializing demo data:", error);
    // Don't show error toast here, just fall back to localStorage
    initializeLocalStorageData();
  }
};

/**
 * Initialize sample data in Supabase tables
 */
const initializeSupabaseData = async () => {
  try {
    // Check if users table has data
    const { data: existingUsers } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    // Only seed if no users exist
    if (!existingUsers || existingUsers.length === 0) {
      // Insert sample users
      await supabase.from("users").insert([
        {
          id: "1001",
          email: "tutor@example.com",
          name: "Sarah Miller",
          role: "provider",
          is_verified: true,
          profile: {
            university: "Stanford University",
            major: "Computer Science",
            skills: ["Mathematics", "Programming", "Data Structures"],
            bio: "Passionate computer science tutor with 5+ years of teaching experience. I specialize in algorithms, data structures, and web development.",
          },
        },
        {
          id: "1002",
          email: "tutor2@example.com",
          name: "James Wilson",
          role: "provider",
          is_verified: true,
          profile: {
            university: "MIT",
            major: "Physics",
            skills: ["Physics", "Calculus", "Quantum Mechanics"],
            bio: "Physics PhD candidate with a strong background in mathematics. I enjoy making complex concepts accessible to students of all levels.",
          },
        },
        {
          id: "1003",
          email: "student@example.com",
          name: "Andrews Mintah",
          role: "seeker",
          is_verified: true,
          profile: {
            university: "UCLA",
            major: "Business Administration",
            bio: "Business student looking for help with statistics and economics courses.",
          },
        },
      ]);

      // Add more sample data to other tables as needed
    }
  } catch (error) {
    console.error("Error initializing Supabase data:", error);
    // Fall back to localStorage if Supabase seeding fails
    initializeLocalStorageData();
  }
};

/**
 * Initialize sample data in localStorage (fallback method)
 */
const initializeLocalStorageData = () => {
  // Initialize users if empty
  if (!localStorage.getItem("users")) {
    const initialUsers = [
      {
        id: "1001",
        email: "tutor@example.com",
        password: "password123", // insecure, for demo only
        name: "Sarah Miller",
        role: "provider",
        is_verified: true,
        isVerified: true,
        profile: {
          university: "Stanford University",
          major: "Computer Science",
          graduationYear: "2023",
          bio: "Passionate computer science tutor with 5+ years of teaching experience. I specialize in algorithms, data structures, and web development.",
          skills: [
            "Mathematics",
            "Programming",
            "Data Structures",
            "Algorithms",
            "Web Development",
          ],
        },
      },
      {
        id: "1002",
        email: "tutor2@example.com",
        password: "password123", // insecure, for demo only
        name: "James Wilson",
        role: "provider",
        is_verified: true,
        isVerified: true,
        profile: {
          university: "MIT",
          major: "Physics",
          graduationYear: "2021",
          bio: "Physics PhD candidate with a strong background in mathematics. I enjoy making complex concepts accessible to students of all levels.",
          skills: [
            "Physics",
            "Calculus",
            "Quantum Mechanics",
            "Differential Equations",
            "Statistics",
          ],
        },
      },
      {
        id: "1003",
        email: "student@example.com",
        password: "password123", // insecure, for demo only
        name: "Andrews Mintah",
        role: "seeker",
        is_verified: true,
        isVerified: true,
        profile: {
          university: "UCLA",
          major: "Business Administration",
          graduationYear: "2024",
          bio: "Business student looking for help with statistics and economics courses.",
        },
      },
    ];
    localStorage.setItem("users", JSON.stringify(initialUsers));

    // Auto-login with a demo user for convenience
    const demoUser = {
      id: "1003",
      email: "student@example.com",
      name: "Andrews Mintah",
      role: "seeker",
      isVerified: true,
      profile: {
        university: "UCLA",
        major: "Business Administration",
        graduationYear: "2024",
        bio: "Business student looking for help with statistics and economics courses.",
      },
    };

    localStorage.setItem("user", JSON.stringify({ user: demoUser }));
  }

  // Initialize study groups if empty
  if (!localStorage.getItem("studyGroups")) {
    const initialStudyGroups = [
      {
        id: "sg_001",
        name: "Calculus Study Group",
        description:
          "A group for discussing calculus problems and concepts. All levels welcome!",
        subjectArea: "Mathematics",
        members: ["1001", "1003"],
        createdBy: "1001",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        isPublic: true,
        tags: ["Calculus", "Mathematics", "Beginners Welcome"],
      },
      {
        id: "sg_002",
        name: "Web Development Projects",
        description:
          "Collaborate on web development projects and learn together. Share resources and tips.",
        subjectArea: "Computer Science",
        members: ["1002"],
        createdBy: "1002",
        createdAt: new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000
        ).toISOString(),
        isPublic: true,
        tags: ["Web Development", "JavaScript", "React", "Projects"],
      },
    ];
    localStorage.setItem("studyGroups", JSON.stringify(initialStudyGroups));
  }

  // Initialize services if empty
  if (!localStorage.getItem("services")) {
    const initialServices = [
      {
        id: "serv_001",
        title: "Need help with Linear Algebra assignment",
        description:
          "I'm struggling with eigenvalues and eigenvectors. Need someone to explain the concepts and help me with my assignment.",
        subjectArea: "Mathematics",
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        budget: 35,
        complexity: "intermediate",
        status: "open",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        creatorName: "Andrews Mintah",
        creatorId: "1003",
      },
      {
        id: "serv_002",
        title: "Help building a React portfolio website",
        description:
          "I need assistance creating a portfolio website using React and Tailwind CSS. Looking for someone who can guide me through the process.",
        subjectArea: "Computer Science",
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        budget: 50,
        complexity: "beginner",
        status: "open",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        creatorName: "Andrews Mintah",
        creatorId: "1003",
      },
      {
        id: "serv_003",
        title: "Physics tutor needed for mechanics concepts",
        description:
          "Looking for a physics tutor to help me understand mechanics concepts, particularly forces and motion in two dimensions.",
        subjectArea: "Physics",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        budget: 40,
        complexity: "intermediate",
        status: "open",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        creatorName: "Andrews Mintah",
        creatorId: "1003",
      },
    ];
    localStorage.setItem("services", JSON.stringify(initialServices));
  }

  // Initialize resources if empty
  if (!localStorage.getItem("resources")) {
    const initialResources = [
      {
        id: "res_001",
        title: "Calculus Made Easy",
        description:
          "A comprehensive guide to calculus concepts with practice problems and solutions.",
        type: "document",
        url: "https://example.com/calculus-guide",
        subjectArea: "Mathematics",
        createdBy: "1001",
        createdAt: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      {
        id: "res_002",
        title: "React Fundamentals - Video Tutorial",
        description:
          "Learn React from scratch with this step-by-step video tutorial series.",
        type: "video",
        url: "https://example.com/react-tutorial",
        subjectArea: "Computer Science",
        createdBy: "1002",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem("resources", JSON.stringify(initialResources));
  }

  // Initialize conversations and messages if empty
  if (!localStorage.getItem("conversations")) {
    const initialConversations = [
      {
        id: "conv_001",
        participants: ["1001", "1003"],
        lastUpdated: new Date(
          Date.now() - 1 * 24 * 60 * 60 * 1000
        ).toISOString(),
        sharedNotes:
          "Notes from our calculus tutoring session:\n- Reviewed derivatives and their applications\n- Discussed optimization problems\n- Practice problems: Textbook chapter 4, problems 1-10",
      },
    ];
    localStorage.setItem("conversations", JSON.stringify(initialConversations));
  }

  if (!localStorage.getItem("messages")) {
    const initialMessages = [
      {
        id: "msg_001",
        senderId: "1003",
        receiverId: "1001",
        content:
          "Hi Sarah, I'm having trouble with calculus derivatives. Are you available for tutoring?",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: "msg_002",
        senderId: "1001",
        receiverId: "1003",
        content:
          "Hi Alex! Yes, I'd be happy to help. When would you like to schedule a session?",
        timestamp: new Date(
          Date.now() - 1.9 * 24 * 60 * 60 * 1000
        ).toISOString(),
        read: true,
      },
      {
        id: "msg_003",
        senderId: "1003",
        receiverId: "1001",
        content: "Would tomorrow at 4pm work for you?",
        timestamp: new Date(
          Date.now() - 1.8 * 24 * 60 * 60 * 1000
        ).toISOString(),
        read: true,
      },
      {
        id: "msg_004",
        senderId: "1001",
        receiverId: "1003",
        content:
          "That works perfectly. I'll set up a collaborative space for us to work in.",
        timestamp: new Date(
          Date.now() - 1.7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        read: true,
      },
    ];
    localStorage.setItem("messages", JSON.stringify(initialMessages));
  }

  // Initialize reviews if empty
  if (!localStorage.getItem("reviews")) {
    const initialReviews = [
      {
        id: "rev_001",
        serviceId: "serv_001",
        reviewerId: "1003",
        providerId: "1001",
        rating: 5,
        comment:
          "Sarah was an excellent tutor. She explained the linear algebra concepts clearly and helped me complete my assignment. Highly recommended!",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem("reviews", JSON.stringify(initialReviews));
  }

  // Initialize payment-related data
  if (!localStorage.getItem("paymentMethods_1003")) {
    const demoPaymentMethod = {
      id: `pm_${uuidv4()}`,
      type: "visa",
      name: "Visa Card",
      details: "Card ending in 4242",
      isDefault: true,
      lastUsed: new Date().toISOString(),
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/200px-Visa.svg.png",
    };
    localStorage.setItem(
      "paymentMethods_1003",
      JSON.stringify([demoPaymentMethod])
    );
  }

  // Initialize wallet for the demo user
  if (!localStorage.getItem("wallet_1003")) {
    const demoWallet = {
      id: `wallet_1003`,
      userId: "1003",
      balance: 250.0,
      currency: "USD",
      updatedAt: new Date().toISOString(),
      transactions: [],
    };
    localStorage.setItem("wallet_1003", JSON.stringify(demoWallet));
  }

  // Initialize transactions
  if (!localStorage.getItem("transactions_1003")) {
    localStorage.setItem("transactions_1003", JSON.stringify([]));
  }

  // Initialize other collections
  if (!localStorage.getItem("plagiarismResults")) {
    localStorage.setItem("plagiarismResults", JSON.stringify([]));
  }

  if (!localStorage.getItem("reports")) {
    localStorage.setItem("reports", JSON.stringify([]));
  }

  // Initialize badges
  if (!localStorage.getItem("badges")) {
    const initialBadges = [
      {
        id: "badge_first_session",
        name: "First Steps",
        description: "Completed your first tutoring session",
        icon: "🏆",
        category: "achievement",
        pointsValue: 50,
        requirement: { type: "sessions_completed", value: 1 },
      },
      {
        id: "badge_five_sessions",
        name: "Regular Learner",
        description: "Completed 5 tutoring sessions",
        icon: "🎓",
        category: "learning",
        pointsValue: 100,
        requirement: { type: "sessions_completed", value: 5 },
      },
      {
        id: "badge_first_group",
        name: "Team Player",
        description: "Joined your first study group",
        icon: "👥",
        category: "collaboration",
        pointsValue: 50,
        requirement: { type: "study_groups_joined", value: 1 },
      },
      {
        id: "badge_first_tutor",
        name: "Helping Hand",
        description: "Provided your first tutoring service",
        icon: "🤝",
        category: "teaching",
        pointsValue: 75,
        requirement: { type: "services_provided", value: 1 },
      },
      {
        id: "badge_week_streak",
        name: "Consistency",
        description: "Used the platform for 7 consecutive days",
        icon: "📆",
        category: "participation",
        pointsValue: 125,
        requirement: { type: "days_active", value: 7 },
      },
    ];
    localStorage.setItem("badges", JSON.stringify(initialBadges));
  }

  // Initialize userProgress for achievements
  if (!localStorage.getItem("userProgress_1003")) {
    const initialProgress = {
      userId: "1003",
      points: 150,
      level: 1,
      badges: [
        {
          userId: "1003",
          badgeId: "badge_first_session",
          earnedAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      ],
      stats: {
        sessionsCompleted: 1,
        servicesProvided: 0,
        studyGroupsJoined: 1,
        resourcesShared: 0,
        daysActive: 3,
      },
    };
    localStorage.setItem("userProgress_1003", JSON.stringify(initialProgress));
  }
};
