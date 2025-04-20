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
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Club model
export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo"),
  league: text("league").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertClubSchema = createInsertSchema(clubs).omit({
  id: true,
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
  liked: boolean("liked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScoutingReportSchema = createInsertSchema(scoutingReports).omit({
  id: true,
  createdAt: true,
  liked: true,
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
