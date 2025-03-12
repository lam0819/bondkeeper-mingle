
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  job?: string;
  jobTitle?: string; // Added this field
  birthday?: Date | null;
  address?: string;
  notes?: string;
  tags: string[];
  lastContacted?: Date | null;
  interactions: Interaction[];
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  image?: string; // Added for compatibility
  reminderDate?: Date | null; // Added this field
}

export type ContactTag = 'family' | 'friend' | 'work' | 'school' | 'networking' | 'hobby' | 'important';

export interface Interaction {
  id: string;
  contactId: string;
  type: InteractionType;
  title: string;
  description?: string;
  notes?: string; // Added this field
  date: Date;
  createdAt: Date;
}

export type InteractionType = 'call' | 'meeting' | 'email' | 'message' | 'social' | 'note' | 'other';

export interface Reminder {
  id: string;
  contactId: string;
  contact: Contact;
  title: string;
  description?: string;
  date: Date;
  completed: boolean;
  recurring?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  createdAt: Date;
}

export interface DashboardStats {
  totalContacts: number;
  newContactsThisMonth: number;
  upcomingReminders: number;
  recentInteractions: number;
}
