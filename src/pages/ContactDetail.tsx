
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  User, Mail, Phone, Briefcase, MapPin, Calendar, Tag as TagIcon,
  Edit, Trash, Plus, MoreHorizontal, MessageCircle, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCrm } from '@/context/CrmContext';
import { Contact, InteractionType } from '@/types/models';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const ContactDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getContact, deleteContact, addInteraction, addReminder } = useCrm();
  const { toast } = useToast();
  
  const [contact, setContact] = useState<Contact | undefined>(
    id ? getContact(id) : undefined
  );
  
  const [interactionDialogOpen, setInteractionDialogOpen] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [interactionType, setInteractionType] = useState<InteractionType>('call');
  const [interactionNotes, setInteractionNotes] = useState('');
  const [interactionDate, setInteractionDate] = useState<Date>(new Date());
  
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDescription, setReminderDescription] = useState('');
  const [reminderDate, setReminderDate] = useState<Date>(new Date());
  
  if (!contact) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Contact not found</h2>
          <p className="text-muted-foreground mt-2">
            The contact you're looking for doesn't exist or has been deleted.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/contacts">Go back to contacts</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteContact(contact.id);
    toast({
      title: 'Contact deleted',
      description: `${contact.firstName} ${contact.lastName} has been removed.`,
    });
    navigate('/contacts');
  };

  const handleAddInteraction = () => {
    if (!interactionNotes.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some notes for the interaction.',
        variant: 'destructive',
      });
      return;
    }

    addInteraction({
      contactId: contact.id,
      type: interactionType,
      date: interactionDate,
      notes: interactionNotes,
    });

    toast({
      title: 'Interaction added',
      description: 'The interaction has been recorded successfully.',
    });

    setInteractionType('call');
    setInteractionNotes('');
    setInteractionDate(new Date());
    setInteractionDialogOpen(false);

    // Refresh contact data
    setContact(getContact(contact.id));
  };

  const handleAddReminder = () => {
    if (!reminderTitle.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a title for the reminder.',
        variant: 'destructive',
      });
      return;
    }

    addReminder({
      contactId: contact.id,
      title: reminderTitle,
      description: reminderDescription,
      date: reminderDate,
      completed: false,
    });

    toast({
      title: 'Reminder added',
      description: 'The reminder has been scheduled successfully.',
    });

    setReminderTitle('');
    setReminderDescription('');
    setReminderDate(new Date());
    setReminderDialogOpen(false);
  };

  const getInteractionIcon = (type: InteractionType) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'meeting': return <User className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'message': return <MessageCircle className="h-4 w-4" />;
      case 'social': return <User className="h-4 w-4" />;
      default: return <MoreHorizontal className="h-4 w-4" />;
    }
  };

  const getTagColor = (tag: string) => {
    switch(tag) {
      case 'family': return 'bg-red-100 text-red-800';
      case 'friend': return 'bg-blue-100 text-blue-800';
      case 'work': return 'bg-gray-100 text-gray-800';
      case 'school': return 'bg-yellow-100 text-yellow-800';
      case 'networking': return 'bg-purple-100 text-purple-800';
      case 'hobby': return 'bg-green-100 text-green-800';
      case 'important': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {contact.firstName} {contact.lastName}
          </h1>
          {contact.jobTitle && contact.company && (
            <p className="text-lg text-muted-foreground mt-1">
              {contact.jobTitle} at {contact.company}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                <span>Add</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DialogTrigger asChild onClick={() => setInteractionDialogOpen(true)}>
                <DropdownMenuItem>
                  <Phone className="mr-2 h-4 w-4" />
                  <span>Record Interaction</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogTrigger asChild onClick={() => setReminderDialogOpen(true)}>
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Add Reminder</span>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" asChild>
            <Link to={`/contacts/${contact.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="relative h-32 w-32 rounded-full bg-muted flex items-center justify-center text-muted-foreground overflow-hidden">
                  {contact.image ? (
                    <img 
                      src={contact.image} 
                      alt={`${contact.firstName} ${contact.lastName}`} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16" />
                  )}
                </div>
              </div>
              
              {contact.email && (
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  </div>
                </div>
              )}
              
              {contact.phone && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  </div>
                </div>
              )}
              
              {contact.company && (
                <div className="flex items-start">
                  <Briefcase className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Company</p>
                    <p className="text-sm text-muted-foreground">{contact.company}</p>
                    {contact.jobTitle && (
                      <p className="text-sm text-muted-foreground">{contact.jobTitle}</p>
                    )}
                  </div>
                </div>
              )}
              
              {contact.address && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{contact.address}</p>
                  </div>
                </div>
              )}
              
              {contact.birthday && (
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Birthday</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(contact.birthday), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
              )}
              
              {contact.lastContacted && (
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Last Contact</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(contact.lastContacted), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
              )}
              
              {contact.tags.length > 0 && (
                <div className="flex items-start">
                  <TagIcon className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {contact.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className={`${getTagColor(tag)} border-none`}
                        >
                          <span className="capitalize">{tag}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {contact.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line">{contact.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="interactions">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="interactions">Interactions</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="interactions" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Recent Interactions</h3>
                <Dialog open={interactionDialogOpen} onOpenChange={setInteractionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Record Interaction
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Record an Interaction</DialogTitle>
                      <DialogDescription>
                        Record a new interaction with {contact.firstName}. This helps you track your communication history.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Interaction Type</label>
                        <Select 
                          value={interactionType} 
                          onValueChange={(value) => setInteractionType(value as InteractionType)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select interaction type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="call">Call</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="message">Message</SelectItem>
                            <SelectItem value="social">Social Media</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !interactionDate && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {interactionDate ? (
                                format(interactionDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={interactionDate}
                              onSelect={(date) => date && setInteractionDate(date)}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Notes</label>
                        <Textarea
                          placeholder="What did you discuss?"
                          value={interactionNotes}
                          onChange={(e) => setInteractionNotes(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setInteractionDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddInteraction}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {contact.interactions.length > 0 ? (
                <div className="space-y-4">
                  {contact.interactions
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(interaction => (
                      <Card key={interaction.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <div className="p-2 rounded-full bg-muted mr-3">
                                {getInteractionIcon(interaction.type)}
                              </div>
                              <div>
                                <p className="font-medium capitalize">{interaction.type}</p>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(interaction.date), 'MMMM d, yyyy')}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(interaction.createdAt), 'h:mm a')}
                            </div>
                          </div>
                          {interaction.notes && (
                            <div className="mt-3 text-sm ml-12">
                              {interaction.notes}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-10 border rounded-lg">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Phone className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No interactions yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Record your first interaction with {contact.firstName}
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setInteractionDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Record Interaction
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reminders" className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Scheduled Reminders</h3>
                <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Reminder
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule a Reminder</DialogTitle>
                      <DialogDescription>
                        Set a reminder to follow up with {contact.firstName}.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          placeholder="e.g., Follow up about project"
                          value={reminderTitle}
                          onChange={(e) => setReminderTitle(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !reminderDate && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {reminderDate ? (
                                format(reminderDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={reminderDate}
                              onSelect={(date) => date && setReminderDate(date)}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description (Optional)</label>
                        <Textarea
                          placeholder="Add more details about this reminder"
                          value={reminderDescription}
                          onChange={(e) => setReminderDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setReminderDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddReminder}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="text-center py-10 border rounded-lg">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Manage reminders</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  View and manage all your reminders in the Reminders section
                </p>
                <div className="mt-6">
                  <Button asChild>
                    <Link to="/reminders">
                      <Calendar className="mr-2 h-4 w-4" />
                      Go to Reminders
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
