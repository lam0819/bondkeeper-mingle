
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Bell, Phone, CalendarCheck, Calendar, Plus, User, UserPlus, Mail } from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { contacts, reminders, getDashboardStats } = useCrm();
  const stats = getDashboardStats();

  // Get contacts with upcoming birthdays (next 30 days)
  const getUpcomingBirthdays = () => {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    return contacts
      .filter(contact => contact.birthday)
      .filter(contact => {
        if (!contact.birthday) return false;
        
        const birthday = new Date(contact.birthday);
        const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
        
        if (thisYearBirthday < today) {
          // Birthday has passed this year, check for next year
          const nextYearBirthday = new Date(today.getFullYear() + 1, birthday.getMonth(), birthday.getDate());
          return nextYearBirthday <= thirtyDaysLater;
        }
        
        return thisYearBirthday <= thirtyDaysLater;
      })
      .sort((a, b) => {
        if (!a.birthday || !b.birthday) return 0;
        
        const dateA = new Date(a.birthday);
        const dateB = new Date(b.birthday);
        
        const thisYearA = new Date(today.getFullYear(), dateA.getMonth(), dateA.getDate());
        const thisYearB = new Date(today.getFullYear(), dateB.getMonth(), dateB.getDate());
        
        if (thisYearA < today) thisYearA.setFullYear(today.getFullYear() + 1);
        if (thisYearB < today) thisYearB.setFullYear(today.getFullYear() + 1);
        
        return thisYearA.getTime() - thisYearB.getTime();
      })
      .slice(0, 3);
  };

  // Contacts that haven't been contacted in a while (over 30 days)
  const getContactsToReconnect = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return contacts
      .filter(contact => !contact.lastContacted || contact.lastContacted < thirtyDaysAgo)
      .sort((a, b) => {
        const dateA = a.lastContacted || new Date(0);
        const dateB = b.lastContacted || new Date(0);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 3);
  };

  // Upcoming reminders
  const getUpcomingReminders = () => {
    const now = new Date();
    
    return reminders
      .filter(reminder => !reminder.completed && reminder.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link to="/contacts/new">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-crm-blue" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Contacts</p>
              <h3 className="text-2xl font-bold">{stats.totalContacts}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-crm-green" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">New This Month</p>
              <h3 className="text-2xl font-bold">{stats.newContactsThisMonth}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Bell className="h-6 w-6 text-crm-purple" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upcoming Reminders</p>
              <h3 className="text-2xl font-bold">{stats.upcomingReminders}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <Phone className="h-6 w-6 text-crm-teal" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recent Interactions</p>
              <h3 className="text-2xl font-bold">{stats.recentInteractions}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Birthdays */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-crm-purple" />
              Upcoming Birthdays
            </CardTitle>
            <CardDescription>Don't forget to wish them!</CardDescription>
          </CardHeader>
          <CardContent>
            {getUpcomingBirthdays().length > 0 ? (
              <ul className="space-y-3">
                {getUpcomingBirthdays().map(contact => (
                  <li key={contact.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground overflow-hidden">
                        {contact.image ? (
                          <img 
                            src={contact.image} 
                            alt={`${contact.firstName} ${contact.lastName}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      <div className="ml-3">
                        <Link to={`/contacts/${contact.id}`} className="font-medium hover:underline">
                          {contact.firstName} {contact.lastName}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {contact.birthday && new Date(contact.birthday).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/contacts/${contact.id}`}>
                          <Mail className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No upcoming birthdays</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reconnect Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-crm-blue" />
              Reconnect Suggestions
            </CardTitle>
            <CardDescription>It's been a while since you connected</CardDescription>
          </CardHeader>
          <CardContent>
            {getContactsToReconnect().length > 0 ? (
              <ul className="space-y-3">
                {getContactsToReconnect().map(contact => (
                  <li key={contact.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground overflow-hidden">
                        {contact.image ? (
                          <img 
                            src={contact.image} 
                            alt={`${contact.firstName} ${contact.lastName}`} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      <div className="ml-3">
                        <Link to={`/contacts/${contact.id}`} className="font-medium hover:underline">
                          {contact.firstName} {contact.lastName}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {contact.lastContacted 
                            ? `Last contact: ${formatDistanceToNow(contact.lastContacted, { addSuffix: true })}` 
                            : 'No previous contact'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/contacts/${contact.id}`}>
                          <Phone className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>You're all caught up!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-crm-green" />
            Upcoming Reminders
          </CardTitle>
          <CardDescription>Don't forget these important dates</CardDescription>
        </CardHeader>
        <CardContent>
          {getUpcomingReminders().length > 0 ? (
            <ul className="space-y-3">
              {getUpcomingReminders().map(reminder => (
                <li key={reminder.id} className="border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CalendarCheck className="h-5 w-5 text-crm-green mr-3" />
                      <div>
                        <h4 className="font-medium">{reminder.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {reminder.contact.firstName} {reminder.contact.lastName} - 
                          {reminder.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                        {reminder.description && (
                          <p className="text-sm mt-1">{reminder.description}</p>
                        )}
                      </div>
                    </div>
                    <Link to="/reminders">
                      <Button size="sm" variant="ghost">View</Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No upcoming reminders</p>
              <Link to="/reminders">
                <Button variant="outline" className="mt-3">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
