import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import MoodCheckin from "@/components/mood-checkin";
import { getStoredUser, isTrialActive, getTrialDaysLeft } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(getStoredUser());
  const [showMoodCheckin, setShowMoodCheckin] = useState(false);

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  const { data: moods } = useQuery({
    queryKey: ["/api/moods"],
    enabled: !!user,
  });

  const { data: achievements } = useQuery({
    queryKey: ["/api/achievements"],
    enabled: !!user,
  });

  const createChatMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/chat/sessions", {
        counselorId: null, // AI session
        messages: [],
      });
      return response.json();
    },
    onSuccess: (data) => {
      setLocation(`/chat/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal membuat sesi chat",
        variant: "destructive",
      });
    },
  });

  if (!user) return null;

  const trialActive = isTrialActive(user);
  const daysLeft = getTrialDaysLeft(user);

  const todayMood = moods?.find((mood: any) => {
    const today = new Date().toDateString();
    const moodDate = new Date(mood.createdAt).toDateString();
    return today === moodDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Selamat datang, {user.name}!
                </h1>
                <p className="text-gray-500">Bagaimana perasaanmu hari ini?</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!user.isSubscribed && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  trialActive 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  <i className="fas fa-clock mr-1"></i>
                  {trialActive ? `${daysLeft} hari gratis tersisa` : "Trial berakhir"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mood Check Today */}
        {!todayMood && (
          <Card className="mb-8 bg-gradient-to-r from-teal-50 to-pink-50 border-teal-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Mood Check Hari Ini
                  </h3>
                  <p className="text-gray-600">
                    Yuk catat suasana hatimu hari ini untuk tracking yang lebih baik
                  </p>
                </div>
                <Button
                  onClick={() => setShowMoodCheckin(true)}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                >
                  <i className="fas fa-heart mr-2"></i>
                  Catat Mood
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* AI Chat */}
          <Card className="hover:shadow-lg transition-shadow group cursor-pointer">
            <CardContent className="p-6">
              <div 
                className="flex items-center space-x-4"
                onClick={() => createChatMutation.mutate()}
              >
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-3 rounded-lg group-hover:scale-105 transition-transform">
                  <i className="fas fa-robot text-teal-500 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Chat AI</h3>
                  <p className="text-gray-600 text-sm">Konseling dengan AI 24/7</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="hover:shadow-lg transition-shadow group cursor-pointer">
            <CardContent className="p-6">
              <div 
                className="flex items-center space-x-4"
                onClick={() => setLocation("/education")}
              >
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg group-hover:scale-105 transition-transform">
                  <i className="fas fa-graduation-cap text-purple-500 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Edukasi</h3>
                  <p className="text-gray-600 text-sm">Artikel & video kesehatan mental</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Journal */}
          <Card className="hover:shadow-lg transition-shadow group cursor-pointer">
            <CardContent className="p-6">
              <div 
                className="flex items-center space-x-4"
                onClick={() => setLocation("/journal")}
              >
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg group-hover:scale-105 transition-transform">
                  <i className="fas fa-book text-orange-500 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Jurnal</h3>
                  <p className="text-gray-600 text-sm">Tulis perasaan & refleksi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SRQ-29 Test */}
          <Card className="hover:shadow-lg transition-shadow group cursor-pointer">
            <CardContent className="p-6">
              <div 
                className="flex items-center space-x-4"
                onClick={() => setLocation("/srq29")}
              >
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg group-hover:scale-105 transition-transform">
                  <i className="fas fa-clipboard-check text-blue-500 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Tes SRQ-29</h3>
                  <p className="text-gray-600 text-sm">Cek kesehatan emosi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Relaxation */}
          <Card className="hover:shadow-lg transition-shadow group cursor-pointer">
            <CardContent className="p-6">
              <div 
                className="flex items-center space-x-4"
                onClick={() => setLocation("/relaxation")}
              >
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg group-hover:scale-105 transition-transform">
                  <i className="fas fa-leaf text-green-500 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Relaksasi</h3>
                  <p className="text-gray-600 text-sm">Musik & suara alam</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="hover:shadow-lg transition-shadow group cursor-pointer">
            <CardContent className="p-6">
              <div 
                className="flex items-center space-x-4"
                onClick={() => setLocation("/achievements")}
              >
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg group-hover:scale-105 transition-transform">
                  <i className="fas fa-trophy text-yellow-500 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Pencapaian</h3>
                  <p className="text-gray-600 text-sm">Tracking progress & reward</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Panel */}
          <Card className="hover:shadow-lg transition-shadow group cursor-pointer">
            <CardContent className="p-6">
              <div 
                className="flex items-center space-x-4"
                onClick={() => setLocation("/admin")}
              >
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg group-hover:scale-105 transition-transform">
                  <i className="fas fa-cog text-blue-500 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Admin Panel</h3>
                  <p className="text-gray-600 text-sm">Database & system settings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Crisis Support */}
        <Card className="bg-gradient-to-r from-pink-100 to-red-100 border-pink-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-pink-500 p-3 rounded-lg">
                <i className="fas fa-phone text-white text-xl"></i>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-pink-900 text-lg">Butuh Bantuan Segera?</h4>
                <p className="text-pink-700">
                  Hubungi hotline krisis: <span className="font-semibold">119</span> atau{" "}
                  <span className="font-semibold">021-7256526</span>
                </p>
              </div>
              <Button
                onClick={() => window.open("tel:119", "_self")}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                <i className="fas fa-phone mr-2"></i>
                Hubungi Sekarang
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {showMoodCheckin && (
        <MoodCheckin onClose={() => setShowMoodCheckin(false)} />
      )}
    </div>
  );
}
