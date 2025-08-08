import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, timestamp, boolean, int, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// MySQL version of the schema
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  registeredAt: timestamp("registered_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  freeTrialEndsAt: timestamp("free_trial_ends_at"),
  isSubscribed: boolean("is_subscribed").default(false),
});

export const moods = mysqlTable("moods", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  mood: text("mood").notNull(), // 'very-happy', 'happy', 'neutral', 'sad', 'very-sad'
  note: text("note"),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const journalEntries = mysqlTable("journal_entries", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mood: text("mood"),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

export const chatSessions = mysqlTable("chat_sessions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  counselorId: varchar("counselor_id", { length: 36 }), // null for AI sessions
  messages: json("messages").notNull().default([]),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

export const srqAssessments = mysqlTable("srq_assessments", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  answers: json("answers").notNull(), // array of boolean answers
  score: int("score").notNull(),
  interpretation: text("interpretation").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const achievements = mysqlTable("achievements", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  type: text("type").notNull(), // 'first_chat', 'mood_streak', 'journal_entry', etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  unlockedAt: timestamp("unlocked_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const counselors = mysqlTable("counselors", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  description: text("description").notNull(),
  rating: int("rating").notNull().default(5),
  sessionsCount: int("sessions_count").notNull().default(0),
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