import React from 'react';
import { Link } from 'wouter';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <i className="fas fa-futbol text-white text-lg"></i>
              </div>
            </div>
            <h1 className="ml-3 text-xl font-semibold text-neutral-dark">Fan Scout</h1>
          </div>
        </Link>
        <nav>
          <button className="p-2 rounded-full hover:bg-gray-100" title="Profile">
            <span className="h-8 w-8 bg-primary-light text-white rounded-full flex items-center justify-center">
              <i className="fas fa-user"></i>
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
