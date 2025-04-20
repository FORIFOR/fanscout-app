import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { useModal } from '@/context/ModalContext';
import { useMatch } from '@/hooks/useMatches';
import ClubScoutingInfo from './ClubScoutingInfo';
import ScoutingForm from './ScoutingForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MatchDetailModal() {
  const { isMatchDetailOpen, selectedMatchId, closeMatchDetail } = useModal();
  const { match, isLoading } = useMatch(selectedMatchId);
  
  useEffect(() => {
    // Cleanup function
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  if (!match && !isLoading) {
    return null;
  }
  
  return (
    <Dialog open={isMatchDetailOpen} onOpenChange={(open) => {
      if (!open) closeMatchDetail();
    }}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-semibold text-neutral-dark">
              Match Details & Scouting
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="p-6">
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gray-500">Loading match details...</p>
            </div>
          ) : match ? (
            <>
              {/* Match Header */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {match.homeTeam?.logo ? (
                        <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-500 font-medium">{match.homeTeam?.name?.substring(0, 2) || ''}</span>
                      )}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-lg">{match.homeTeam?.name}</h4>
                      <p className="text-sm text-gray-500">Home Team</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-bold mb-1">vs</div>
                    <div className="text-sm text-gray-500">{match.league}</div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="mr-4">
                      <h4 className="font-semibold text-lg">{match.awayTeam?.name}</h4>
                      <p className="text-sm text-gray-500">Away Team</p>
                    </div>
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {match.awayTeam?.logo ? (
                        <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-500 font-medium">{match.awayTeam?.name?.substring(0, 2) || ''}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <i className="fas fa-calendar-alt text-gray-400 mr-2"></i>
                    <span>{format(new Date(match.date), 'MMM dd, yyyy • HH:mm')}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-gray-400 mr-2"></i>
                    <span>{match.venue}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-user-check text-gray-400 mr-2"></i>
                    <span>
                      {typeof match.scoutingClubs === 'object' 
                        ? match.scoutingClubs.length 
                        : 0} clubs scouting this match
                    </span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-ticket-alt text-gray-400 mr-2"></i>
                    <span>Tickets available</span>
                  </div>
                </div>
              </div>
              
              {/* Club Scouting Info */}
              {typeof match.scoutingClubs === 'object' && match.scoutingClubs.length > 0 && (
                <ClubScoutingInfo clubs={match.scoutingClubs as any} />
              )}
              
              {/* Report Form */}
              <ScoutingForm 
                match={match} 
                onSubmitSuccess={closeMatchDetail}
                onCancel={closeMatchDetail}
              />
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">Match not found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
