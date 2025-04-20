import React, { useState } from 'react';
import { useMatches } from '@/hooks/useMatches';
import MatchCard from '@/components/MatchCard';
import Pagination from '@/components/Pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Matches() {
  const { matches, isLoading } = useMatches();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Filter matches based on search term
  const filteredMatches = matches.filter(match => {
    const homeTeamName = match.homeTeam?.name || '';
    const awayTeamName = match.awayTeam?.name || '';
    const venue = match.venue || '';
    const league = match.league || '';
    
    const searchTermLower = searchTerm.toLowerCase();
    
    return homeTeamName.toLowerCase().includes(searchTermLower) ||
           awayTeamName.toLowerCase().includes(searchTermLower) ||
           venue.toLowerCase().includes(searchTermLower) ||
           league.toLowerCase().includes(searchTermLower);
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMatches = filteredMatches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-dark">Upcoming Matches</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search matches..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>
          <div className="relative">
            <Button
              variant="outline"
              className="px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50"
            >
              <i className="fas fa-filter mr-2 text-gray-500"></i>
              <span>Filter</span>
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <Skeleton className="h-6 w-full" />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-10 w-[120px]" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-10 w-[120px]" />
                </div>
                <Skeleton className="h-5 w-2/3 mt-2" />
                <div className="mt-4 flex justify-between items-center">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-10 w-[120px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {currentMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <i className="fas fa-calendar-times text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No matches found</h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? `No matches found matching "${searchTerm}". Try a different search term.` 
                  : "There are no upcoming matches available right now."}
              </p>
            </div>
          )}
        </>
      )}

      {!isLoading && filteredMatches.length > itemsPerPage && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
