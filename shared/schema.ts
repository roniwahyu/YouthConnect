import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  registeredAt: timestamp("registered_at").notNull().default(sql`now()`),
  freeTrialEndsAt: timestamp("free_trial_ends_at"),
  isSubscribed: boolean("is_subscribed").default(false),
});

export const moods = pgTable("moods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  mood: text("mood").notNull(), // 'very-happy', 'happy', 'neutral', 'sad', 'very-sad'
  note: text("note"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mood: text("mood"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  counselorId: varchar("counselor_id"), // null for AI sessions
  messages: jsonb("messages").notNull().default([]),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const srqAssessments = pgTable("srq_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  answers: jsonb("answers").notNull(), // array of boolean answers
  score: integer("score").notNull(),
  interpretation: text("interpretation").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'first_chat', 'mood_streak', 'journal_entry', etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  unlockedAt: timestamp("unlocked_at").notNull().default(sql`now()`),
});

export const counselors = pgTable("counselors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  description: text("description").notNull(),
  rating: integer("rating").notNull().default(5),
  sessionsCount: integer("sessions_count").notNull().default(0),
  isOnline: boolean("is_online").default(true),
  imageUrl: text("image_url"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
});

export const insertMoodSchema = createInsertSchema(moods).pick({
  mood: true,
  note: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).pick({
  title: true,
  content: true,
  mood: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  counselorId: true,
  messages: true,
});

export const insertSrqAssessmentSchema = createInsertSchema(srqAssessments).pick({
  answers: true,
  score: true,
  interpretation: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Mood = typeof moods.$inferSelect;
export type InsertMood = z.infer<typeof insertMoodSchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type SrqAssessment = typeof srqAssessments.$inferSelect;
export type InsertSrqAssessment = z.infer<typeof insertSrqAssessmentSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type Counselor = typeof counselors.$inferSelect;
