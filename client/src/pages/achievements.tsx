import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/header";
import { getStoredUser } from "@/lib/auth";

export default function Achievements() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(getStoredUser());

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  const { data: achievements = [] } = useQuery({
    queryKey: ["/api/achievements"],
    enabled: !!user,
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Mock data for achievements that can be earned
  const allAchievements = [
    {
      id: "first_chat",
      title: "Percakapan Pertama",
      description: "Memulai chat pertama dengan AI counselor",
      icon: "💬",
      category: "Chat",
      xp: 50,
      rarity: "Common"
    },
    {
      id: "mood_tracker",
      title: "Mood Tracker",
      description: "Catat mood selama 7 hari berturut-turut",
      icon: "📊",
      category: "Mood",
      xp: 100,
      rarity: "Common"
    },
    {
      id: "first_journal",
      title: "Penulis Pemula",
      description: "Menulis entry jurnal pertama",
      icon: "📝",
      category: "Journal",
      xp: 50,
      rarity: "Common"
    },
    {
      id: "journal_streak_7",
      title: "Konsisten Menulis",
      description: "Menulis jurnal selama 7 hari berturut-turut",
      icon: "✍️",
      category: "Journal",
      xp: 200,
      rarity: "Uncommon"
    },
    {
      id: "srq29_completed",
      title: "Self Assessment",
      description: "Menyelesaikan tes SRQ-29",
      icon: "🔍",
      category: "Assessment",
      xp: 75,
      rarity: "Common"
    },
    {
      id: "meditation_master",
      title: "Meditation Master",
      description: "Menggunakan tools relaksasi 20 kali",
      icon: "🧘",
      category: "Relaksasi",
      xp: 300,
      rarity: "Rare"
    },
    {
      id: "education_enthusiast",
      title: "Pembelajar Antusias",
      description: "Membaca 10 artikel edukasi",
      icon: "📚",
      category: "Edukasi",
      xp: 150,
      rarity: "Uncommon"
    },
    {
      id: "milestone_30_days",
      title: "Satu Bulan Bersama",
      description: "Menggunakan CURHATIN selama 30 hari",
      icon: "🎉",
      category: "Milestone",
      xp: 500,
      rarity: "Epic"
    },
    {
      id: "help_seeker",
      title: "Berani Meminta Bantuan",
      description: "Menghubungi konselor profesional",
      icon: "🤝",
      category: "Counseling",
      xp: 250,
      rarity: "Rare"
    }
  ];

  // Mock progress data
  const progressData = {
    totalXP: achievements?.reduce((sum: number, achievement: any) => sum + 100, 0) || 0,
    level: Math.floor((achievements?.length || 0) / 3) + 1,
    completedAchievements: achievements?.length || 0,
    totalAchievements: allAchievements.length
  };

  const getNextLevelXP = (level: number) => level * 500;
  const getCurrentLevelXP = (level: number) => (level - 1) * 500;
  const progressToNextLevel = progressData.totalXP - getCurrentLevelXP(progressData.level);
  const xpNeededForNextLevel = getNextLevelXP(progressData.level) - getCurrentLevelXP(progressData.level);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "bg-gray-100 text-gray-800 border-gray-300";
      case "Uncommon": return "bg-green-100 text-green-800 border-green-300";
      case "Rare": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Epic": return "bg-purple-100 text-purple-800 border-purple-300";
      case "Legendary": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const isUnlocked = (achievementId: string) => {
    return achievements?.some((a: any) => a.type === achievementId);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-8 mb-8">
            <div className="bg-yellow-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-trophy text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="text-gradient-teal-pink">Pencapaian</span> & Progress
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rayakan setiap langkah kecil dalam perjalanan kesehatan mentalmu
            </p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {progressData.level}
              </div>
              <p className="text-yellow-800 font-medium">Level Saat Ini</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {progressData.totalXP}
              </div>
              <p className="text-blue-800 font-medium">Total XP</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {progressData.completedAchievements}
              </div>
              <p className="text-green-800 font-medium">Pencapaian Terbuka</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round((progressData.completedAchievements / progressData.totalAchievements) * 100)}%
              </div>
              <p className="text-purple-800 font-medium">Completion Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Progress ke Level {progressData.level + 1}</h3>
                <p className="text-sm text-gray-600">
                  {progressToNextLevel} / {xpNeededForNextLevel} XP
                </p>
              </div>
              <div className="bg-yellow-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-yellow-800">Level {progressData.level}</span>
              </div>
            </div>
            <Progress value={(progressToNextLevel / xpNeededForNextLevel) * 100} className="h-3" />
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allAchievements.map((achievement) => {
            const unlocked = isUnlocked(achievement.id);
            
            return (
              <Card 
                key={achievement.id} 
                className={`transition-all hover:shadow-lg ${
                  unlocked 
                    ? "bg-white border-green-200 shadow-md" 
                    : "bg-gray-50 border-gray-200 opacity-75"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`text-3xl ${unlocked ? '' : 'grayscale'}`}>
                        {unlocked ? achievement.icon : "🔒"}
                      </div>
                      <div>
                        <CardTitle className={`text-lg ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                          {achievement.title}
                        </CardTitle>
                        <Badge 
                          variant="outline" 
                          className={`text-xs mt-1 ${getRarityColor(achievement.rarity)}`}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                    {unlocked && (
                      <div className="text-green-500">
                        <i className="fas fa-check-circle text-xl"></i>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className={`text-sm mb-3 ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                    {achievement.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="text-xs">
                        {achievement.category}
                      </Badge>
                      <span className={`text-sm font-medium ${unlocked ? 'text-blue-600' : 'text-gray-400'}`}>
                        +{achievement.xp} XP
                      </span>
                    </div>
                    {unlocked && (
                      <div className="text-xs text-gray-500">
                        {achievements?.find((a: any) => a.type === achievement.id) && (
                          <span>
                            {new Date(achievements.find((a: any) => a.type === achievement.id).unlockedAt).toLocaleDateString("id-ID")}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Motivational Section */}
        {progressData.completedAchievements === 0 && (
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-teal-100 to-pink-100 border-teal-200">
              <CardContent className="p-8">
                <div className="bg-teal-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-star text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Mulai Perjalananmu!
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  Setiap langkah kecil dalam menjaga kesehatan mental adalah pencapaian yang patut dirayakan. 
                  Mulai chat pertamamu atau tulis jurnal untuk mendapat achievement pertama!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setLocation("/chat")}
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                  >
                    <i className="fas fa-robot mr-2"></i>
                    Mulai Chat AI
                  </button>
                  <button
                    onClick={() => setLocation("/journal")}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                  >
                    <i className="fas fa-pen mr-2"></i>
                    Tulis Jurnal
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
