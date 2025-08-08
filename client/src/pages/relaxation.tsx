import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import Header from "@/components/header";
import { getStoredUser } from "@/lib/auth";

export default function Relaxation() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(getStoredUser());
  const [activeCategory, setActiveCategory] = useState("meditation");
  const [currentAudio, setCurrentAudio] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([0.7]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  const categories = [
    { id: "meditation", label: "Meditasi Terpandu", icon: "fas fa-lotus" },
    { id: "nature", label: "Suara Alam", icon: "fas fa-leaf" },
    { id: "music", label: "Musik Relaksasi", icon: "fas fa-music" },
    { id: "breathing", label: "Latihan Pernapasan", icon: "fas fa-wind" },
  ];

  const audioContent = {
    meditation: [
      {
        id: 1,
        title: "Meditasi Pernapasan Dasar",
        duration: "10 menit",
        description: "Meditasi sederhana fokus pada pernapasan untuk pemula",
        instructor: "Guided by AI",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
      },
      {
        id: 2,
        title: "Body Scan Relaxation",
        duration: "15 menit",
        description: "Relaksasi dengan scanning seluruh tubuh dari kepala hingga kaki",
        instructor: "Guided by AI",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
      },
      {
        id: 3,
        title: "Meditasi Mindfulness",
        duration: "20 menit",
        description: "Latihan kesadaran penuh untuk mengurangi stres dan anxiety",
        instructor: "Guided by AI",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
      },
    ],
    nature: [
      {
        id: 4,
        title: "Suara Hujan di Hutan",
        duration: "30 menit",
        description: "Suara hujan lembut di tengah hutan yang menenangkan",
        type: "Loop",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
      },
      {
        id: 5,
        title: "Ombak Laut Tenang",
        duration: "45 menit",
        description: "Suara deburan ombak di pantai yang damai",
        type: "Loop",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
      },
      {
        id: 6,
        title: "Kicau Burung Pagi",
        duration: "25 menit",
        description: "Suara kicauan burung di pagi yang segar",
        type: "Loop",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
      },
    ],
    music: [
      {
        id: 7,
        title: "Piano Klasik Relaksasi",
        duration: "35 menit",
        description: "Musik piano klasik yang menenangkan jiwa",
        composer: "Various Artists",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
      },
      {
        id: 8,
        title: "Ambient Spa Music",
        duration: "40 menit",
        description: "Musik ambient yang cocok untuk spa dan relaksasi",
        composer: "Relaxation Studio",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
      },
    ],
    breathing: [
      {
        id: 9,
        title: "Teknik 4-7-8",
        duration: "5 menit",
        description: "Teknik pernapasan untuk mengurangi kecemasan dengan pola 4-7-8",
        technique: "Guided Exercise",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
      },
      {
        id: 10,
        title: "Box Breathing",
        duration: "8 menit",
        description: "Latihan pernapasan kotak untuk fokus dan ketenangan",
        technique: "Guided Exercise",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
      },
    ],
  };

  const handlePlayPause = (audio: any) => {
    if (currentAudio?.id === audio.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentAudio(audio);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = audio.audioUrl;
        audioRef.current.play();
      }
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0];
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentAudio]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline" className="text-gray-600 hover:text-teal-600">
              <i className="fas fa-arrow-left mr-2"></i>
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl p-8 mb-8">
            <div className="bg-green-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-leaf text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tools <span className="text-gradient-teal-pink">Relaksasi</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tenangkan pikiran dan tubuh dengan berbagai teknik relaksasi, meditasi terpandu, dan suara alam
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                  : ""
              }`}
            >
              <i className={`${category.icon} mr-2`}></i>
              {category.label}
            </Button>
          ))}
        </div>

        {/* Audio Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {audioContent[activeCategory as keyof typeof audioContent]?.map((audio) => (
            <Card key={audio.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight">{audio.title}</CardTitle>
                  <Badge variant="secondary" className="ml-2 shrink-0">
                    {audio.duration}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{audio.description}</p>
                
                {/* Additional Info */}
                <div className="mb-4">
                  {'instructor' in audio && audio.instructor && (
                    <p className="text-xs text-gray-500">Instruktur: {audio.instructor}</p>
                  )}
                  {'type' in audio && audio.type && (
                    <p className="text-xs text-gray-500">Tipe: {audio.type}</p>
                  )}
                  {'composer' in audio && audio.composer && (
                    <p className="text-xs text-gray-500">Komposer: {audio.composer}</p>
                  )}
                  {'technique' in audio && audio.technique && (
                    <p className="text-xs text-gray-500">Teknik: {audio.technique}</p>
                  )}
                </div>
                
                <Button
                  onClick={() => handlePlayPause(audio)}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                >
                  {currentAudio?.id === audio.id && isPlaying ? (
                    <>
                      <i className="fas fa-pause mr-2"></i>
                      Jeda
                    </>
                  ) : (
                    <>
                      <i className="fas fa-play mr-2"></i>
                      Putar
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Audio Player */}
        {currentAudio && (
          <Card className="bg-white shadow-lg sticky bottom-4 z-10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => handlePlayPause(currentAudio)}
                  variant="outline"
                  size="lg"
                  className="shrink-0"
                >
                  {isPlaying ? (
                    <i className="fas fa-pause text-xl"></i>
                  ) : (
                    <i className="fas fa-play text-xl"></i>
                  )}
                </Button>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{currentAudio.title}</h4>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-sm text-gray-500">{formatTime(currentTime)}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-300"
                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">{formatTime(duration)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 shrink-0">
                  <i className="fas fa-volume-down text-gray-400"></i>
                  <div className="w-20">
                    <Slider
                      value={volume}
                      onValueChange={handleVolumeChange}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <i className="fas fa-volume-up text-gray-400"></i>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips Section */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-green-100 to-teal-100 border-green-200">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="bg-green-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lightbulb text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tips Maksimalkan Relaksasi</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">🎧 Gunakan Headphone</h4>
                  <p className="text-sm text-green-800">Untuk pengalaman audio yang lebih immersive</p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">🌙 Waktu Tepat</h4>
                  <p className="text-sm text-green-800">Coba sebelum tidur atau saat merasa stres</p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">🧘 Posisi Nyaman</h4>
                  <p className="text-sm text-green-800">Duduk atau berbaring dalam posisi yang nyaman</p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">📵 Gangguan Minimal</h4>
                  <p className="text-sm text-green-800">Matikan notifikasi dan cari tempat yang tenang</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />
    </div>
  );
}
