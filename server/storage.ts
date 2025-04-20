import { 
  users, type User, type InsertUser,
  clubs, type Club, type InsertClub,
  matches, type Match, type InsertMatch,
  scoutingReports, type ScoutingReport, type InsertScoutingReport
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Club operations
  getClub(id: number): Promise<Club | undefined>;
  getAllClubs(): Promise<Club[]>;
  createClub(club: InsertClub): Promise<Club>;
  
  // Match operations
  getMatch(id: number): Promise<Match | undefined>;
  getAllMatches(): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  
  // Scouting Report operations
  getScoutingReport(id: number): Promise<ScoutingReport | undefined>;
  getScoutingReportsByUserId(userId: number): Promise<ScoutingReport[]>;
  getScoutingReportsByMatchId(matchId: number): Promise<ScoutingReport[]>;
  getScoutingReportsByClubId(clubId: number): Promise<ScoutingReport[]>;
  createScoutingReport(report: InsertScoutingReport): Promise<ScoutingReport>;
  likeScoutingReport(id: number): Promise<ScoutingReport | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clubs: Map<number, Club>;
  private matches: Map<number, Match>;
  private scoutingReports: Map<number, ScoutingReport>;
  
  private userIdCounter: number;
  private clubIdCounter: number;
  private matchIdCounter: number;
  private reportIdCounter: number;

  constructor() {
    this.users = new Map();
    this.clubs = new Map();
    this.matches = new Map();
    this.scoutingReports = new Map();
    
    this.userIdCounter = 1;
    this.clubIdCounter = 1;
    this.matchIdCounter = 1;
    this.reportIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Sample clubs
    const clubs: InsertClub[] = [
      { name: "FC Tokyo", logo: "", league: "J1 League", description: "Top-tier professional club based in Tokyo" },
      { name: "Cerezo Osaka", logo: "", league: "J1 League", description: "Professional club based in Osaka" },
      { name: "Vissel Kobe", logo: "", league: "J1 League", description: "Professional club based in Kobe" },
      { name: "Yokohama F. Marinos", logo: "", league: "J1 League", description: "Professional club based in Yokohama" }
    ];
    
    clubs.forEach(club => this.createClub(club));
    
    // Sample matches
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfter = new Date(now);
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    const matches: InsertMatch[] = [
      { 
        homeTeamId: 2, 
        awayTeamId: 3, 
        date: tomorrow, 
        venue: "Yanmar Stadium Nagai, Osaka", 
        league: "J1 League",
        scoutingClubs: [1, 4]
      },
      { 
        homeTeamId: 1, 
        awayTeamId: 4, 
        date: dayAfter, 
        venue: "Ajinomoto Stadium, Tokyo", 
        league: "J1 League",
        scoutingClubs: [2, 3]
      }
    ];
    
    matches.forEach(match => this.createMatch(match));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  // Club operations
  async getClub(id: number): Promise<Club | undefined> {
    return this.clubs.get(id);
  }
  
  async getAllClubs(): Promise<Club[]> {
    return Array.from(this.clubs.values());
  }
  
  async createClub(insertClub: InsertClub): Promise<Club> {
    const id = this.clubIdCounter++;
    const now = new Date();
    const club: Club = { ...insertClub, id, createdAt: now };
    this.clubs.set(id, club);
    return club;
  }
  
  // Match operations
  async getMatch(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }
  
  async getAllMatches(): Promise<Match[]> {
    return Array.from(this.matches.values());
  }
  
  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = this.matchIdCounter++;
    const now = new Date();
    const match: Match = { ...insertMatch, id, createdAt: now };
    this.matches.set(id, match);
    return match;
  }
  
  // Scouting Report operations
  async getScoutingReport(id: number): Promise<ScoutingReport | undefined> {
    return this.scoutingReports.get(id);
  }
  
  async getScoutingReportsByUserId(userId: number): Promise<ScoutingReport[]> {
    return Array.from(this.scoutingReports.values())
      .filter(report => report.userId === userId);
  }
  
  async getScoutingReportsByMatchId(matchId: number): Promise<ScoutingReport[]> {
    return Array.from(this.scoutingReports.values())
      .filter(report => report.matchId === matchId);
  }
  
  async getScoutingReportsByClubId(clubId: number): Promise<ScoutingReport[]> {
    return Array.from(this.scoutingReports.values())
      .filter(report => report.clubId === clubId);
  }
  
  async createScoutingReport(insertReport: InsertScoutingReport): Promise<ScoutingReport> {
    const id = this.reportIdCounter++;
    const now = new Date();
    const report: ScoutingReport = { 
      ...insertReport, 
      id, 
      liked: false,
      createdAt: now 
    };
    this.scoutingReports.set(id, report);
    return report;
  }
  
  async likeScoutingReport(id: number): Promise<ScoutingReport | undefined> {
    const report = this.scoutingReports.get(id);
    if (report) {
      const updatedReport = { ...report, liked: true };
      this.scoutingReports.set(id, updatedReport);
      return updatedReport;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
