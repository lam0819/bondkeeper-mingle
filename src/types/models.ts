
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  job?: string;
  birthday?: Date | null;
  address?: string;
  notes?: string;
  tags: string[];
  lastContacted?: Date | null;
  interactions: Interaction[];
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
}

export interface Interaction {
  id: string;
  contactId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'other';
  title: string;
  description?: string;
  date: Date;
  createdAt: Date;
}

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
