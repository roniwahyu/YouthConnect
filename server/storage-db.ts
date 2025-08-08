import { eq } from "drizzle-orm";
import { db } from "./db";
import type { 
  User, 
  InsertUser, 
  Mood, 
  InsertMood, 
  JournalEntry, 
  InsertJournalEntry,
  ChatSession,
  InsertChatSession,
  SrqAssessment,
  InsertSrqAssessment,
  Achievement,
  Counselor
} from "../shared/schema";

// Import schema tables
import { 
  users, 
  moods, 
  journalEntries, 
  chatSessions, 
  srqAssessments, 
  achievements,
  counselors 
} from "../shared/schema";

// Import IStorage interface from memory storage
import type { IStorage } from "./storage";

// Adapter class to match the IStorage interface from memory storage

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result[0] || undefined;
    } catch (error) {
      console.error('Database error in getUser:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email));
      return result[0] || undefined;
    } catch (error) {
      console.error('Database error in getUserByEmail:', error);
      return undefined;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(userData).returning();
      return result[0];
    } catch (error) {
      console.error('Database error in createUser:', error);
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    try {
      const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
      return result[0] || undefined;
    } catch (error) {
      console.error('Database error in updateUser:', error);
      return undefined;
    }
  }

  // Moods
  async getMoodsByUserId(userId: string): Promise<Mood[]> {
    try {
      return await db.select().from(moods).where(eq(moods.userId, userId));
    } catch (error) {
      console.error('Database error in getMoodsByUserId:', error);
      return [];
    }
  }

  async createMood(userId: string, moodData: InsertMood): Promise<Mood> {
    try {
      const result = await db.insert(moods).values({ ...moodData, userId }).returning();
      return result[0];
    } catch (error) {
      console.error('Database error in createMood:', error);
      throw error;
    }
  }

  // Journal
  async getJournalEntriesByUserId(userId: string): Promise<JournalEntry[]> {
    try {
      return await db.select().from(journalEntries).where(eq(journalEntries.userId, userId));
    } catch (error) {
      console.error('Database error in getJournalEntriesByUserId:', error);
      return [];
    }
  }

  async createJournalEntry(userId: string, entryData: InsertJournalEntry): Promise<JournalEntry> {
    try {
      const result = await db.insert(journalEntries).values({ ...entryData, userId }).returning();
      return result[0];
    } catch (error) {
      console.error('Database error in createJournalEntry:', error);
      throw error;
    }
  }

  async updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry | undefined> {
    try {
      const result = await db.update(journalEntries).set(updates).where(eq(journalEntries.id, id)).returning();
      return result[0] || undefined;
    } catch (error) {
      console.error('Database error in updateJournalEntry:', error);
      return undefined;
    }
  }

  async deleteJournalEntry(id: string): Promise<boolean> {
    try {
      await db.delete(journalEntries).where(eq(journalEntries.id, id));
      return true;
    } catch (error) {
      console.error('Database error in deleteJournalEntry:', error);
      return false;
    }
  }

  // Chat
  async getChatSessionsByUserId(userId: string): Promise<ChatSession[]> {
    try {
      return await db.select().from(chatSessions).where(eq(chatSessions.userId, userId));
    } catch (error) {
      console.error('Database error in getChatSessionsByUserId:', error);
      return [];
    }
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    try {
      const result = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
      return result[0] || undefined;
    } catch (error) {
      console.error('Database error in getChatSession:', error);
      return undefined;
    }
  }

  async createChatSession(userId: string, sessionData: InsertChatSession): Promise<ChatSession> {
    try {
      const result = await db.insert(chatSessions).values({ ...sessionData, userId }).returning();
      return result[0];
    } catch (error) {
      console.error('Database error in createChatSession:', error);
      throw error;
    }
  }

  async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined> {
    try {
      const result = await db.update(chatSessions).set(updates).where(eq(chatSessions.id, id)).returning();
      return result[0] || undefined;
    } catch (error) {
      console.error('Database error in updateChatSession:', error);
      return undefined;
    }
  }

  // SRQ Assessment
  async getSrqAssessmentsByUserId(userId: string): Promise<SrqAssessment[]> {
    try {
      return await db.select().from(srqAssessments).where(eq(srqAssessments.userId, userId));
    } catch (error) {
      console.error('Database error in getSrqAssessmentsByUserId:', error);
      return [];
    }
  }

  async createSrqAssessment(userId: string, assessmentData: InsertSrqAssessment): Promise<SrqAssessment> {
    try {
      const result = await db.insert(srqAssessments).values({ ...assessmentData, userId }).returning();
      return result[0];
    } catch (error) {
      console.error('Database error in createSrqAssessment:', error);
      throw error;
    }
  }

  // Achievements
  async getAchievementsByUserId(userId: string): Promise<Achievement[]> {
    try {
      return await db.select().from(achievements).where(eq(achievements.userId, userId));
    } catch (error) {
      console.error('Database error in getAchievementsByUserId:', error);
      return [];
    }
  }

  async createAchievement(userId: string, achievementData: Omit<Achievement, 'id' | 'userId' | 'unlockedAt'>): Promise<Achievement> {
    try {
      const result = await db.insert(achievements).values({ ...achievementData, userId }).returning();
      return result[0];
    } catch (error) {
      console.error('Database error in createAchievement:', error);
      throw error;
    }
  }

  // Counselors
  async getCounselors(): Promise<Counselor[]> {
    try {
      return await db.select().from(counselors);
    } catch (error) {
      console.error('Database error in getCounselors:', error);
      return [];
    }
  }

  async getCounselor(id: string): Promise<Counselor | undefined> {
    try {
      const result = await db.select().from(counselors).where(eq(counselors.id, id));
      return result[0] || undefined;
    } catch (error) {
      console.error('Database error in getCounselor:', error);
      return undefined;
    }
  }
}

export const storage = new DatabaseStorage();