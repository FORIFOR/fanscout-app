export interface Team {
  id: number;
  name: string;
  logo: string;
  league: string;
  description?: string;
  createdAt: Date;
}

export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeTeam?: Team;
  awayTeam?: Team;
  date: Date;
  venue: string;
  league: string;
  scoutingClubs: number[] | Team[];
  createdAt: Date;
}

export interface ScoutingReport {
  id: number;
  userId: number;
  matchId: number;
  clubId: number;
  playerName: string;
  playerAge: number;
  playerPosition: string;
  overallRating: number;
  technicalAbility: number;
  physicalAttributes: number;
  tacticalUnderstanding: number;
  mentalAttributes: number;
  potential: number;
  observations: string;
  recommendation: string;
  liked: boolean;
  createdAt: Date;
}

export interface Club {
  id: number;
  name: string;
  logo: string;
  league: string;
  description?: string;
  createdAt: Date;
}

export type ScoutingRating = 1 | 2 | 3 | 4 | 5;

export type PositionType = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Striker';

export type RecommendationType = 'Highly Recommend' | 'Recommend' | 'Consider' | 'Not Recommended';

export interface ScoutingFormData {
  clubId: number;
  playerName: string;
  playerAge: number;
  playerPosition: string | PositionType;
  overallRating: ScoutingRating;
  technicalAbility: ScoutingRating;
  physicalAttributes: ScoutingRating;
  tacticalUnderstanding: ScoutingRating;
  mentalAttributes: ScoutingRating;
  potential: ScoutingRating;
  observations: string;
  recommendation: string | RecommendationType;
}
