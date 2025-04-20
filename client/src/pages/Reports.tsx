import React, { useState } from 'react';
import { useReports } from '@/hooks/useReports';
import ReportCard from '@/components/ReportCard';
import Pagination from '@/components/Pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

type ReportFilter = 'all' | 'liked' | 'pending';

export default function Reports() {
  // Using a hardcoded user ID for now
  const userId = 1;
  const { reports, isLoading } = useReports(userId);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<ReportFilter>('all');
  const itemsPerPage = 5;
  
  // Filter reports based on search term and tab
  const filteredReports = reports.filter(report => {
    // First filter by tab
    if (filter === 'liked' && !report.liked) return false;
    if (filter === 'pending' && report.liked) return false;
    
    // Then filter by search term (if any)
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      report.playerName.toLowerCase().includes(searchTermLower) ||
      report.playerPosition.toLowerCase().includes(searchTermLower) ||
      report.observations.toLowerCase().includes(searchTermLower)
    );
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  // Count reports by filter
  const likedCount = reports.filter(report => report.liked).length;
  const pendingCount = reports.filter(report => !report.liked).length;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-dark">My Scouting Reports</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search reports..."
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
              <i className="fas fa-sort mr-2 text-gray-500"></i>
              <span>Sort</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tab switcher for report types */}
      <Tabs defaultValue="all" value={filter} onValueChange={(value) => {
        setFilter(value as ReportFilter);
        setCurrentPage(1);
      }}>
        <div className="border-b border-gray-200 mb-6">
          <TabsList className="bg-transparent -mb-px flex space-x-8 h-auto">
            <TabsTrigger 
              value="all"
              className="border-primary text-primary py-4 px-1 border-b-2 font-medium text-sm data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500"
            >
              All Reports ({reports.length})
            </TabsTrigger>
            <TabsTrigger 
              value="liked"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 border-b-2 font-medium text-sm data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500"
            >
              Liked ({likedCount})
            </TabsTrigger>
            <TabsTrigger 
              value="pending"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 border-b-2 font-medium text-sm data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500"
            >
              Pending ({pendingCount})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          {renderReportsList(isLoading, currentReports, searchTerm, filter)}
        </TabsContent>
        <TabsContent value="liked" className="mt-0">
          {renderReportsList(isLoading, currentReports, searchTerm, filter)}
        </TabsContent>
        <TabsContent value="pending" className="mt-0">
          {renderReportsList(isLoading, currentReports, searchTerm, filter)}
        </TabsContent>
      </Tabs>

      {!isLoading && filteredReports.length > itemsPerPage && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

function renderReportsList(isLoading: boolean, reports: any[], searchTerm: string, filter: string) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="p-4">
              <Skeleton className="h-5 w-2/3 mb-3" />
              <div className="mt-3 flex justify-between items-center">
                <Skeleton className="h-10 w-[200px]" />
                <Skeleton className="h-10 w-[150px]" />
              </div>
              <Skeleton className="h-20 w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (reports.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <i className="fas fa-clipboard-list text-gray-400 text-4xl mb-4"></i>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No reports found</h3>
        <p className="text-gray-500">
          {searchTerm 
            ? `No reports found matching "${searchTerm}". Try a different search term.` 
            : filter === 'liked'
              ? "You don't have any liked reports yet."
              : filter === 'pending'
                ? "You don't have any pending reports."
                : "You haven't submitted any scouting reports yet."}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}
