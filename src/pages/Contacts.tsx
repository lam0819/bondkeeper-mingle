
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, MoreHorizontal, Phone, Mail, Calendar, Tag, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCrm } from '@/context/CrmContext';
import { Contact, ContactTag } from '@/types/models';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Contacts = () => {
  const { contacts, deleteContact } = useCrm();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<ContactTag | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTagFilter = (tag: ContactTag | null) => {
    setSelectedTag(tag);
  };

  const handleDelete = (contact: Contact) => {
    deleteContact(contact.id);
    toast({
      title: 'Contact deleted',
      description: `${contact.firstName} ${contact.lastName} has been removed.`,
    });
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchTerm === '' || 
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = selectedTag === null || contact.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  // Get all unique tags across all contacts
  const uniqueTags = Array.from(
    new Set(contacts.flatMap(contact => contact.tags))
  ) as ContactTag[];

  // Get tag color based on tag name
  const getTagColor = (tag: ContactTag) => {
    switch(tag) {
      case 'family': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'friend': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'work': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'school': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'networking': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'hobby': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'important': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <Link to="/contacts/new">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contacts..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => handleTagFilter(null)}
          >
            All
          </Button>
          {uniqueTags.map(tag => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => handleTagFilter(tag)}
              className={selectedTag === tag ? '' : 'border-gray-200'}
            >
              <span className="capitalize">{tag}</span>
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2 ml-auto">
          <Button
            variant={viewMode === 'grid' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'table' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table
          </Button>
        </div>
      </div>

      {filteredContacts.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {filteredContacts.map(contact => (
              <Card key={contact.id} className="overflow-hidden border border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground overflow-hidden">
                          {contact.image ? (
                            <img 
                              src={contact.image} 
                              alt={`${contact.firstName} ${contact.lastName}`} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserIcon className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <Link to={`/contacts/${contact.id}`} className="font-medium hover:underline text-lg">
                            {contact.firstName} {contact.lastName}
                          </Link>
                          {contact.jobTitle && contact.company && (
                            <p className="text-sm text-muted-foreground">
                              {contact.jobTitle} at {contact.company}
                            </p>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/contacts/${contact.id}`}>View Profile</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/contacts/${contact.id}/edit`}>Edit Contact</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(contact)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      {contact.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{contact.email}</span>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      {contact.lastContacted && (
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Last contact: {formatDistanceToNow(contact.lastContacted, { addSuffix: true })}</span>
                        </div>
                      )}
                    </div>
                    
                    {contact.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {contact.tags.map(tag => (
                          <Badge key={tag} variant="outline" className={`${getTagColor(tag)} border-none`}>
                            <Tag className="h-3 w-3 mr-1" />
                            <span className="capitalize">{tag}</span>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex border-t border-border">
                    <Link to={`/contacts/${contact.id}`} className="flex-1 py-3 text-center hover:bg-muted transition-colors text-sm font-medium">
                      View Profile
                    </Link>
                    <div className="w-px bg-border" />
                    <Button variant="ghost" size="sm" className="flex-1 py-3 h-auto rounded-none text-sm font-medium">
                      <Link to={`/contacts/${contact.id}/edit`} className="flex-1">
                        Edit
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map(contact => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      <Link to={`/contacts/${contact.id}`} className="hover:underline">
                        {contact.firstName} {contact.lastName}
                      </Link>
                    </TableCell>
                    <TableCell>{contact.email || "-"}</TableCell>
                    <TableCell>{contact.phone || "-"}</TableCell>
                    <TableCell>{contact.company || "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className={`${getTagColor(tag)} border-none text-xs`}
                          >
                            <span className="capitalize">{tag}</span>
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/contacts/${contact.id}`}>
                            <UserIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/contacts/${contact.id}/edit`}>
                            <Mail className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/contacts/${contact.id}/edit`}>Edit Contact</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(contact)}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      ) : (
        <div className="text-center py-10 border rounded-lg">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <UserIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No contacts found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm || selectedTag 
              ? "Try adjusting your search or filter" 
              : "Get started by adding your first contact"}
          </p>
          <div className="mt-6">
            <Link to="/contacts/new">
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
