
export type ContactTag = 
  | 'family' 
  | 'friend' 
  | 'work' 
  | 'school' 
  | 'networking' 
  | 'hobby' 
  | 'important';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  address?: string;
  birthday?: Date | null;
  notes?: string;
  tags: ContactTag[];
  image?: string;
  lastContacted?: Date | null;
  reminderDate?: Date | null;
  interactions: Interaction[];
  createdAt: Date;
  updatedAt: Date;
}

export type InteractionType = 
  | 'call' 
  | 'meeting' 
  | 'email' 
  | 'message' 
  | 'social' 
  | 'other';

export interface Interaction {
  id: string;
  contactId: string;
  type: InteractionType;
  date: Date;
  notes?: string;
  createdAt: Date;
}

export interface Reminder {
  id: string;
  contactId: string;
  contact: Contact;
  date: Date;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalContacts: number;
  newContactsThisMonth: number;
  upcomingReminders: number;
  recentInteractions: number;
}
