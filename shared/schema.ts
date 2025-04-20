import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  profileImage: text("profile_image"),
  rewardPoints: integer("reward_points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  rewardPoints: true,
  createdAt: true,
});

// Club model
export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo"),
  league: text("league").notNull(),
  description: text("description"),
  isAdmin: boolean("is_admin").default(false), // Indicates if this is an admin user for the club
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertClubSchema = createInsertSchema(clubs).omit({
  id: true,
  isAdmin: true,
  createdAt: true,
});

// Match model
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  homeTeamId: integer("home_team_id").notNull(),
  awayTeamId: integer("away_team_id").notNull(),
  date: timestamp("date").notNull(),
  venue: text("venue").notNull(),
  league: text("league").notNull(),
  scoutingClubs: jsonb("scouting_clubs").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

// ScoutingReport model
export const scoutingReports = pgTable("scouting_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Fan who submitted
  matchId: integer("match_id").notNull(),
  clubId: integer("club_id").notNull(), // Club being scouted for
  playerName: text("player_name").notNull(),
  playerAge: integer("player_age").notNull(),
  playerPosition: text("player_position").notNull(),
  overallRating: integer("overall_rating").notNull(),
  technicalAbility: integer("technical_ability").notNull(),
  physicalAttributes: integer("physical_attributes").notNull(),
  tacticalUnderstanding: integer("tactical_understanding").notNull(),
  mentalAttributes: integer("mental_attributes").notNull(),
  potential: integer("potential").notNull(),
  observations: text("observations").notNull(),
  recommendation: text("recommendation").notNull(),
  photoUrl: text("photo_url"), // URL to uploaded photo (optional)
  liked: boolean("liked").default(false),
  likedAt: timestamp("liked_at"), // When the report was liked
  likedBy: integer("liked_by"), // Which club admin liked the report
  feedback: text("feedback"), // Optional feedback from club admins
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScoutingReportSchema = createInsertSchema(scoutingReports).omit({
  id: true,
  liked: true,
  likedAt: true,
  likedBy: true,
  feedback: true,
  createdAt: true,
});

// Notification model for user notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // e.g., 'report_liked', 'reward_earned'
  read: boolean("read").default(false),
  relatedId: integer("related_id"), // ID of related entity (report, reward, etc.)
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true, 
  read: true,
  createdAt: true,
});

// Reward records for tracking earned rewards
export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  pointsEarned: integer("points_earned").notNull(),
  rewardType: text("reward_type").notNull(), // e.g., 'tickets', 'merchandise', 'experience'
  redeemed: boolean("redeemed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
  redeemed: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Club = typeof clubs.$inferSelect;
export type InsertClub = z.infer<typeof insertClubSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type ScoutingReport = typeof scoutingReports.$inferSelect;
export type InsertScoutingReport = z.infer<typeof insertScoutingReportSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type Reward = typeof rewards.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;
