import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useReports } from '@/hooks/useReports';

export default function Rewards() {
  // Using a hardcoded user ID for now
  const userId = 1;
  const { reports, isLoading } = useReports(userId);
  
  // Calculate statistics
  const totalReports = reports.length;
  const likedReports = reports.filter(report => report.liked).length;
  const likePercentage = totalReports > 0 ? Math.round((likedReports / totalReports) * 100) : 0;
  
  // Define reward tiers
  const rewardTiers = [
    { name: 'Bronze Scout', requirement: 5, icon: 'fas fa-medal text-amber-600' },
    { name: 'Silver Scout', requirement: 10, icon: 'fas fa-medal text-gray-400' },
    { name: 'Gold Scout', requirement: 25, icon: 'fas fa-medal text-yellow-400' },
    { name: 'Platinum Scout', requirement: 50, icon: 'fas fa-trophy text-blue-500' },
    { name: 'Diamond Scout', requirement: 100, icon: 'fas fa-gem text-purple-500' }
  ];
  
  // Find current tier
  const currentTier = rewardTiers.filter(tier => totalReports >= tier.requirement).pop() || { name: 'Beginner', requirement: 0, icon: 'fas fa-user text-gray-500' };
  const nextTier = rewardTiers.find(tier => totalReports < tier.requirement);
  
  // Calculate progress to next tier
  const progressToNextTier = nextTier 
    ? Math.round((totalReports / nextTier.requirement) * 100)
    : 100;
  
  // Define possible rewards
  const possibleRewards = [
    { name: 'Match Tickets', description: 'Free tickets to select home matches', tier: 'Bronze Scout', icon: 'fas fa-ticket-alt text-green-500' },
    { name: 'Club Store Discount', description: '10% off merchandise at the club store', tier: 'Bronze Scout', icon: 'fas fa-tags text-blue-500' },
    { name: 'Training Session Visit', description: 'Attend a team training session', tier: 'Silver Scout', icon: 'fas fa-running text-amber-500' },
    { name: 'Stadium Tour', description: 'Exclusive behind-the-scenes tour', tier: 'Silver Scout', icon: 'fas fa-building text-purple-500' },
    { name: 'Meet the Players', description: 'Meet and greet with club players', tier: 'Gold Scout', icon: 'fas fa-users text-indigo-500' },
    { name: 'VIP Match Experience', description: 'Watch a match from the VIP box', tier: 'Platinum Scout', icon: 'fas fa-crown text-yellow-500' },
    { name: 'Scout Recognition Award', description: 'Official recognition of your scouting contributions', tier: 'Diamond Scout', icon: 'fas fa-award text-red-500' }
  ];
  
  // Filter rewards based on current tier
  const availableRewards = possibleRewards.filter(reward => {
    const rewardTierIndex = rewardTiers.findIndex(tier => tier.name === reward.tier);
    const currentTierIndex = rewardTiers.findIndex(tier => tier.name === currentTier.name);
    return rewardTierIndex <= currentTierIndex;
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-dark">Rewards & Recognition</h2>
        <p className="text-gray-500 mt-1">
          Earn rewards and recognition for your valuable scouting contributions
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Scout Status Card */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Scout Status</CardTitle>
            <CardDescription>
              Based on your scouting reports and club feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <i className={currentTier.icon}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{currentTier.name}</h3>
                  <p className="text-sm text-gray-500">
                    {totalReports} {totalReports === 1 ? 'report' : 'reports'} submitted
                  </p>
                </div>
              </div>
              
              {nextTier && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Next tier</p>
                  <p className="font-medium">{nextTier.name}</p>
                </div>
              )}
            </div>
            
            {nextTier && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>{totalReports} / {nextTier.requirement} reports</span>
                  <span>{progressToNextTier}%</span>
                </div>
                <Progress value={progressToNextTier} className="h-2" />
                <p className="text-xs text-gray-500 mt-2">
                  Submit {nextTier.requirement - totalReports} more {(nextTier.requirement - totalReports) === 1 ? 'report' : 'reports'} to reach {nextTier.name}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-semibold text-primary mb-1">{totalReports}</div>
                <p className="text-sm text-gray-500">Total Reports</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-semibold text-green-500 mb-1">{likedReports}</div>
                <p className="text-sm text-gray-500">Liked by Clubs</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-semibold text-amber-500 mb-1">{likePercentage}%</div>
                <p className="text-sm text-gray-500">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Achievements Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Achievements</CardTitle>
            <CardDescription>
              Milestones reached in your scouting journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rewardTiers.map((tier) => {
                const isUnlocked = totalReports >= tier.requirement;
                return (
                  <div 
                    key={tier.name}
                    className={`flex items-center p-3 rounded-lg ${
                      isUnlocked ? 'bg-primary/10' : 'bg-gray-100'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      isUnlocked ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <i className={tier.icon}></i>
                    </div>
                    <div>
                      <h4 className={`font-medium ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                        {tier.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {isUnlocked 
                          ? 'Achieved' 
                          : `Submit ${tier.requirement - totalReports} more reports`}
                      </p>
                    </div>
                    {isUnlocked && (
                      <Badge variant="outline" className="ml-auto bg-green-100 text-green-800 border-green-200">
                        <i className="fas fa-check mr-1"></i> Unlocked
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Available Rewards */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold">Available Rewards</h3>
        <p className="text-sm text-gray-500">
          Rewards you've unlocked based on your current tier
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {availableRewards.map((reward) => (
          <Card key={reward.name} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-1.5 bg-primary w-full"></div>
            <CardContent className="pt-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <i className={reward.icon}></i>
                </div>
                <div>
                  <h4 className="font-medium">{reward.name}</h4>
                  <p className="text-xs text-gray-500">{reward.tier}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{reward.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  <i className="fas fa-unlock mr-1"></i> Available
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 cursor-pointer">
                  <i className="fas fa-info-circle mr-1"></i> Details
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {possibleRewards.length > availableRewards.length && (
        <>
          <div className="mb-2">
            <h3 className="text-lg font-semibold">Future Rewards</h3>
            <p className="text-sm text-gray-500">
              Keep submitting quality reports to unlock these rewards
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {possibleRewards
              .filter(reward => !availableRewards.includes(reward))
              .map((reward) => (
                <Card key={reward.name} className="overflow-hidden bg-gray-50 opacity-75">
                  <div className="h-1.5 bg-gray-300 w-full"></div>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <i className={reward.icon}></i>
                      </div>
                      <div>
                        <h4 className="font-medium">{reward.name}</h4>
                        <p className="text-xs text-gray-500">{reward.tier}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                    <div className="mt-4">
                      <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                        <i className="fas fa-lock mr-1"></i> Locked
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
