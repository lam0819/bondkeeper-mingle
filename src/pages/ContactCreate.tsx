
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContactForm from '@/components/ContactForm';
import { useCrm } from '@/context/CrmContext';
import { useToast } from '@/hooks/use-toast';
import { Contact } from '@/types/models';

const ContactCreate = () => {
  const navigate = useNavigate();
  const { addContact } = useCrm();
  const { toast } = useToast();

  const handleSubmit = (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'interactions'>) => {
    addContact(data);
    toast({
      title: 'Contact added',
      description: `${data.firstName} ${data.lastName} has been added to your contacts.`,
    });
    navigate('/contacts');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Contact</h1>
        <p className="text-muted-foreground mt-2">
          Add a new contact to your personal CRM.
        </p>
      </div>
      
      <div className="border rounded-lg p-6 bg-card">
        <ContactForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ContactCreate;
