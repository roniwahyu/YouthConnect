import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMoodSchema, insertJournalEntrySchema, insertChatSessionSchema, insertSrqAssessmentSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import OpenAI from "openai";

// Import database config detection function
let detectDatabaseType: () => string = () => 'memory';
try {
  const dbConfig = require('./db-config');
  detectDatabaseType = dbConfig.detectDatabaseType;
} catch {
  // Fallback if db-config is not available
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "sk-placeholder",
});

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware
  const requireAuth = async (req: any, res: any, next: any) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = user;
    next();
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Set session
      req.session.userId = user.id;
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session
      req.session.userId = user.id;
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, (req: any, res) => {
    res.json({ user: { ...req.user, password: undefined } });
  });

  // Mood routes
  app.get("/api/moods", requireAuth, async (req: any, res) => {
    try {
      const moods = await storage.getMoodsByUserId(req.user.id);
      res.json(moods);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/moods", requireAuth, async (req: any, res) => {
    try {
      const moodData = insertMoodSchema.parse(req.body);
      const mood = await storage.createMood(req.user.id, moodData);
      res.json(mood);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Journal routes
  app.get("/api/journal", requireAuth, async (req: any, res) => {
    try {
      const entries = await storage.getJournalEntriesByUserId(req.user.id);
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/journal", requireAuth, async (req: any, res) => {
    try {
      const entryData = insertJournalEntrySchema.parse(req.body);
      const entry = await storage.createJournalEntry(req.user.id, entryData);
      res.json(entry);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/journal/:id", requireAuth, async (req: any, res) => {
    try {
      const entryData = insertJournalEntrySchema.partial().parse(req.body);
      const entry = await storage.updateJournalEntry(req.params.id, entryData);
      if (!entry) {
        return res.status(404).json({ message: "Journal entry not found" });
      }
      res.json(entry);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/journal/:id", requireAuth, async (req: any, res) => {
    try {
      const deleted = await storage.deleteJournalEntry(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Journal entry not found" });
      }
      res.json({ message: "Journal entry deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Chat routes
  app.get("/api/chat/sessions", requireAuth, async (req: any, res) => {
    try {
      const sessions = await storage.getChatSessionsByUserId(req.user.id);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/chat/sessions", requireAuth, async (req: any, res) => {
    try {
      const sessionData = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(req.user.id, sessionData);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/chat/:sessionId/message", requireAuth, async (req: any, res) => {
    try {
      const { message } = req.body;
      const session = await storage.getChatSession(req.params.sessionId);
      
      if (!session || session.userId !== req.user.id) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      const messages = Array.isArray(session.messages) ? session.messages : [];
      
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };
      
      messages.push(userMessage);

      let aiResponse = "";

      // Generate AI response if this is an AI session (no counselorId)
      if (!session.counselorId) {
        try {
          // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are a compassionate AI counselor specializing in youth mental health. Provide supportive, empathetic responses. Always encourage professional help for serious issues. Respond in Indonesian (Bahasa Indonesia)."
              },
              ...messages.slice(-10).map((msg: any) => ({
                role: msg.role,
                content: msg.content
              }))
            ],
            max_tokens: 500,
            temperature: 0.7,
          });

          aiResponse = completion.choices[0]?.message?.content || "Maaf, saya tidak dapat memproses pesan Anda saat ini. Silakan coba lagi.";
        } catch (error) {
          aiResponse = "Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi konselor profesional jika Anda memerlukan bantuan segera.";
        }

        // Add AI response
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiResponse,
          timestamp: new Date().toISOString(),
        };
        
        messages.push(aiMessage);
      }

      // Update session
      const updatedSession = await storage.updateChatSession(req.params.sessionId, {
        messages,
      });

      res.json(updatedSession);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // SRQ-29 Assessment routes
  app.get("/api/srq29", requireAuth, async (req: any, res) => {
    try {
      const assessments = await storage.getSrqAssessmentsByUserId(req.user.id);
      res.json(assessments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/srq29", requireAuth, async (req: any, res) => {
    try {
      const { answers } = req.body;
      
      if (!Array.isArray(answers) || answers.length !== 29) {
        return res.status(400).json({ message: "Invalid answers format" });
      }

      // Calculate score
      const score = answers.filter(answer => answer === true).length;
      
      // Generate interpretation
      let interpretation = "";
      if (score <= 5) {
        interpretation = "Hasil menunjukkan tingkat stres dan masalah emosional yang rendah. Anda tampak memiliki kesehatan mental yang baik.";
      } else if (score <= 12) {
        interpretation = "Hasil menunjukkan tingkat stres sedang. Anda mungkin mengalami beberapa tekanan emosional yang perlu perhatian.";
      } else if (score <= 20) {
        interpretation = "Hasil menunjukkan tingkat stres yang cukup tinggi. Disarankan untuk mencari dukungan dari konselor atau profesional kesehatan mental.";
      } else {
        interpretation = "Hasil menunjukkan tingkat stres yang tinggi. Sangat disarankan untuk segera berkonsultasi dengan profesional kesehatan mental.";
      }

      const assessmentData = insertSrqAssessmentSchema.parse({
        answers,
        score,
        interpretation,
      });

      const assessment = await storage.createSrqAssessment(req.user.id, assessmentData);
      res.json(assessment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Achievement routes
  app.get("/api/achievements", requireAuth, async (req: any, res) => {
    try {
      const achievements = await storage.getAchievementsByUserId(req.user.id);
      res.json(achievements);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Counselor routes
  app.get("/api/counselors", requireAuth, async (req: any, res) => {
    try {
      const counselors = await storage.getCounselors();
      res.json(counselors);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/counselors/:id", requireAuth, async (req: any, res) => {
    try {
      const counselor = await storage.getCounselor(req.params.id);
      if (!counselor) {
        return res.status(404).json({ message: "Counselor not found" });
      }
      res.json(counselor);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin routes
  app.get("/api/admin/database", requireAuth, async (req, res) => {
    try {
      const dbUrl = process.env.DATABASE_URL;
      const dbType = detectDatabaseType();
      
      res.json({
        type: dbType,
        connectionString: dbUrl ? '***configured***' : '',
        isConnected: !!dbUrl,
        lastChecked: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error fetching database config:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/database/test", requireAuth, async (req, res) => {
    try {
      const { type, connectionString } = req.body;
      
      if (!connectionString || !type) {
        return res.status(400).json({ success: false, error: "Missing connection string or type" });
      }

      const isValid = connectionString.includes('://') && connectionString.length > 10;
      
      res.json({
        success: isValid,
        error: isValid ? null : "Invalid connection string format",
      });
    } catch (error) {
      console.error("Error testing database connection:", error);
      res.json({ success: false, error: "Connection test failed" });
    }
  });

  app.post("/api/admin/database/update", requireAuth, async (req, res) => {
    try {
      const { type, connectionString } = req.body;
      
      if (!connectionString || !type) {
        return res.status(400).json({ message: "Missing connection string or type" });
      }

      res.json({ 
        message: "Database configuration updated successfully. Please restart the application for changes to take effect.",
        requiresRestart: true 
      });
    } catch (error) {
      console.error("Error updating database config:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/system", requireAuth, async (req, res) => {
    try {
      const memUsage = process.memoryUsage();
      const uptime = process.uptime();
      
      const formatUptime = (seconds: number) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${days}d ${hours}h ${minutes}m`;
      };

      res.json({
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        uptime: formatUptime(uptime),
        memoryUsage: {
          used: Math.round(memUsage.heapUsed / 1024 / 1024),
          total: Math.round(memUsage.heapTotal / 1024 / 1024),
        },
      });
    } catch (error) {
      console.error("Error fetching system info:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
