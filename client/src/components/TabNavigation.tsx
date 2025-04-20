import React from 'react';
import { Link, useLocation } from 'wouter';

export default function TabNavigation() {
  const [location] = useLocation();

  const tabs = [
    { name: 'Matches', path: '/', icon: 'fas fa-calendar-alt' },
    { name: 'My Reports', path: '/reports', icon: 'fas fa-clipboard-list' },
    { name: 'Clubs', path: '/clubs', icon: 'fas fa-shield-alt' },
    { name: 'Rewards', path: '/rewards', icon: 'fas fa-trophy' }
  ];

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = location === tab.path;
            
            return (
              <Link key={tab.path} href={tab.path}>
                <div className={`px-1 py-4 text-sm font-medium border-b-2 cursor-pointer ${
                  isActive 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}>
                  <i className={`${tab.icon} mr-2`}></i>{tab.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
