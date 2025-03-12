
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Contact, Interaction, Reminder, DashboardStats } from '@/types/models';

interface CrmContextType {
  contacts: Contact[];
  reminders: Reminder[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'interactions'>) => void;
  updateContact: (contact: Contact) => void;
  deleteContact: (id: string) => void;
  addInteraction: (interaction: Omit<Interaction, 'id' | 'createdAt'>) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'contact'>) => void;
  updateReminder: (id: string, completed: boolean) => void;
  deleteReminder: (id: string) => void;
  getContact: (id: string) => Contact | undefined;
  getDashboardStats: () => DashboardStats;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

const localStorageKey = 'personal-crm-data';

interface CrmData {
  contacts: Contact[];
  reminders: Reminder[];
}

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CrmData>({ contacts: [], reminders: [] });

  // Load data from localStorage on initial load
  useEffect(() => {
    const storedData = localStorage.getItem(localStorageKey);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData, (key, value) => {
          // Convert date strings back to Date objects
          if (key === 'birthday' || key === 'lastContacted' || key === 'reminderDate' || 
              key === 'date' || key === 'createdAt' || key === 'updatedAt') {
            return value ? new Date(value) : null;
          }
          return value;
        });
        setData(parsedData);
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  }, [data]);

  const addContact = (newContact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'interactions'>) => {
    const now = new Date();
    const contact: Contact = {
      ...newContact,
      id: uuidv4(),
      interactions: [],
      createdAt: now,
      updatedAt: now,
    };
    
    setData(prev => ({
      ...prev,
      contacts: [...prev.contacts, contact]
    }));
  };

  const updateContact = (updatedContact: Contact) => {
    const now = new Date();
    
    setData(prev => ({
      ...prev,
      contacts: prev.contacts.map(contact => 
        contact.id === updatedContact.id 
          ? { ...updatedContact, updatedAt: now } 
          : contact
      )
    }));
  };

  const deleteContact = (id: string) => {
    setData(prev => ({
      contacts: prev.contacts.filter(contact => contact.id !== id),
      reminders: prev.reminders.filter(reminder => reminder.contactId !== id)
    }));
  };

  const addInteraction = (newInteraction: Omit<Interaction, 'id' | 'createdAt'>) => {
    const now = new Date();
    const interaction: Interaction = {
      ...newInteraction,
      id: uuidv4(),
      createdAt: now,
    };
    
    setData(prev => ({
      ...prev,
      contacts: prev.contacts.map(contact => 
        contact.id === newInteraction.contactId 
          ? { 
              ...contact, 
              interactions: [...contact.interactions, interaction],
              lastContacted: newInteraction.date > (contact.lastContacted || new Date(0)) 
                ? newInteraction.date 
                : contact.lastContacted,
              updatedAt: now
            } 
          : contact
      )
    }));
  };

  const addReminder = (newReminder: Omit<Reminder, 'id' | 'createdAt' | 'contact'>) => {
    const contact = data.contacts.find(c => c.id === newReminder.contactId);
    if (!contact) return;
    
    const now = new Date();
    const reminder: Reminder = {
      ...newReminder,
      id: uuidv4(),
      contact,
      createdAt: now,
    };
    
    setData(prev => ({
      ...prev,
      reminders: [...prev.reminders, reminder]
    }));
  };

  const updateReminder = (id: string, completed: boolean) => {
    setData(prev => ({
      ...prev,
      reminders: prev.reminders.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed } 
          : reminder
      )
    }));
  };

  const deleteReminder = (id: string) => {
    setData(prev => ({
      ...prev,
      reminders: prev.reminders.filter(reminder => reminder.id !== id)
    }));
  };

  const getContact = (id: string) => {
    return data.contacts.find(contact => contact.id === id);
  };

  const getDashboardStats = (): DashboardStats => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const newContactsThisMonth = data.contacts.filter(
      contact => contact.createdAt >= firstDayOfMonth
    ).length;
    
    // Count interactions in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentInteractions = data.contacts.reduce((count, contact) => {
      const recentCount = contact.interactions.filter(
        interaction => interaction.date >= thirtyDaysAgo
      ).length;
      return count + recentCount;
    }, 0);
    
    // Count upcoming reminders (not completed and in the future)
    const upcomingReminders = data.reminders.filter(
      reminder => !reminder.completed && reminder.date >= now
    ).length;
    
    return {
      totalContacts: data.contacts.length,
      newContactsThisMonth,
      upcomingReminders,
      recentInteractions
    };
  };

  return (
    <CrmContext.Provider
      value={{
        contacts: data.contacts,
        reminders: data.reminders,
        addContact,
        updateContact,
        deleteContact,
        addInteraction,
        addReminder,
        updateReminder,
        deleteReminder,
        getContact,
        getDashboardStats
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
