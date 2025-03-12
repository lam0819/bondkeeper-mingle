
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ContactForm from '@/components/ContactForm';
import { useCrm } from '@/context/CrmContext';
import { Contact } from '@/types/models';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ContactEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getContact, updateContact } = useCrm();
  const { toast } = useToast();
  
  const contact = id ? getContact(id) : undefined;
  
  if (!contact) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Contact not found</h2>
          <p className="text-muted-foreground mt-2">
            The contact you're trying to edit doesn't exist or has been deleted.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/contacts">Go back to contacts</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'interactions'>) => {
    const updatedContact: Contact = {
      ...contact,
      ...data,
    };
    
    updateContact(updatedContact);
    toast({
      title: 'Contact updated',
      description: `${data.firstName} ${data.lastName}'s information has been updated.`,
    });
    navigate(`/contacts/${id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Contact</h1>
        <p className="text-muted-foreground mt-2">
          Update {contact.firstName} {contact.lastName}'s contact information.
        </p>
      </div>
      
      <div className="border rounded-lg p-6 bg-card">
        <ContactForm initialData={contact} onSubmit={handleSubmit} isEdit />
      </div>
    </div>
  );
};

export default ContactEdit;
