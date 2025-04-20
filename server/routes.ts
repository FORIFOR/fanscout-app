import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertClubSchema, 
  insertMatchSchema, 
  insertScoutingReportSchema
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from 'zod-validation-error';

export async function registerRoutes(app: Express): Promise<Server> {
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
      const updatedReport = await storage.likeScoutingReport(id);
      
      if (!updatedReport) {
        return res.status(404).json({ error: "Scouting report not found" });
      }
      
      return res.json(updatedReport);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
