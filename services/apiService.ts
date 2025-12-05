


import { Project, Lead, BlogPost, DashboardStats, AnalyticsData, ChartData, TeamMember, Testimonial, PricingPackage, FAQ, Devis, Subscriber, HomePageContent, SiteSettings, AnalyticsOverview, TrafficSource, PageMetric, UserBehavior, LeadAnalytics, ContentPerformance, User } from '../types';

// Mock Data
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Neon Fintech Platform',
    client: 'NeoBank Corp',
    division: 'TECH',
    tags: ['React', 'Node.js', 'Finance'],
    description: 'A cutting-edge banking dashboard with real-time analytics.',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    createdAt: '2023-10-15',
    featured: true
  },
  {
    id: '2',
    title: 'Luxury Fashion Rebrand',
    client: 'Vogue Styles',
    division: 'BRAND',
    tags: ['Identity', 'Strategy', 'Design'],
    description: 'Complete visual identity overhaul for a legacy fashion house.',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    createdAt: '2023-11-02',
    featured: true
  },
  {
    id: '3',
    title: 'Immersive 3D Experience',
    client: 'AutoFuture',
    division: 'STUDIO',
    tags: ['WebGL', '3D', 'Three.js'],
    description: 'Interactive showroom for the new electric vehicle lineup.',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    createdAt: '2023-11-20',
    featured: false
  },
  {
    id: '4',
    title: 'HealthCare App',
    client: 'MediCare',
    division: 'TECH',
    tags: ['Mobile', 'React Native', 'HIPAA'],
    description: 'Patient management system with secure messaging.',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    createdAt: '2023-12-05',
    featured: false
  }
];

const MOCK_LEADS: Lead[] = [
  {
    id: '101',
    name: 'Alice Johnson',
    email: 'alice@startuplab.com',
    phone: '+1 (555) 123-4567',
    company: 'StartupLab Inc.',
    division: 'TECH',
    status: 'NEW',
    budget: '$50k - $100k',
    message: 'Looking for a full-stack team to build our MVP. We need a React frontend and Node.js backend. The timeline is tight, looking to launch in 3 months.',
    receivedAt: '2023-12-01',
    internalNotes: ''
  },
  {
    id: '102',
    name: 'Bob Smith',
    email: 'bob@agency.com',
    phone: '+1 (555) 987-6543',
    company: 'Creative Agency',
    division: 'STUDIO',
    status: 'CONTACTED',
    budget: '$20k - $50k',
    message: 'Need a 3D explainer video for our product launch. We have the script ready, need visual magic.',
    eventDate: '2024-03-15',
    receivedAt: '2023-11-28',
    internalNotes: 'Contacted on Nov 29. Sent initial portfolio. Waiting for script review.'
  },
  {
    id: '103',
    name: 'Carol White',
    email: 'carol@retail.co',
    division: 'BRAND',
    status: 'CLOSED',
    budget: '$10k - $20k',
    message: 'Rebranding our physical stores. Need signage and wayfinding design.',
    receivedAt: '2023-11-15',
    internalNotes: 'Project declined due to budget constraints.'
  }
];

const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Web Design in 2024',
    slug: 'future-web-design-2024',
    excerpt: 'Explore the emerging trends that will shape the digital landscape in the coming year, from AI-driven layouts to immersive 3D experiences.',
    content: 'Full content of the blog post goes here...',
    category: 'Design',
    imageUrl: 'https://picsum.photos/400/300?random=10',
    status: 'PUBLISHED',
    publishedDate: '2023-12-10',
    readingTime: '5 min',
    featured: true,
    author: 'Sarah Jenkins',
    tags: ['UI/UX', 'Trends', 'Web Design'],
    metaTitle: 'Web Design Trends 2024',
    metaDescription: 'A comprehensive look at 2024 web design trends.'
  },
  {
    id: '2',
    title: 'Optimizing React Performance',
    slug: 'optimizing-react-performance',
    excerpt: 'A deep dive into memoization, lazy loading, and other techniques to speed up your React applications.',
    content: 'Technical content about React...',
    category: 'Engineering',
    imageUrl: 'https://picsum.photos/400/300?random=11',
    status: 'DRAFT',
    publishedDate: '2023-12-15',
    readingTime: '8 min',
    featured: false,
    author: 'Mike Chen',
    tags: ['React', 'Performance', 'JavaScript'],
    metaTitle: 'React Performance Guide',
    metaDescription: 'Learn how to make your React apps faster.'
  },
  {
    id: '3',
    title: 'Brand Identity vs. Brand Image',
    slug: 'brand-identity-vs-image',
    excerpt: 'Understanding the crucial differences between how you want to be perceived and how you actually are perceived.',
    content: 'Branding content...',
    category: 'Branding',
    imageUrl: 'https://picsum.photos/400/300?random=12',
    status: 'PUBLISHED',
    publishedDate: '2023-11-20',
    readingTime: '4 min',
    featured: false,
    author: 'Emma Wilson',
    tags: ['Branding', 'Marketing', 'Strategy']
  }
];

const MOCK_TEAM_MEMBERS: TeamMember[] = [
    {
        id: '1',
        name: 'Alex Rivera',
        role: 'Creative Director',
        division: 'STUDIO',
        bio: 'Award-winning designer with 10+ years of experience in digital art, motion graphics, and immersive branding experiences.',
        photoUrl: 'https://picsum.photos/200/200?random=20',
        expertise: ['Art Direction', '3D Design', 'Brand Strategy', 'Motion'],
        linkedinUrl: 'https://linkedin.com/in/alexrivera',
        email: 'alex@aureus.agency',
        featured: true,
        displayOrder: 1
    },
    {
        id: '2',
        name: 'Sarah Chen',
        role: 'Lead Architect',
        division: 'TECH',
        bio: 'Full-stack wizard specializing in scalable cloud architectures, React ecosystems, and AI integration.',
        photoUrl: 'https://picsum.photos/200/200?random=21',
        expertise: ['React', 'Node.js', 'AWS', 'System Design'],
        email: 'sarah@aureus.agency',
        featured: true,
        displayOrder: 2
    },
    {
        id: '3',
        name: 'Marcus Johnson',
        role: 'Brand Strategist',
        division: 'BRAND',
        bio: 'Helping companies find their voice in a crowded marketplace through data-driven storytelling and visual identity.',
        photoUrl: 'https://picsum.photos/200/200?random=22',
        expertise: ['Marketing', 'Copywriting', 'Social Media', 'PR'],
        featured: false,
        displayOrder: 3
    }
];

const MOCK_TESTIMONIALS: Testimonial[] = [
    {
        id: '1',
        name: 'Eleanor Fant',
        role: 'VP of Marketing',
        company: 'Nexus Tech',
        companyLogoUrl: 'https://picsum.photos/100/100?random=30',
        photoUrl: 'https://picsum.photos/200/200?random=30',
        content: 'Aureus Digital transformed our online presence completely. The Tech division delivered a flawless platform that has increased our user engagement by 200%. Truly exceptional work.',
        rating: 5,
        division: 'TECH',
        createdAt: '2023-11-10'
    },
    {
        id: '2',
        name: 'David Wright',
        role: 'Founder',
        company: 'Artisan Coffee',
        photoUrl: 'https://picsum.photos/200/200?random=31',
        content: 'The branding team really understood our essence. They created an identity that feels authentic yet modern. We receive compliments on our packaging daily.',
        rating: 5,
        division: 'BRAND',
        createdAt: '2023-10-05'
    },
    {
        id: '3',
        name: 'Sophia Li',
        role: 'Product Manager',
        company: 'FutureCars',
        companyLogoUrl: 'https://picsum.photos/100/100?random=32',
        content: 'The 3D showroom experience is mind-blowing. It works smoothly on all devices and has helped our pre-sales significantly.',
        rating: 4,
        division: 'STUDIO',
        videoUrl: 'https://youtube.com',
        createdAt: '2023-12-01'
    }
];

const MOCK_PRICING_PACKAGES: PricingPackage[] = [
    {
        id: '1',
        title: 'MVP Launchpad',
        division: 'TECH',
        price: '15,000€',
        priceNote: 'Starting price',
        description: 'Perfect for startups looking to get their product to market quickly with a robust foundation.',
        features: [
            'Core Feature Development',
            'React / Node.js Stack',
            'Basic Admin Dashboard',
            '3 Months Support',
            'Cloud Infrastructure Setup'
        ],
        isPopular: true,
        isHighlight: false,
        deliveryTime: '6-8 Weeks',
        revisions: '2 Rounds'
    },
    {
        id: '2',
        title: 'Brand Identity Suite',
        division: 'BRAND',
        price: '5,000€',
        priceNote: 'One-time fee',
        description: 'A complete visual identity overhaul to position your brand for success.',
        features: [
            'Logo Design (3 Concepts)',
            'Color Palette & Typography',
            'Brand Guidelines Book',
            'Social Media Assets',
            'Stationery Design'
        ],
        isPopular: false,
        isHighlight: false,
        deliveryTime: '4 Weeks',
        revisions: 'Unlimited'
    },
    {
        id: '3',
        title: 'Immersive WebGL Experience',
        division: 'STUDIO',
        price: '25,000€',
        priceNote: 'Starting price',
        description: 'High-end 3D web experience for product showcases or luxury brands.',
        features: [
            'Custom 3D Modeling',
            'Interactive WebGL Scene',
            'Performance Optimization',
            'Mobile Compatibility',
            'Sound Design Integration'
        ],
        isPopular: false,
        isHighlight: true,
        deliveryTime: '10-12 Weeks',
        revisions: '3 Rounds'
    }
];

const MOCK_FAQS: FAQ[] = [
    {
        id: '1',
        question: 'What is your typical project timeline?',
        answer: 'Timelines vary depending on the scope of the project. A typical branding project takes 4-6 weeks, while complex web applications can take 3-6 months. We will provide a detailed timeline during the proposal phase.',
        category: 'Process',
        displayOrder: 1
    },
    {
        id: '2',
        question: 'Do you offer ongoing support?',
        answer: 'Yes, we offer various maintenance and support packages to ensure your digital products remain secure and up-to-date after launch.',
        category: 'Services',
        displayOrder: 2
    },
    {
        id: '3',
        question: 'What are your payment terms?',
        answer: 'We typically require a 50% deposit to commence work, with the remaining balance due upon project completion. For larger projects, we can structure milestone-based payments.',
        category: 'Billing',
        displayOrder: 3
    },
    {
        id: '4',
        question: 'Can you work with our existing team?',
        answer: 'Absolutely. We often collaborate with internal marketing or dev teams to augment their capabilities or handle specific aspects of a project.',
        category: 'Services',
        displayOrder: 4
    }
];

const MOCK_DEVIS: Devis[] = [
    {
        id: 'DEVIS-2024-001',
        clientName: 'John Smith',
        clientEmail: 'john.smith@techflow.io',
        companyName: 'TechFlow Solutions',
        division: 'TECH',
        projectDescription: 'Custom CRM Development for internal sales team tracking.',
        budget: '25,000€',
        deadline: '2024-06-01',
        additionalRequirements: 'Must integrate with existing AWS infrastructure.',
        generatedContent: '# Proposal: Custom CRM Development\n\n## Overview\nThank you for considering Aureus Digital for your CRM needs.\n\n## Scope\n- User Authentication\n- Dashboard Analytics\n- Sales Pipeline Management\n\n## Investment\nTotal: 25,000€',
        createdAt: '2024-01-15',
        status: 'SENT'
    },
    {
        id: 'DEVIS-2024-002',
        clientName: 'Emily Davis',
        clientEmail: 'emily@boutiquefashion.com',
        companyName: 'Boutique Fashion',
        division: 'BRAND',
        projectDescription: 'Full brand identity refresh including logo, color palette, and social media assets.',
        budget: '8,000€',
        deadline: '2024-03-01',
        generatedContent: '# Proposal: Brand Identity Refresh\n\n## Overview\nElevating Boutique Fashion with a modern, chic aesthetic.\n\n## Deliverables\n- Logo Suite\n- Brand Guidelines\n- Social Media Kit\n\n## Investment\nTotal: 8,000€',
        createdAt: '2024-02-01',
        status: 'ACCEPTED'
    },
    {
        id: 'DEVIS-2024-003',
        clientName: 'Michael Brown',
        clientEmail: 'mike@autotrader.net',
        division: 'STUDIO',
        projectDescription: '3D Configurator for new car model launch.',
        budget: '40,000€',
        deadline: '2024-08-01',
        additionalRequirements: 'High fidelity rendering required.',
        generatedContent: '# Proposal: 3D Configurator\n\n## Overview\nInteractive 3D experience for web.\n\n## Technology\nWebGL, Three.js\n\n## Investment\nTotal: 40,000€',
        createdAt: '2024-02-10',
        status: 'DRAFT'
    }
];

const MOCK_SUBSCRIBERS: Subscriber[] = [
    { id: '1', email: 'user1@example.com', source: 'Footer', status: 'ACTIVE', subscribedAt: '2023-11-15' },
    { id: '2', email: 'client.vip@company.com', source: 'Modal', status: 'ACTIVE', subscribedAt: '2023-12-01' },
    { id: '3', email: 'inactive@test.com', source: 'Blog', status: 'UNSUBSCRIBED', subscribedAt: '2023-10-20', unsubscribedAt: '2023-12-10' },
    { id: '4', email: 'new.lead@startup.io', source: 'Contact Form', status: 'ACTIVE', subscribedAt: '2024-01-05' },
    { id: '5', email: 'designer@studio.art', source: 'Footer', status: 'ACTIVE', subscribedAt: '2024-01-12' },
];

const MOCK_USERS: User[] = [
    { id: '1', username: 'admin', email: 'admin@aureus.agency', role: 'SUPER_ADMIN', status: 'ACTIVE', lastLogin: '2024-03-10 09:30:00', createdAt: '2023-01-01', avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=random' },
    { id: '2', username: 'sarah', email: 'sarah@aureus.agency', role: 'ADMIN', status: 'ACTIVE', lastLogin: '2024-03-09 14:20:00', createdAt: '2023-02-15', avatarUrl: 'https://ui-avatars.com/api/?name=Sarah&background=random' },
    { id: '3', username: 'mike', email: 'mike@aureus.agency', role: 'EDITOR', status: 'INACTIVE', lastLogin: '2023-12-20 11:00:00', createdAt: '2023-05-10', avatarUrl: 'https://ui-avatars.com/api/?name=Mike&background=random' },
    { id: '4', username: 'viewer', email: 'guest@aureus.agency', role: 'VIEWER', status: 'ACTIVE', lastLogin: '2024-03-11 10:15:00', createdAt: '2024-01-05', avatarUrl: 'https://ui-avatars.com/api/?name=Viewer&background=random' },
];

let MOCK_HOME_PAGE_CONTENT: HomePageContent = {
    hero: {
        badgeText: 'Digital Excellence',
        title: 'We Craft Digital Futures',
        subtitle: 'TRANSFORMING IDEAS INTO REALITY',
        description: 'Aureus is a premium digital agency specializing in high-end web development, branding, and immersive experiences.',
        highlight: 'Building the extraordinary.'
    },
    metrics: [
        { id: '1', value: '10+', label: 'Years Experience', icon: 'Calendar', color: 'indigo', order: 1 },
        { id: '2', value: '50+', label: 'Awards Won', icon: 'Trophy', color: 'yellow', order: 2 },
        { id: '3', value: '200+', label: 'Projects Shipped', icon: 'Rocket', color: 'cyan', order: 3 },
        { id: '4', value: '98%', label: 'Client Satisfaction', icon: 'Heart', color: 'rose', order: 4 }
    ],
    methodology: {
        title: 'Our Methodology',
        description: 'We follow a rigorous, proven process to ensure every project exceeds expectations.',
        steps: [
            { id: '1', stepNumber: '01', title: 'Discovery', description: 'We dive deep into your brand, goals, and audience.', icon: 'Search', order: 1 },
            { id: '2', stepNumber: '02', title: 'Strategy', description: 'We build a roadmap for success.', icon: 'Map', order: 2 },
            { id: '3', stepNumber: '03', title: 'Design', description: 'We craft stunning visuals and intuitive UX.', icon: 'PenTool', order: 3 },
            { id: '4', stepNumber: '04', title: 'Development', description: 'We build with clean, scalable code.', icon: 'Code', order: 4 },
        ]
    },
    techStack: {
        title: 'Technology & Tools',
        techItems: ['React', 'Node.js', 'TypeScript', 'Next.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL'],
        creativeItems: ['Figma', 'Adobe CC', 'Blender', 'Cinema 4D', 'After Effects', 'Spline']
    },
    whyUs: {
        title: 'Why Choose Aureus?',
        items: [
            { id: '1', title: 'Innovation First', description: 'We stay ahead of the curve so you do too.', icon: 'Zap', color: 'yellow' },
            { id: '2', title: 'Pixel Perfect', description: 'Obsessive attention to detail in every design.', icon: 'Monitor', color: 'indigo' },
            { id: '3', title: 'Results Driven', description: 'We focus on ROI and tangible business outcomes.', icon: 'TrendingUp', color: 'emerald' },
        ]
    },
    teamTeaser: {
        title: 'Meet the Experts',
        description: 'A diverse team of world-class creative and technical talent working together to build your vision.'
    },
    blog: {
        title: 'Latest Insights',
        description: 'Thoughts, trends, and tutorials from the bleeding edge of digital.'
    }
};

let MOCK_SITE_SETTINGS: SiteSettings = {
  general: {
    siteName: 'Aureus Digital',
    siteDescription: 'Premium Digital Agency',
    footerDescription: 'Crafting digital futures.',
    contactEmail: 'hello@aureus.agency',
    careersEmail: 'careers@aureus.agency'
  },
  footer: {
    divisionLinks: [
      { id: '1', label: 'Tech', url: '/tech', order: 1 },
      { id: '2', label: 'Studio', url: '/studio', order: 2 },
      { id: '3', label: 'Brand', url: '/brand', order: 3 }
    ],
    companyLinks: [
      { id: '1', label: 'About', url: '/about', order: 1 },
      { id: '2', label: 'Careers', url: '/careers', order: 2 },
      { id: '3', label: 'Contact', url: '/contact', order: 3 }
    ],
    otherLinks: [
      { id: '1', label: 'Privacy Policy', url: '/privacy', order: 1 },
      { id: '2', label: 'Terms of Service', url: '/terms', order: 2 }
    ]
  },
  social: {
    twitter: 'https://twitter.com/aureus',
    linkedin: 'https://linkedin.com/company/aureus',
    github: 'https://github.com/aureus',
    instagram: 'https://instagram.com/aureus',
    youtube: 'https://youtube.com/aureus'
  },
  seo: {
    keywords: ['digital agency', 'web development', 'branding', '3d design'],
    defaultMetaTitle: 'Aureus Digital - Premium Agency',
    defaultMetaDescription: 'Aureus Digital is a full-service agency...',
    googleAnalyticsId: 'UA-XXXXX-Y',
    facebookPixelId: '1234567890'
  },
  features: {
    enableChatAssistant: true,
    enableNewsletter: true,
    enableQuizTools: false,
    maintenanceMode: false
  }
};

// --- DASHBOARD ---
export const getDashboardStats = async (): Promise<DashboardStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalProjects: MOCK_PROJECTS.length,
        activeLeads: MOCK_LEADS.filter(l => l.status !== 'CLOSED').length,
        blogPosts: MOCK_BLOG_POSTS.length,
        revenue: '€1.2M'
      });
    }, 500);
  });
};

export const getAnalyticsData = async (): Promise<AnalyticsData[]> => {
    return [
        { month: 'Jan', leads: 40, projects: 2 },
        { month: 'Feb', leads: 30, projects: 4 },
        { month: 'Mar', leads: 55, projects: 5 },
        { month: 'Apr', leads: 80, projects: 8 },
        { month: 'May', leads: 65, projects: 6 },
        { month: 'Jun', leads: 95, projects: 12 },
    ];
};

export const getDivisionDistribution = async (): Promise<ChartData[]> => {
    return [
        { name: 'TECH', value: 45, fill: '#06b6d4' },
        { name: 'STUDIO', value: 30, fill: '#d946ef' },
        { name: 'BRAND', value: 25, fill: '#6366f1' },
    ];
};

// --- PROJECTS ---
export const getProjects = async (): Promise<Project[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([...MOCK_PROJECTS]), 600));
};

export const createProject = async (project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
    const newProject = {
        ...project,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString().split('T')[0]
    };
    MOCK_PROJECTS.unshift(newProject);
    return newProject;
};

export const deleteProject = async (id: string): Promise<void> => {
    const index = MOCK_PROJECTS.findIndex(p => p.id === id);
    if (index > -1) MOCK_PROJECTS.splice(index, 1);
};

// --- LEADS ---
export const getLeads = async (): Promise<Lead[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([...MOCK_LEADS]), 600));
};

export const updateLead = async (id: string, updates: Partial<Lead>): Promise<Lead | null> => {
    return new Promise((resolve) => {
        const index = MOCK_LEADS.findIndex(l => l.id === id);
        if (index > -1) {
            MOCK_LEADS[index] = { ...MOCK_LEADS[index], ...updates };
            resolve(MOCK_LEADS[index]);
        } else {
            resolve(null);
        }
    });
};

export const deleteLead = async (id: string): Promise<void> => {
    return new Promise((resolve) => {
        const index = MOCK_LEADS.findIndex(l => l.id === id);
        if (index > -1) MOCK_LEADS.splice(index, 1);
        resolve();
    });
};

// --- BLOG POSTS ---
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([...MOCK_BLOG_POSTS]), 600));
};

export const getBlogPost = async (id: string): Promise<BlogPost | undefined> => {
    return new Promise((resolve) => {
        const post = MOCK_BLOG_POSTS.find(p => p.id === id);
        resolve(post);
    });
};

export const createBlogPost = async (post: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
    return new Promise((resolve) => {
        const newPost = {
            ...post,
            id: Math.random().toString(36).substr(2, 9)
        };
        MOCK_BLOG_POSTS.unshift(newPost);
        resolve(newPost);
    });
};

export const updateBlogPost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> => {
    return new Promise((resolve) => {
        const index = MOCK_BLOG_POSTS.findIndex(p => p.id === id);
        if (index > -1) {
            MOCK_BLOG_POSTS[index] = { ...MOCK_BLOG_POSTS[index], ...updates };
            resolve(MOCK_BLOG_POSTS[index]);
        } else {
            resolve(null);
        }
    });
};

export const deleteBlogPost = async (id: string): Promise<void> => {
    return new Promise((resolve) => {
        const index = MOCK_BLOG_POSTS.findIndex(p => p.id === id);
        if (index > -1) MOCK_BLOG_POSTS.splice(index, 1);
        resolve();
    });
};

// --- TEAM MEMBERS ---
export const getTeamMembers = async (): Promise<TeamMember[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_TEAM_MEMBERS]), 600));
};

export const createTeamMember = async (member: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
    return new Promise((resolve) => {
        const newMember = {
            ...member,
            id: Math.random().toString(36).substr(2, 9)
        };
        MOCK_TEAM_MEMBERS.push(newMember);
        resolve(newMember);
    });
};

export const updateTeamMember = async (id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> => {
     return new Promise((resolve) => {
        const index = MOCK_TEAM_MEMBERS.findIndex(m => m.id === id);
        if (index > -1) {
            MOCK_TEAM_MEMBERS[index] = { ...MOCK_TEAM_MEMBERS[index], ...updates };
            resolve(MOCK_TEAM_MEMBERS[index]);
        } else {
            resolve(null);
        }
    });
};

export const deleteTeamMember = async (id: string): Promise<void> => {
     return new Promise((resolve) => {
        const index = MOCK_TEAM_MEMBERS.findIndex(m => m.id === id);
        if (index > -1) MOCK_TEAM_MEMBERS.splice(index, 1);
        resolve();
    });
};

// --- TESTIMONIALS ---
export const getTestimonials = async (): Promise<Testimonial[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_TESTIMONIALS]), 600));
};

export const createTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'createdAt'>): Promise<Testimonial> => {
    return new Promise((resolve) => {
        const newTestimonial = {
            ...testimonial,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString().split('T')[0]
        };
        MOCK_TESTIMONIALS.push(newTestimonial);
        resolve(newTestimonial);
    });
};

export const updateTestimonial = async (id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> => {
    return new Promise((resolve) => {
        const index = MOCK_TESTIMONIALS.findIndex(t => t.id === id);
        if (index > -1) {
            MOCK_TESTIMONIALS[index] = { ...MOCK_TESTIMONIALS[index], ...updates };
            resolve(MOCK_TESTIMONIALS[index]);
        } else {
            resolve(null);
        }
    });
};

export const deleteTestimonial = async (id: string): Promise<void> => {
    return new Promise((resolve) => {
        const index = MOCK_TESTIMONIALS.findIndex(t => t.id === id);
        if (index > -1) MOCK_TESTIMONIALS.splice(index, 1);
        resolve();
    });
};

// --- PRICING PACKAGES ---
export const getPricingPackages = async (): Promise<PricingPackage[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_PRICING_PACKAGES]), 600));
};

export const createPricingPackage = async (pkg: Omit<PricingPackage, 'id'>): Promise<PricingPackage> => {
    return new Promise((resolve) => {
        const newPkg = {
            ...pkg,
            id: Math.random().toString(36).substr(2, 9)
        };
        MOCK_PRICING_PACKAGES.push(newPkg);
        resolve(newPkg);
    });
};

export const updatePricingPackage = async (id: string, updates: Partial<PricingPackage>): Promise<PricingPackage | null> => {
    return new Promise((resolve) => {
        const index = MOCK_PRICING_PACKAGES.findIndex(p => p.id === id);
        if (index > -1) {
            MOCK_PRICING_PACKAGES[index] = { ...MOCK_PRICING_PACKAGES[index], ...updates };
            resolve(MOCK_PRICING_PACKAGES[index]);
        } else {
            resolve(null);
        }
    });
};

export const deletePricingPackage = async (id: string): Promise<void> => {
    return new Promise((resolve) => {
        const index = MOCK_PRICING_PACKAGES.findIndex(p => p.id === id);
        if (index > -1) MOCK_PRICING_PACKAGES.splice(index, 1);
        resolve();
    });
};

// --- FAQS ---
export const getFAQs = async (): Promise<FAQ[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_FAQS]), 600));
};

export const createFAQ = async (faq: Omit<FAQ, 'id'>): Promise<FAQ> => {
    return new Promise((resolve) => {
        const newFAQ = {
            ...faq,
            id: Math.random().toString(36).substr(2, 9)
        };
        MOCK_FAQS.push(newFAQ);
        resolve(newFAQ);
    });
};

export const updateFAQ = async (id: string, updates: Partial<FAQ>): Promise<FAQ | null> => {
    return new Promise((resolve) => {
        const index = MOCK_FAQS.findIndex(f => f.id === id);
        if (index > -1) {
            MOCK_FAQS[index] = { ...MOCK_FAQS[index], ...updates };
            resolve(MOCK_FAQS[index]);
        } else {
            resolve(null);
        }
    });
};

export const deleteFAQ = async (id: string): Promise<void> => {
    return new Promise((resolve) => {
        const index = MOCK_FAQS.findIndex(f => f.id === id);
        if (index > -1) MOCK_FAQS.splice(index, 1);
        resolve();
    });
};

// --- DEVIS ---
export const getDevis = async (): Promise<Devis[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_DEVIS]), 600));
};

export const updateDevis = async (id: string, updates: Partial<Devis>): Promise<Devis | null> => {
    return new Promise((resolve) => {
        const index = MOCK_DEVIS.findIndex(d => d.id === id);
        if (index > -1) {
            MOCK_DEVIS[index] = { ...MOCK_DEVIS[index], ...updates };
            resolve(MOCK_DEVIS[index]);
        } else {
            resolve(null);
        }
    });
};

export const deleteDevis = async (id: string): Promise<void> => {
    return new Promise((resolve) => {
        const index = MOCK_DEVIS.findIndex(d => d.id === id);
        if (index > -1) MOCK_DEVIS.splice(index, 1);
        resolve();
    });
};

// --- NEWSLETTER SUBSCRIBERS ---
export const getSubscribers = async (): Promise<Subscriber[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_SUBSCRIBERS]), 600));
};

export const unsubscribeSubscriber = async (id: string): Promise<void> => {
    return new Promise((resolve) => {
        const index = MOCK_SUBSCRIBERS.findIndex(s => s.id === id);
        if (index > -1) {
            MOCK_SUBSCRIBERS[index] = { 
                ...MOCK_SUBSCRIBERS[index], 
                status: 'UNSUBSCRIBED',
                unsubscribedAt: new Date().toISOString().split('T')[0]
            };
        }
        resolve();
    });
};

export const deleteSubscriber = async (id: string): Promise<void> => {
    return new Promise((resolve) => {
        const index = MOCK_SUBSCRIBERS.findIndex(s => s.id === id);
        if (index > -1) MOCK_SUBSCRIBERS.splice(index, 1);
        resolve();
    });
};

// --- USERS MANAGEMENT ---
export const getUsers = async (): Promise<User[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_USERS]), 600));
};

export const createUser = async (user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User> => {
    return new Promise((resolve) => {
        const newUser: User = {
            ...user,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString().split('T')[0],
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`
        };
        MOCK_USERS.push(newUser);
        resolve(newUser);
    });
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
    return new Promise((resolve) => {
        const index = MOCK_USERS.findIndex(u => u.id === id);
        if (index > -1) {
            MOCK_USERS[index] = { ...MOCK_USERS[index], ...updates };
            resolve(MOCK_USERS[index]);
        } else {
            resolve(null);
        }
    });
};

export const deleteUser = async (id: string): Promise<void> => {
    return new Promise((resolve) => {
        const index = MOCK_USERS.findIndex(u => u.id === id);
        if (index > -1) MOCK_USERS.splice(index, 1);
        resolve();
    });
};

export const resetUserPassword = async (id: string): Promise<void> => {
    return new Promise((resolve) => {
        // Mock password reset
        console.log(`Password reset for user ${id}`);
        resolve();
    });
};


// --- HOME PAGE CONTENT ---
export const getHomePageContent = async (): Promise<HomePageContent> => {
    return new Promise((resolve) => setTimeout(() => resolve({ ...MOCK_HOME_PAGE_CONTENT }), 600));
};

export const updateHomePageContent = async (content: HomePageContent): Promise<void> => {
    return new Promise((resolve) => {
        MOCK_HOME_PAGE_CONTENT = content;
        resolve();
    });
};

// --- SITE SETTINGS ---
export const getSiteSettings = async (): Promise<SiteSettings> => {
    return new Promise((resolve) => setTimeout(() => resolve({ ...MOCK_SITE_SETTINGS }), 600));
};

export const updateSiteSettings = async (settings: SiteSettings): Promise<void> => {
    return new Promise((resolve) => {
        MOCK_SITE_SETTINGS = settings;
        resolve();
    });
};

// --- ANALYTICS & REPORTS (MOCK) ---
export const getAnalyticsOverview = async (range: string): Promise<AnalyticsOverview> => {
    // Generate mock trend data based on range
    const trendData = [];
    let days = 30;
    if (range === '7d') days = 7;
    if (range === '3m') days = 90;
    if (range === '1y') days = 365;

    const now = new Date();
    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        trendData.push({
            date: date.toISOString().split('T')[0].slice(5),
            views: Math.floor(Math.random() * 500) + 200,
            visitors: Math.floor(Math.random() * 300) + 100
        });
    }

    return new Promise(resolve => setTimeout(() => resolve({
        totalPageViews: trendData.reduce((a, b) => a + b.views, 0),
        uniqueVisitors: trendData.reduce((a, b) => a + b.visitors, 0),
        bounceRate: 42.5,
        avgSessionDuration: '2m 45s',
        conversionRate: 3.2,
        trendData
    }), 800));
};

export const getTrafficSources = async (range: string): Promise<TrafficSource[]> => {
    return new Promise(resolve => setTimeout(() => resolve([
        { source: 'Direct', visitors: 1250, percentage: 35, fill: '#6366f1' },
        { source: 'Organic Search', visitors: 980, percentage: 28, fill: '#06b6d4' },
        { source: 'Social Media', visitors: 750, percentage: 22, fill: '#d946ef' },
        { source: 'Referrals', visitors: 320, percentage: 10, fill: '#10b981' },
        { source: 'Paid Ads', visitors: 150, percentage: 5, fill: '#f59e0b' }
    ]), 600));
};

export const getPagePerformance = async (range: string): Promise<PageMetric[]> => {
    return new Promise(resolve => setTimeout(() => resolve([
        { path: '/', views: 5430, uniqueViews: 3200, avgTime: '1m 20s', bounceRate: 35 },
        { path: '/projects', views: 2100, uniqueViews: 1500, avgTime: '3m 10s', bounceRate: 25 },
        { path: '/blog', views: 1800, uniqueViews: 1200, avgTime: '2m 45s', bounceRate: 40 },
        { path: '/contact', views: 950, uniqueViews: 800, avgTime: '1m 05s', bounceRate: 20 },
        { path: '/about', views: 800, uniqueViews: 650, avgTime: '1m 50s', bounceRate: 30 },
    ]), 700));
};

export const getUserBehavior = async (range: string): Promise<UserBehavior> => {
    return new Promise(resolve => setTimeout(() => resolve({
        topQueries: [
            { query: 'web development', count: 120 },
            { query: 'branding agency', count: 95 },
            { query: '3d design', count: 80 },
            { query: 'app development', count: 65 },
        ],
        topBlogPosts: [
            { title: 'Future of Web Design', views: 450 },
            { title: 'React Performance', views: 320 },
            { title: 'Brand Identity', views: 280 },
        ],
        topProjects: [
            { title: 'Neon Fintech', views: 520 },
            { title: 'Luxury Fashion', views: 410 },
            { title: 'Immersive 3D', views: 380 },
        ],
        divisionInterest: [
            { division: 'TECH', percentage: 45, fill: '#06b6d4' },
            { division: 'STUDIO', percentage: 30, fill: '#d946ef' },
            { division: 'BRAND', percentage: 25, fill: '#6366f1' },
        ]
    }), 800));
};

export const getLeadAnalytics = async (range: string): Promise<LeadAnalytics> => {
     return new Promise(resolve => setTimeout(() => resolve({
        leadsBySource: [
            { source: 'Contact Form', count: 45 },
            { source: 'Email', count: 20 },
            { source: 'LinkedIn', count: 15 },
        ],
        leadsByDivision: [
            { division: 'TECH', count: 35 },
            { division: 'STUDIO', count: 25 },
            { division: 'BRAND', count: 20 },
        ],
        funnel: [
            { stage: 'Visitors', count: 5000, fill: '#6366f1' },
            { stage: 'Leads', count: 80, fill: '#06b6d4' },
            { stage: 'Qualified', count: 40, fill: '#10b981' },
            { stage: 'Proposals', count: 25, fill: '#f59e0b' },
            { stage: 'Closed', count: 10, fill: '#d946ef' },
        ],
        statusDistribution: [
            { status: 'NEW', count: 15 },
            { status: 'CONTACTED', count: 35 },
            { status: 'CLOSED', count: 30 },
        ]
    }), 700));
};

export const getContentPerformance = async (range: string): Promise<ContentPerformance> => {
     return new Promise(resolve => setTimeout(() => resolve({
        blogTotalViews: 5400,
        projectTotalViews: 8200,
        newsletterOpenRate: 24.5,
        chatInteractions: 350
    }), 600));
};