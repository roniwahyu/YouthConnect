import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/header";
import { getStoredUser, isTrialActive } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Counselors() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState(getStoredUser());
  const [selectedCounselor, setSelectedCounselor] = useState<any>(null);
  const [bookingForm, setBookingForm] = useState({
    date: "",
    time: "",
    concerns: "",
    sessionType: "",
  });

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  const { data: counselors = [], isLoading } = useQuery({
    queryKey: ["/api/counselors"],
    enabled: !!user,
    select: (data) => Array.isArray(data) ? data : [],
  });

  const bookSessionMutation = useMutation({
    mutationFn: async (data: any) => {
      // In a real app, this would book a session
      // For now, we'll simulate the booking
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 1000);
      });
    },
    onSuccess: () => {
      toast({
        title: "Sesi Berhasil Dijadwalkan",
        description: "Konselor akan menghubungi Anda sesuai jadwal yang dipilih.",
      });
      setSelectedCounselor(null);
      setBookingForm({ date: "", time: "", concerns: "", sessionType: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal menjadwalkan sesi",
        variant: "destructive",
      });
    },
  });

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingForm.date || !bookingForm.time || !bookingForm.concerns || !bookingForm.sessionType) {
      toast({
        title: "Form Tidak Lengkap",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    if (!isTrialActive(user!) && !user!.isSubscribed) {
      toast({
        title: "Langganan Diperlukan",
        description: "Anda perlu berlangganan untuk mengakses konselor profesional",
        variant: "destructive",
      });
      return;
    }

    bookSessionMutation.mutate({
      counselorId: selectedCounselor.id,
      ...bookingForm,
    });
  };

  if (!user) return null;

  const trialActive = isTrialActive(user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 mb-8">
            <div className="bg-purple-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user-md text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pilih <span className="text-gradient-teal-pink">Konselor</span> Terbaik
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Konselor bersertifikat yang berpengalaman dalam menangani masalah kesehatan mental remaja
            </p>
          </div>
        </div>

        {/* Access Notice */}
        {!trialActive && !user.isSubscribed && (
          <Card className="mb-8 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-500 p-3 rounded-lg">
                  <i className="fas fa-lock text-white text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 text-lg">Akses Premium Diperlukan</h3>
                  <p className="text-yellow-800">
                    Konselor profesional tersedia untuk pengguna premium. Upgrade untuk mengakses layanan ini.
                  </p>
                </div>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                  <i className="fas fa-crown mr-2"></i>
                  Upgrade Sekarang
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Counselors Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <i className="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Memuat daftar konselor...</p>
          </div>
        ) : counselors?.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-user-md text-gray-400 text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Belum Ada Konselor Tersedia
            </h3>
            <p className="text-gray-600">Konselor sedang tidak tersedia saat ini. Silakan coba lagi nanti.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {counselors?.map((counselor: any) => (
              <Card key={counselor.id} className="hover:shadow-lg transition-all duration-300 group">
                <div className="relative">
                  <img
                    src={counselor.imageUrl}
                    alt={`${counselor.name} - ${counselor.specialization}`}
                    className="w-24 h-24 rounded-full mx-auto mt-6 mb-4 object-cover"
                  />
                </div>
                
                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-xl mb-2">{counselor.name}</CardTitle>
                  <p className="text-teal-600 font-medium mb-2">{counselor.specialization}</p>
                  <p className="text-gray-600 text-sm">{counselor.description}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star text-sm"></i>
                      ))}
                      <span className="ml-1 text-gray-700 font-medium text-sm">
                        {(counselor.rating / 1).toFixed(1)}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm">
                      {counselor.sessionsCount}+ sesi
                    </div>
                    <Badge 
                      className={`text-xs ${
                        counselor.isOnline 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {counselor.isOnline ? "Online" : "Sibuk"}
                    </Badge>
                  </div>
                  
                  <Dialog 
                    open={selectedCounselor?.id === counselor.id} 
                    onOpenChange={(open) => !open && setSelectedCounselor(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setSelectedCounselor(counselor)}
                        disabled={!counselor.isOnline || (!trialActive && !user.isSubscribed)}
                        className={`w-full ${
                          counselor.isOnline && (trialActive || user.isSubscribed)
                            ? "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {!counselor.isOnline ? (
                          "Tidak Tersedia"
                        ) : !trialActive && !user.isSubscribed ? (
                          "Premium Only"
                        ) : (
                          "Pilih Konselor"
                        )}
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Jadwalkan Sesi dengan {selectedCounselor?.name}</DialogTitle>
                      </DialogHeader>
                      
                      <form onSubmit={handleBookSession} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date">Tanggal Sesi</Label>
                            <Input
                              id="date"
                              type="date"
                              value={bookingForm.date}
                              onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <div>
                            <Label htmlFor="time">Waktu Sesi</Label>
                            <Select 
                              value={bookingForm.time} 
                              onValueChange={(value) => setBookingForm({ ...bookingForm, time: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih waktu" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="09:00">09:00 - 10:00</SelectItem>
                                <SelectItem value="10:00">10:00 - 11:00</SelectItem>
                                <SelectItem value="11:00">11:00 - 12:00</SelectItem>
                                <SelectItem value="13:00">13:00 - 14:00</SelectItem>
                                <SelectItem value="14:00">14:00 - 15:00</SelectItem>
                                <SelectItem value="15:00">15:00 - 16:00</SelectItem>
                                <SelectItem value="16:00">16:00 - 17:00</SelectItem>
                                <SelectItem value="19:00">19:00 - 20:00</SelectItem>
                                <SelectItem value="20:00">20:00 - 21:00</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="sessionType">Jenis Sesi</Label>
                          <Select 
                            value={bookingForm.sessionType} 
                            onValueChange={(value) => setBookingForm({ ...bookingForm, sessionType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis sesi" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">Konseling Individual (50 menit)</SelectItem>
                              <SelectItem value="consultation">Konsultasi Singkat (25 menit)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="concerns">Keluhan/Topik yang Ingin Dibahas</Label>
                          <Textarea
                            id="concerns"
                            value={bookingForm.concerns}
                            onChange={(e) => setBookingForm({ ...bookingForm, concerns: e.target.value })}
                            placeholder="Ceritakan singkat tentang apa yang ingin Anda bicarakan dengan konselor..."
                            rows={4}
                            className="resize-none"
                          />
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Informasi Sesi:</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Sesi akan dilakukan melalui video call</li>
                            <li>• Anda akan menerima link meeting 1 jam sebelum sesi</li>
                            <li>• Dapat membatalkan atau reschedule hingga 4 jam sebelum sesi</li>
                            <li>• Semua percakapan bersifat rahasia dan profesional</li>
                          </ul>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setSelectedCounselor(null)}
                            className="flex-1"
                          >
                            Batal
                          </Button>
                          <Button
                            type="submit"
                            disabled={bookSessionMutation.isPending}
                            className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                          >
                            {bookSessionMutation.isPending ? (
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                            ) : (
                              <i className="fas fa-calendar-check mr-2"></i>
                            )}
                            Jadwalkan Sesi
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-teal-100 to-purple-100 border-teal-200">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="bg-teal-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-info-circle text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Mengapa Memilih Konselor Profesional?
                </h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-teal-900 mb-2">🎓 Bersertifikat</h4>
                  <p className="text-sm text-teal-800">
                    Semua konselor telah memiliki sertifikasi profesional dan pengalaman yang terbukti
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-teal-900 mb-2">🔒 Rahasia</h4>
                  <p className="text-sm text-teal-800">
                    Semua sesi bersifat rahasia dan mengikuti kode etik psikolog profesional
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-teal-900 mb-2">💡 Personal</h4>
                  <p className="text-sm text-teal-800">
                    Pendekatan yang disesuaikan dengan kebutuhan dan kondisi unik setiap individu
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
