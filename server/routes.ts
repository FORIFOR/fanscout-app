import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from 'ws';
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertClubSchema, 
  insertMatchSchema, 
  insertScoutingReportSchema,
  insertNotificationSchema,
  insertRewardSchema
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from 'zod-validation-error';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Set up multer for file uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    const filePath = path.join(uploadsDir, req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return res.sendFile(filePath);
    }
    next();
  });
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Club routes
  app.get("/api/clubs", async (req, res) => {
    try {
      const clubs = await storage.getAllClubs();
      return res.json(clubs);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/clubs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const club = await storage.getClub(id);
      
      if (!club) {
        return res.status(404).json({ error: "Club not found" });
      }
      
      return res.json(club);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/clubs", async (req, res) => {
    try {
      const clubData = insertClubSchema.parse(req.body);
      const club = await storage.createClub(clubData);
      return res.status(201).json(club);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Match routes
  app.get("/api/matches", async (req, res) => {
    try {
      const matches = await storage.getAllMatches();
      
      // Enhance matches with club details
      const enhancedMatches = await Promise.all(
        matches.map(async (match) => {
          const homeTeam = await storage.getClub(match.homeTeamId);
          const awayTeam = await storage.getClub(match.awayTeamId);
          
          // Get scouting clubs details
          const scoutingClubIds = match.scoutingClubs as number[];
          const scoutingClubs = await Promise.all(
            scoutingClubIds.map(id => storage.getClub(id))
          );
          
          return {
            ...match,
            homeTeam,
            awayTeam,
            scoutingClubs: scoutingClubs.filter(Boolean)
          };
        })
      );
      
      return res.json(enhancedMatches);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/matches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const match = await storage.getMatch(id);
      
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }
      
      // Enhance match with club details
      const homeTeam = await storage.getClub(match.homeTeamId);
      const awayTeam = await storage.getClub(match.awayTeamId);
      
      // Get scouting clubs details
      const scoutingClubIds = match.scoutingClubs as number[];
      const scoutingClubs = await Promise.all(
        scoutingClubIds.map(id => storage.getClub(id))
      );
      
      const enhancedMatch = {
        ...match,
        homeTeam,
        awayTeam,
        scoutingClubs: scoutingClubs.filter(Boolean)
      };
      
      return res.json(enhancedMatch);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    try {
      const matchData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(matchData);
      return res.status(201).json(match);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Scouting Report routes
  app.post("/api/scouting-reports", async (req, res) => {
    try {
      const reportData = insertScoutingReportSchema.parse(req.body);
      const report = await storage.createScoutingReport(reportData);
      return res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/scouting-reports", async (req, res) => {
    try {
      const { userId, matchId, clubId } = req.query;
      
      let reports = [];
      
      if (userId) {
        reports = await storage.getScoutingReportsByUserId(parseInt(userId as string));
      } else if (matchId) {
        reports = await storage.getScoutingReportsByMatchId(parseInt(matchId as string));
      } else if (clubId) {
        reports = await storage.getScoutingReportsByClubId(parseInt(clubId as string));
      } else {
        // Return all reports if no filter is specified
        reports = Array.from(
          (await Promise.all(
            Array(storage['reportIdCounter']).fill(0).map((_, i) => 
              storage.getScoutingReport(i + 1)
            )
          )).filter(Boolean)
        );
      }
      
      return res.json(reports);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/scouting-reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getScoutingReport(id);
      
      if (!report) {
        return res.status(404).json({ error: "Scouting report not found" });
      }
      
      return res.json(report);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/scouting-reports/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { adminId, feedback } = req.body;
      const updatedReport = await storage.likeScoutingReport(id, adminId, feedback);
      
      if (!updatedReport) {
        return res.status(404).json({ error: "Scouting report not found" });
      }
      
      return res.json(updatedReport);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Photo upload for scouting reports
  app.post("/api/scouting-reports/:id/photo", upload.single('photo'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      const photoUrl = `/uploads/${req.file.filename}`;
      const updatedReport = await storage.updateScoutingReportPhoto(id, photoUrl);
      
      if (!updatedReport) {
        return res.status(404).json({ error: "Scouting report not found" });
      }
      
      return res.json(updatedReport);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Notifications routes
  app.get("/api/notifications", async (req, res) => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const notifications = await storage.getNotificationsByUserId(parseInt(userId as string));
      return res.json(notifications);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/notifications/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const notification = await storage.markNotificationAsRead(id);
      
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      
      return res.json(notification);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Rewards routes
  app.get("/api/rewards", async (req, res) => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const rewards = await storage.getRewardsByUserId(parseInt(userId as string));
      return res.json(rewards);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/rewards", async (req, res) => {
    try {
      const rewardData = insertRewardSchema.parse(req.body);
      const reward = await storage.createReward(rewardData);
      return res.status(201).json(reward);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/rewards/:id/redeem", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const reward = await storage.redeemReward(id);
      
      if (!reward) {
        return res.status(404).json({ error: "Reward not found" });
      }
      
      return res.json(reward);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get user profile with related data
  app.get("/api/user-profile/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Get user's reports
      const reports = await storage.getScoutingReportsByUserId(id);
      
      // Get user's rewards
      const rewards = await storage.getRewardsByUserId(id);
      
      // Get user's unread notifications count
      const notifications = await storage.getNotificationsByUserId(id);
      const unreadNotifications = notifications.filter(n => !n.read);
      
      // Count liked reports
      const likedReports = reports.filter(r => r.liked);
      
      return res.json({
        user,
        reports,
        likedReportsCount: likedReports.length,
        rewards,
        unreadNotificationsCount: unreadNotifications.length
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  
  // Set up WebSocket for realtime notifications
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        // Subscribe to user notifications
        if (data.type === 'subscribe' && data.userId) {
          ws.userId = data.userId;
          console.log(`User ${data.userId} subscribed to notifications`);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });
  
  return httpServer;
}
