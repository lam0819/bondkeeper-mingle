
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  User, Mail, Phone, Briefcase, MapPin, Calendar, Tag as TagIcon, X, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Contact, ContactTag } from '@/types/models';
import { useToast } from '@/hooks/use-toast';

interface ContactFormProps {
  initialData?: Contact;
  onSubmit: (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'interactions'>) => void;
  isEdit?: boolean;
}

const availableTags: ContactTag[] = [
  'family', 
  'friend', 
  'work', 
  'school', 
  'networking', 
  'hobby', 
  'important'
];

const ContactForm: React.FC<ContactFormProps> = ({ 
  initialData, 
  onSubmit,
  isEdit = false
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'interactions'>>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    company: initialData?.company || '',
    jobTitle: initialData?.jobTitle || '',
    address: initialData?.address || '',
    birthday: initialData?.birthday || null,
    notes: initialData?.notes || '',
    tags: initialData?.tags || [],
    image: initialData?.image || '',
    lastContacted: initialData?.lastContacted || null,
    reminderDate: initialData?.reminderDate || null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBirthdayChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, birthday: date || null }));
  };

  const handleTagToggle = (tag: ContactTag) => {
    setFormData(prev => {
      const currentTags = [...prev.tags];
      if (currentTags.includes(tag)) {
        return { ...prev, tags: currentTags.filter(t => t !== tag) };
      } else {
        return { ...prev, tags: [...currentTags, tag] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast({
        title: "Error",
        description: "First name and last name are required.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(formData);
  };

  const getTagColor = (tag: ContactTag, isSelected: boolean) => {
    if (isSelected) {
      switch(tag) {
        case 'family': return 'bg-red-100 text-red-800 border-red-300';
        case 'friend': return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'work': return 'bg-gray-100 text-gray-800 border-gray-300';
        case 'school': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'networking': return 'bg-purple-100 text-purple-800 border-purple-300';
        case 'hobby': return 'bg-green-100 text-green-800 border-green-300';
        case 'important': return 'bg-orange-100 text-orange-800 border-orange-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
      }
    }
    return 'bg-background border-input';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="firstName"
                name="firstName"
                placeholder="First name"
                className="pl-8"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="lastName"
                name="lastName"
                placeholder="Last name"
                className="pl-8"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                className="pl-8"
                value={formData.email || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                placeholder="Phone number"
                className="pl-8"
                value={formData.phone || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <div className="relative">
              <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="company"
                name="company"
                placeholder="Company"
                className="pl-8"
                value={formData.company || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <div className="relative">
              <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="jobTitle"
                name="jobTitle"
                placeholder="Job title"
                className="pl-8"
                value={formData.jobTitle || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="address"
              name="address"
              placeholder="Address"
              className="pl-8"
              value={formData.address || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthday">Birthday</Label>
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.birthday && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.birthday ? (
                    format(formData.birthday, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={formData.birthday || undefined}
                  onSelect={handleBirthdayChange}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => {
              const isSelected = formData.tags.includes(tag);
              return (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    "capitalize border", 
                    getTagColor(tag, isSelected)
                  )}
                  onClick={() => handleTagToggle(tag)}
                >
                  {isSelected ? (
                    <Check className="mr-1 h-3 w-3" />
                  ) : (
                    <TagIcon className="mr-1 h-3 w-3" />
                  )}
                  {tag}
                </Button>
              );
            })}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Add notes about this contact"
            rows={3}
            value={formData.notes || ''}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? 'Update Contact' : 'Add Contact'}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
