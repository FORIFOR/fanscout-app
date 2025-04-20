import React from 'react';
import { useClubs } from '@/hooks/useClubs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function Clubs() {
  const { clubs, isLoading } = useClubs();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-dark">Participating Clubs</h2>
        <p className="text-gray-500 mt-1">
          These clubs are actively seeking scouting reports from fans
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="ml-4">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full rounded" />
                <div className="mt-4">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <Card key={club.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <Badge variant="outline" className="text-sm font-medium px-2 py-1 bg-primary-light/10 text-primary-dark rounded">
                  {club.league}
                </Badge>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {club.logo ? (
                      <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-500 font-medium text-xl">{club.name.substring(0, 2)}</span>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{club.name}</h3>
                    <p className="text-sm text-gray-500">{club.league}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {club.description || `${club.name} is a professional football club participating in the scouting program. Submit reports to help them discover talent.`}
                  </p>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Looking for positions:</p>
                  <div className="flex flex-wrap gap-2">
                    {getRandomPositions(club.id).map((position, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRandomBadgeColor()}`}
                      >
                        {position}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to get random positions for display purposes
function getRandomPositions(clubId: number) {
  const allPositions = [
    'Goalkeeper', 'Defender', 'Left Back', 'Right Back', 
    'Center Back', 'Midfielder', 'Defensive Midfielder',
    'Attacking Midfielder', 'Winger', 'Striker', 'Forward',
    'Young Talents'
  ];
  
  // Use club ID as seed to always return the same positions for the same club
  const seed = clubId % allPositions.length;
  const count = 2 + (clubId % 2); // Either 2 or 3 positions
  
  const positions = [];
  for (let i = 0; i < count; i++) {
    const index = (seed + i) % allPositions.length;
    positions.push(allPositions[index]);
  }
  
  return positions;
}

// Helper function to get random badge colors
function getRandomBadgeColor() {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
    'bg-purple-100 text-purple-800',
    'bg-indigo-100 text-indigo-800',
    'bg-pink-100 text-pink-800'
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}
