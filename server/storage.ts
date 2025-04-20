import { 
  users, type User, type InsertUser,
  clubs, type Club, type InsertClub,
  matches, type Match, type InsertMatch,
  scoutingReports, type ScoutingReport, type InsertScoutingReport,
  notifications, type Notification, type InsertNotification,
  rewards, type Reward, type InsertReward
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRewardPoints(userId: number, points: number): Promise<User | undefined>;
  
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
  likeScoutingReport(id: number, adminId?: number, feedback?: string): Promise<ScoutingReport | undefined>;
  updateScoutingReportPhoto(id: number, photoUrl: string): Promise<ScoutingReport | undefined>;
  
  // Notification operations
  getNotification(id: number): Promise<Notification | undefined>;
  getNotificationsByUserId(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  
  // Reward operations
  getReward(id: number): Promise<Reward | undefined>;
  getRewardsByUserId(userId: number): Promise<Reward[]>;
  createReward(reward: InsertReward): Promise<Reward>;
  redeemReward(id: number): Promise<Reward | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clubs: Map<number, Club>;
  private matches: Map<number, Match>;
  private scoutingReports: Map<number, ScoutingReport>;
  private notifications: Map<number, Notification>;
  private rewards: Map<number, Reward>;
  
  private userIdCounter: number;
  private clubIdCounter: number;
  private matchIdCounter: number;
  private reportIdCounter: number;
  private notificationIdCounter: number;
  private rewardIdCounter: number;

  constructor() {
    this.users = new Map();
    this.clubs = new Map();
    this.matches = new Map();
    this.scoutingReports = new Map();
    this.notifications = new Map();
    this.rewards = new Map();
    
    this.userIdCounter = 1;
    this.clubIdCounter = 1;
    this.matchIdCounter = 1;
    this.reportIdCounter = 1;
    this.notificationIdCounter = 1;
    this.rewardIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Sample user
    const demoUser: InsertUser = {
      username: "fanscout1",
      password: "password123",
      fullName: "Fan Scout Demo",
      email: "demo@fanscout.com",
      profileImage: null
    };
    
    this.createUser(demoUser);
    
    // Sample clubs
    const clubs: InsertClub[] = [
      { 
        name: "FC Tokyo", 
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9c/FC_Tokyo_logo.svg/450px-FC_Tokyo_logo.svg.png", 
        league: "J1 League", 
        description: "Top-tier professional club based in Tokyo" 
      },
      { 
        name: "Cerezo Osaka", 
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/CerezoOsakaLogo.svg/800px-CerezoOsakaLogo.svg.png", 
        league: "J1 League", 
        description: "Professional club based in Osaka" 
      },
      { 
        name: "Vissel Kobe", 
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Vissel_Kobe_logo.svg/800px-Vissel_Kobe_logo.svg.png", 
        league: "J1 League", 
        description: "Professional club based in Kobe" 
      },
      { 
        name: "Yokohama F. Marinos", 
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/Yokohama_F._Marinos_logo.svg/1200px-Yokohama_F._Marinos_logo.svg.png", 
        league: "J1 League", 
        description: "Professional club based in Yokohama" 
      }
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
    const user: User = { 
      ...insertUser, 
      id, 
      rewardPoints: 0,
      createdAt: now 
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserRewardPoints(userId: number, points: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      const updatedUser = { 
        ...user, 
        rewardPoints: (user.rewardPoints || 0) + points 
      };
      this.users.set(userId, updatedUser);
      return updatedUser;
    }
    return undefined;
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
    const club: Club = { 
      ...insertClub, 
      id, 
      isAdmin: false,
      createdAt: now 
    };
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
    // Ensure scoutingClubs is not undefined
    const scoutingClubs = insertMatch.scoutingClubs || [];
    const match: Match = { 
      ...insertMatch, 
      id, 
      scoutingClubs,
      createdAt: now 
    };
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
      photoUrl: null,
      likedAt: null,
      likedBy: null,
      feedback: null,
      createdAt: now 
    };
    this.scoutingReports.set(id, report);
    return report;
  }
  
  async likeScoutingReport(id: number, adminId?: number, feedback?: string): Promise<ScoutingReport | undefined> {
    const report = this.scoutingReports.get(id);
    if (report) {
      const now = new Date();
      const updatedReport = { 
        ...report, 
        liked: true,
        likedAt: now,
        likedBy: adminId || null,
        feedback: feedback || null
      };
      this.scoutingReports.set(id, updatedReport);
      
      // If we have a valid user ID, award points to the user
      if (report.userId) {
        this.updateUserRewardPoints(report.userId, 10);
        
        // Create a notification for the user
        this.createNotification({
          userId: report.userId,
          message: `Your scouting report for ${report.playerName} has been liked by a club!`,
          type: 'report_liked',
          relatedId: id
        });
      }
      
      return updatedReport;
    }
    return undefined;
  }
  
  async updateScoutingReportPhoto(id: number, photoUrl: string): Promise<ScoutingReport | undefined> {
    const report = this.scoutingReports.get(id);
    if (report) {
      const updatedReport = { ...report, photoUrl };
      this.scoutingReports.set(id, updatedReport);
      return updatedReport;
    }
    return undefined;
  }
  
  // Notification operations
  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }
  
  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const now = new Date();
    const notification: Notification = {
      ...insertNotification,
      id,
      read: false,
      createdAt: now
    };
    this.notifications.set(id, notification);
    return notification;
  }
  
  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (notification) {
      const updatedNotification = { ...notification, read: true };
      this.notifications.set(id, updatedNotification);
      return updatedNotification;
    }
    return undefined;
  }
  
  // Reward operations
  async getReward(id: number): Promise<Reward | undefined> {
    return this.rewards.get(id);
  }
  
  async getRewardsByUserId(userId: number): Promise<Reward[]> {
    return Array.from(this.rewards.values())
      .filter(reward => reward.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  
  async createReward(insertReward: InsertReward): Promise<Reward> {
    const id = this.rewardIdCounter++;
    const now = new Date();
    const reward: Reward = {
      ...insertReward,
      id,
      redeemed: false,
      createdAt: now
    };
    this.rewards.set(id, reward);
    
    // Create a notification for the user
    this.createNotification({
      userId: insertReward.userId,
      message: `You've earned a new reward: ${insertReward.name}!`,
      type: 'reward_earned',
      relatedId: id
    });
    
    return reward;
  }
  
  async redeemReward(id: number): Promise<Reward | undefined> {
    const reward = this.rewards.get(id);
    if (reward) {
      const updatedReward = { ...reward, redeemed: true };
      this.rewards.set(id, updatedReward);
      
      // Create a notification for the user
      this.createNotification({
        userId: reward.userId,
        message: `You've redeemed your reward: ${reward.name}!`,
        type: 'reward_redeemed',
        relatedId: id
      });
      
      return updatedReward;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
