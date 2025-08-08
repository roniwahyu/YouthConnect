import { type User, type InsertUser, type Mood, type InsertMood, type JournalEntry, type InsertJournalEntry, type ChatSession, type InsertChatSession, type SrqAssessment, type InsertSrqAssessment, type Achievement, type Counselor } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Moods
  getMoodsByUserId(userId: string): Promise<Mood[]>;
  createMood(userId: string, mood: InsertMood): Promise<Mood>;

  // Journal
  getJournalEntriesByUserId(userId: string): Promise<JournalEntry[]>;
  createJournalEntry(userId: string, entry: InsertJournalEntry): Promise<JournalEntry>;
  updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry | undefined>;
  deleteJournalEntry(id: string): Promise<boolean>;

  // Chat
  getChatSessionsByUserId(userId: string): Promise<ChatSession[]>;
  getChatSession(id: string): Promise<ChatSession | undefined>;
  createChatSession(userId: string, session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined>;

  // SRQ Assessment
  getSrqAssessmentsByUserId(userId: string): Promise<SrqAssessment[]>;
  createSrqAssessment(userId: string, assessment: InsertSrqAssessment): Promise<SrqAssessment>;

  // Achievements
  getAchievementsByUserId(userId: string): Promise<Achievement[]>;
  createAchievement(userId: string, achievement: Omit<Achievement, 'id' | 'userId' | 'unlockedAt'>): Promise<Achievement>;

  // Counselors
  getCounselors(): Promise<Counselor[]>;
  getCounselor(id: string): Promise<Counselor | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private moods: Map<string, Mood> = new Map();
  private journalEntries: Map<string, JournalEntry> = new Map();
  private chatSessions: Map<string, ChatSession> = new Map();
  private srqAssessments: Map<string, SrqAssessment> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private counselors: Map<string, Counselor> = new Map();

  constructor() {
    // Seed counselors
    this.seedCounselors();
  }

  private seedCounselors() {
    const counselorData = [
      {
        id: "sarah-wijaya",
        name: "Dr. Sarah Wijaya",
        specialization: "Psikolog Klinis",
        description: "Spesialis anxiety, depression, dan masalah akademik remaja",
        rating: 5,
        sessionsCount: 200,
        isOnline: true,
        imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        id: "budi-santoso",
        name: "Budi Santoso, M.Psi",
        specialization: "Konselor Remaja",
        description: "Ahli dalam masalah percintaan, bullying, dan self-esteem",
        rating: 5,
        sessionsCount: 150,
        isOnline: false,
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        id: "rina-sari",
        name: "Rina Sari, S.Psi",
        specialization: "Psikolog Anak & Remaja",
        description: "Fokus pada trauma, ADHD, dan gangguan perilaku",
        rating: 5,
        sessionsCount: 95,
        isOnline: true,
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      }
    ];

    counselorData.forEach(counselor => {
      this.counselors.set(counselor.id, counselor);
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const freeTrialEndsAt = new Date();
    freeTrialEndsAt.setDate(freeTrialEndsAt.getDate() + 7);
    
    const user: User = {
      ...insertUser,
      id,
      registeredAt: new Date(),
      freeTrialEndsAt,
      isSubscribed: false,
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Moods
  async getMoodsByUserId(userId: string): Promise<Mood[]> {
    return Array.from(this.moods.values()).filter(mood => mood.userId === userId);
  }

  async createMood(userId: string, insertMood: InsertMood): Promise<Mood> {
    const id = randomUUID();
    const mood: Mood = {
      ...insertMood,
      id,
      userId,
      createdAt: new Date(),
    };
    
    this.moods.set(id, mood);
    return mood;
  }

  // Journal
  async getJournalEntriesByUserId(userId: string): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createJournalEntry(userId: string, insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const id = randomUUID();
    const entry: JournalEntry = {
      ...insertEntry,
      id,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.journalEntries.set(id, entry);
    return entry;
  }

  async updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry | undefined> {
    const entry = this.journalEntries.get(id);
    if (!entry) return undefined;
    
    const updatedEntry = { ...entry, ...updates, updatedAt: new Date() };
    this.journalEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteJournalEntry(id: string): Promise<boolean> {
    return this.journalEntries.delete(id);
  }

  // Chat
  async getChatSessionsByUserId(userId: string): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async createChatSession(userId: string, insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const session: ChatSession = {
      ...insertSession,
      id,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.chatSessions.set(id, session);
    return session;
  }

  async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined> {
    const session = this.chatSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates, updatedAt: new Date() };
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }

  // SRQ Assessment
  async getSrqAssessmentsByUserId(userId: string): Promise<SrqAssessment[]> {
    return Array.from(this.srqAssessments.values())
      .filter(assessment => assessment.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createSrqAssessment(userId: string, insertAssessment: InsertSrqAssessment): Promise<SrqAssessment> {
    const id = randomUUID();
    const assessment: SrqAssessment = {
      ...insertAssessment,
      id,
      userId,
      createdAt: new Date(),
    };
    
    this.srqAssessments.set(id, assessment);
    return assessment;
  }

  // Achievements
  async getAchievementsByUserId(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.userId === userId)
      .sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime());
  }

  async createAchievement(userId: string, achievementData: Omit<Achievement, 'id' | 'userId' | 'unlockedAt'>): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = {
      ...achievementData,
      id,
      userId,
      unlockedAt: new Date(),
    };
    
    this.achievements.set(id, achievement);
    return achievement;
  }

  // Counselors
  async getCounselors(): Promise<Counselor[]> {
    return Array.from(this.counselors.values());
  }

  async getCounselor(id: string): Promise<Counselor | undefined> {
    return this.counselors.get(id);
  }
}

// Export memory storage by default, can be switched to database storage when needed
export const storage = new MemStorage();

// For database storage, uncomment the next line and comment the above
// export { storage } from './storage-db';
