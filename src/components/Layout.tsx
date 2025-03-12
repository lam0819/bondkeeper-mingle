
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Calendar, Bell, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const showComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "This feature is under development.",
      duration: 3000,
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-xl font-bold text-foreground">ConnectPro</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn("ml-auto", collapsed && "mx-auto")}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>
        <nav className="p-2 flex flex-col flex-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex items-center p-3 rounded-md text-foreground hover:bg-accent group my-1 transition-colors",
                isActive && "bg-accent text-accent-foreground",
                collapsed && "justify-center"
              )
            }
          >
            <Home size={20} className="shrink-0" />
            {!collapsed && <span className="ml-3">Dashboard</span>}
          </NavLink>
          <NavLink
            to="/contacts"
            className={({ isActive }) =>
              cn(
                "flex items-center p-3 rounded-md text-foreground hover:bg-accent group my-1 transition-colors",
                isActive && "bg-accent text-accent-foreground",
                collapsed && "justify-center"
              )
            }
          >
            <Users size={20} className="shrink-0" />
            {!collapsed && <span className="ml-3">Contacts</span>}
          </NavLink>
          <NavLink
            to="/reminders"
            className={({ isActive }) =>
              cn(
                "flex items-center p-3 rounded-md text-foreground hover:bg-accent group my-1 transition-colors",
                isActive && "bg-accent text-accent-foreground",
                collapsed && "justify-center"
              )
            }
          >
            <Bell size={20} className="shrink-0" />
            {!collapsed && <span className="ml-3">Reminders</span>}
          </NavLink>
          <button
            onClick={showComingSoon}
            className={cn(
              "flex items-center p-3 rounded-md text-muted-foreground hover:bg-accent group my-1 transition-colors",
              collapsed && "justify-center"
            )}
          >
            <Calendar size={20} className="shrink-0" />
            {!collapsed && <span className="ml-3">Timeline</span>}
          </button>
        </nav>
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-center text-sm",
              collapsed && "p-2"
            )}
            onClick={showComingSoon}
          >
            {collapsed ? "?" : "Help & Support"}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
