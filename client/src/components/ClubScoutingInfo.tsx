import React from 'react';
import { Club } from '@/types';
import { Badge } from '@/components/ui/badge';

interface ClubScoutingInfoProps {
  clubs: Club[];
}

interface PositionOfInterest {
  id: number;
  clubId: number;
  name: string;
  color: string;
}

// Mock positions of interest for each club
const positionsOfInterest: PositionOfInterest[] = [
  { id: 1, clubId: 1, name: 'Midfielders', color: 'blue' },
  { id: 2, clubId: 1, name: 'Defenders', color: 'purple' },
  { id: 3, clubId: 2, name: 'Goalkeepers', color: 'green' },
  { id: 4, clubId: 2, name: 'Strikers', color: 'red' },
  { id: 5, clubId: 3, name: 'Young Talents', color: 'yellow' },
  { id: 6, clubId: 4, name: 'Defenders', color: 'indigo' },
  { id: 7, clubId: 4, name: 'Strikers', color: 'pink' },
];

export default function ClubScoutingInfo({ clubs }: ClubScoutingInfoProps) {
  const getClubPositions = (clubId: number) => {
    return positionsOfInterest.filter(position => position.clubId === clubId);
  };
  
  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'purple':
        return 'bg-purple-100 text-purple-800';
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'red':
        return 'bg-red-100 text-red-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-800';
      case 'pink':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <>
      <h4 className="font-medium text-lg mb-3">Clubs Scouting This Match</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {clubs.map(club => (
          <div key={club.id} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mb-2">
              {club.logo ? (
                <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500 font-medium">{club.name.substring(0, 2)}</span>
              )}
            </div>
            <h5 className="font-medium">{club.name}</h5>
            <p className="text-xs text-gray-500 mb-2">{club.league}</p>
            <div className="text-sm text-center">
              <p className="font-medium mb-1">Looking for:</p>
              {getClubPositions(club.id).map(position => (
                <Badge 
                  key={position.id}
                  variant="outline"
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeColor(position.color)} mr-1 mb-1`}
                >
                  {position.name}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
