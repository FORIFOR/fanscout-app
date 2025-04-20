import React from 'react';
import { format } from 'date-fns';
import { ScoutingReport } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMatch } from '@/hooks/useMatches';
import { useClub } from '@/hooks/useClubs';

interface ReportCardProps {
  report: ScoutingReport;
}

export default function ReportCard({ report }: ReportCardProps) {
  const { match } = useMatch(report.matchId);
  const { club } = useClub(report.clubId);
  
  if (!match || !club) {
    return null;
  }
  
  const formattedDate = format(new Date(report.createdAt), 'MMM dd, yyyy');
  const matchDate = match ? format(new Date(match.date), 'MMM dd, yyyy') : '';
  
  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
      <CardHeader className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
            <i className="fas fa-clipboard-check"></i>
          </div>
          <span className="ml-2 font-medium">Report #{report.id}</span>
        </div>
        <div className="flex items-center">
          {report.liked ? (
            <Badge variant="outline" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
              <i className="fas fa-thumbs-up mr-1"></i> Liked
            </Badge>
          ) : (
            <Badge variant="outline" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
              <i className="fas fa-clock mr-1"></i> Pending
            </Badge>
          )}
          <span className="text-sm text-gray-500">Submitted: {formattedDate}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-4">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-2">
              {match.homeTeam?.logo ? (
                <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-xs">{match.homeTeam?.name?.substring(0, 2) || ''}</span>
              )}
            </div>
            <span className="text-sm font-medium">
              {match.homeTeam?.name || ''} vs {match.awayTeam?.name || ''}
            </span>
          </div>
          <span className="text-sm text-gray-500">{match.league} • {matchDate}</span>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <div>
            <div className="text-sm font-medium mb-1">Player Scouted: <span className="text-primary">{report.playerName}</span></div>
            <div className="text-sm text-gray-600">Position: {report.playerPosition}, Age: {report.playerAge}</div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <i className="fas fa-star text-amber-500 mr-1"></i>
              <span className="font-medium">{report.overallRating}</span><span className="text-gray-500">/5</span>
            </div>
            <Button variant="outline" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
              View Details
            </Button>
          </div>
        </div>
        <div className="mt-4 text-sm bg-gray-50 p-3 rounded-md">
          <p className="line-clamp-2">{report.observations}</p>
        </div>
        {report.liked && (
          <div className="mt-4 flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-2">
              {club.logo ? (
                <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-xs">{club.name.substring(0, 2)}</span>
              )}
            </div>
            <span className="text-sm font-medium mr-2">{club.name}</span>
            <div className="text-sm text-green-600">
              <i className="fas fa-thumbs-up mr-1"></i> Club liked your report
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
