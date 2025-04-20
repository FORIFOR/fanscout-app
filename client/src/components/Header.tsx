import React from 'react';
import { Link, useLocation } from 'wouter';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import NotificationCenter from './NotificationCenter';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const [_, setLocation] = useLocation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation('/auth');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-lg">⚽</span>
              </div>
            </div>
            <h1 className="ml-3 text-xl font-semibold text-neutral-dark">Fan Scout</h1>
          </div>
        </Link>
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <NotificationCenter />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative p-1 rounded-full hover:bg-gray-100" title="Profile">
                    <span className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => setLocation('/auth')}>
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
