import React from 'react';
import { format } from 'date-fns';
import { useModal } from '@/context/ModalContext';
import { Match } from '@/types';
import { 
  Card,
  CardContent,
  CardHeader,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const { openMatchDetail } = useModal();
  
  if (!match.homeTeam || !match.awayTeam) {
    return null;
  }
  
  const formattedDate = format(new Date(match.date), 'MMM dd, yyyy • HH:mm');
  
  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-200">
      <CardHeader className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="text-sm font-medium text-gray-500">
          <i className="fas fa-calendar mr-2"></i>{formattedDate}
        </div>
        <Badge variant="outline" className="text-xs font-medium px-2 py-1 bg-primary-light/10 text-primary-dark rounded">
          {match.league}
        </Badge>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {match.homeTeam.logo ? (
                <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-xs">{match.homeTeam.name.substring(0, 2)}</span>
              )}
            </div>
            <span className="ml-2 font-medium">{match.homeTeam.name}</span>
          </div>
          <span className="text-lg font-bold">vs</span>
          <div className="flex items-center">
            <span className="mr-2 font-medium">{match.awayTeam.name}</span>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {match.awayTeam.logo ? (
                <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-xs">{match.awayTeam.name.substring(0, 2)}</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <i className="fas fa-map-marker-alt mr-2"></i>
          <span>{match.venue}</span>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-600">
            <i className="fas fa-user-check mr-2"></i>
            <span>{typeof match.scoutingClubs === 'object' ? match.scoutingClubs.length : 0} clubs scouting</span>
          </div>
          <Button 
            onClick={() => openMatchDetail(match.id)} 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            Scout Match
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
