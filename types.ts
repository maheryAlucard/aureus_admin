

export type Division = 'TECH' | 'STUDIO' | 'BRAND';

export interface Project {
  id: string;
  title: string;
  client: string;
  division: Division;
  tags: string[];
  description: string;
  imageUrl: string;
  createdAt: string;
  featured: boolean;
  // Extended fields
  fullDescription?: string;
  additionalImages?: string[];
  videoUrl?: string;
  technologies?: string[];
  results?: string[];
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  division: Division | 'GENERAL';
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  budget?: string;
  message: string;
  eventDate?: string;
  receivedAt: string;
  internalNotes?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  status: 'DRAFT' | 'PUBLISHED';
  publishedDate: string;
  readingTime: string;
  featured: boolean;
  author: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  division: Division | 'GENERAL';
  bio: string;
  photoUrl: string;
  expertise: string[];
  linkedinUrl?: string;
  email?: string;
  twitterUrl?: string;
  featured: boolean;
  displayOrder: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  companyLogoUrl?: string;
  photoUrl?: string;
  content: string;
  rating: number; // 1-5
  division?: Division | 'GENERAL';
  videoUrl?: string;
  createdAt: string;
}

export interface PricingPackage {
  id: string;
  title: string;
  division: Division | 'GENERAL';
  price: string;
  priceNote?: string; // e.g., "per month", "starting at"
  description: string;
  features: string[];
  isPopular: boolean;
  isHighlight: boolean;
  deliveryTime?: string;
  revisions?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string; // e.g., "General", "Services", "Billing"
  displayOrder: number;
}

export interface Devis {
  id: string;
  clientName: string;
  clientEmail: string;
  companyName?: string;
  division: Division | 'GENERAL';
  projectDescription: string;
  budget: string;
  deadline?: string;
  additionalRequirements?: string;
  generatedContent: string; // The text content of the quote
  createdAt: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
}

export interface Subscriber {
  id: string;
  email: string;
  source: string; // e.g., 'Footer', 'Modal', 'Checkout'
  status: 'ACTIVE' | 'UNSUBSCRIBED';
  subscribedAt: string;
  unsubscribedAt?: string;
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin?: string;
  createdAt: string;
  avatarUrl?: string;
}

// --- CONTENT MANAGEMENT ---

export interface MetricItem {
    id: string;
    value: string;
    label: string;
    icon: string;
    color: string;
    order: number;
}

export interface MethodologyStep {
    id: string;
    stepNumber: string;
    title: string;
    description: string;
    icon: string;
    order: number;
}

export interface WhyUsItem {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
}

export interface HomePageContent {
  hero: {
    badgeText: string;
    title: string;
    subtitle: string;
    description: string;
    highlight: string;
  };
  metrics: MetricItem[];
  methodology: {
    title: string;
    description: string;
    steps: MethodologyStep[];
  };
  techStack: {
      title: string;
      techItems: string[];
      creativeItems: string[];
  };
  whyUs: {
      title: string;
      items: WhyUsItem[];
  };
  teamTeaser: {
      title: string;
      description: string;
  };
  blog: {
      title: string;
      description: string;
  };
}

// --- SITE SETTINGS ---

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  order: number;
}

export interface SiteSettings {
  general: {
    siteName: string;
    siteDescription: string;
    footerDescription: string;
    contactEmail: string;
    careersEmail: string;
  };
  footer: {
    divisionLinks: FooterLink[];
    companyLinks: FooterLink[];
    otherLinks: FooterLink[];
  };
  social: {
    twitter: string;
    linkedin: string;
    github: string;
    instagram: string;
    youtube: string;
  };
  seo: {
    keywords: string[];
    defaultMetaTitle: string;
    defaultMetaDescription: string;
    googleAnalyticsId: string;
    facebookPixelId: string;
  };
  features: {
    enableChatAssistant: boolean;
    enableNewsletter: boolean;
    enableQuizTools: boolean;
    maintenanceMode: boolean;
  };
}

export interface DashboardStats {
  totalProjects: number;
  activeLeads: number;
  blogPosts: number;
  revenue: string;
}

export interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

export interface AnalyticsData {
  month: string;
  leads: number;
  projects: number;
}

// --- ANALYTICS ---

export interface AnalyticsOverview {
  totalPageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: string;
  conversionRate: number;
  trendData: { date: string; views: number; visitors: number }[];
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  fill?: string;
}

export interface PageMetric {
  path: string;
  views: number;
  uniqueViews: number;
  avgTime: string;
  bounceRate: number;
}

export interface UserBehavior {
  topQueries: { query: string; count: number }[];
  topBlogPosts: { title: string; views: number }[];
  topProjects: { title: string; views: number }[];
  divisionInterest: { division: string; percentage: number; fill?: string }[];
}

export interface LeadAnalytics {
  leadsBySource: { source: string; count: number }[];
  leadsByDivision: { division: string; count: number }[];
  funnel: { stage: string; count: number; fill?: string }[];
  statusDistribution: { status: string; count: number }[];
}

export interface ContentPerformance {
    blogTotalViews: number;
    projectTotalViews: number;
    newsletterOpenRate: number;
    chatInteractions: number;
}