import React from 'react';
import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <i className="fas fa-futbol text-white text-lg"></i>
              </div>
            </div>
            <h2 className="ml-3 text-lg font-semibold text-neutral-dark">Fan Scout</h2>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <Link href="/about">
              <div className="hover:text-primary cursor-pointer">About</div>
            </Link>
            <Link href="/privacy">
              <div className="hover:text-primary cursor-pointer">Privacy Policy</div>
            </Link>
            <Link href="/terms">
              <div className="hover:text-primary cursor-pointer">Terms of Service</div>
            </Link>
            <Link href="/contact">
              <div className="hover:text-primary cursor-pointer">Contact</div>
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center md:text-left text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Fan Scout. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
