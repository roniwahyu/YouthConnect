import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { getStoredUser } from "@/lib/auth";

export default function Education() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(getStoredUser());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  if (!user) {
    setLocation("/login");
    return null;
  }

  const categories = [
    { id: "all", label: "Semua" },
    { id: "anxiety", label: "Kecemasan" },
    { id: "depression", label: "Depresi" },
    { id: "stress", label: "Stres" },
    { id: "relationships", label: "Hubungan" },
    { id: "self-esteem", label: "Kepercayaan Diri" },
  ];

  const articles = [
    {
      id: 1,
      title: "Mengatasi Kecemasan di Usia Remaja",
      description: "Pelajari cara mengenali dan mengatasi gejala kecemasan yang umum dialami remaja, termasuk teknik pernapasan dan mindfulness.",
      category: "anxiety",
      readTime: "5 menit",
      image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      videoUrl: "https://www.youtube.com/embed/YQpVIDdNCqM",
      tags: ["Kecemasan", "Teknik Pernapasan", "Mindfulness"]
    },
    {
      id: 2,
      title: "Membangun Kepercayaan Diri yang Sehat",
      description: "Cara praktis untuk meningkatkan self-esteem dan membangun kepercayaan diri yang positif dalam kehidupan sehari-hari.",
      category: "self-esteem",
      readTime: "7 menit",
      image: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      videoUrl: "https://www.youtube.com/embed/w-HYZv6HzAs",
      tags: ["Self-Esteem", "Kepercayaan Diri", "Motivasi"]
    },
    {
      id: 3,
      title: "Mengelola Stres Akademik",
      description: "Strategi efektif untuk menghadapi tekanan akademik, mengatur waktu belajar, dan menjaga keseimbangan hidup.",
      category: "stress",
      readTime: "6 menit",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      videoUrl: "https://www.youtube.com/embed/hnpQrMqDoqE",
      tags: ["Stres", "Akademik", "Time Management"]
    },
    {
      id: 4,
      title: "Memahami dan Mengatasi Depresi Remaja",
      description: "Panduan komprehensif tentang gejala depresi pada remaja dan langkah-langkah untuk mendapatkan bantuan profesional.",
      category: "depression",
      readTime: "8 menit",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      videoUrl: "https://www.youtube.com/embed/z-IR48Mb3W0",
      tags: ["Depresi", "Mental Health", "Bantuan Profesional"]
    },
    {
      id: 5,
      title: "Membangun Hubungan yang Sehat dengan Teman Sebaya",
      description: "Tips untuk menjalin pertemanan yang positif, mengatasi konflik, dan mempertahankan hubungan yang mendukung.",
      category: "relationships",
      readTime: "5 menit",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      videoUrl: "https://www.youtube.com/embed/1Evwgu369Jw",
      tags: ["Pertemanan", "Komunikasi", "Hubungan Sosial"]
    },
    {
      id: 6,
      title: "Teknik Mindfulness untuk Remaja",
      description: "Pengantar praktis tentang mindfulness dan meditasi yang dapat membantu remaja mengelola emosi dan stress.",
      category: "stress",
      readTime: "6 menit",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      videoUrl: "https://www.youtube.com/embed/ZToicYcHIOU",
      tags: ["Mindfulness", "Meditasi", "Relaksasi"]
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-2xl p-8 mb-8">
            <div className="bg-purple-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-graduation-cap text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pusat <span className="text-gradient-teal-pink">Edukasi</span> Kesehatan Mental
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pelajari lebih dalam tentang kesehatan mental melalui artikel dan video edukatif yang telah dikurasi khusus untuk remaja
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <Input
                type="text"
                placeholder="Cari artikel atau topik..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    : ""
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-search text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak ada artikel yang ditemukan
            </h3>
            <p className="text-gray-600">
              Coba ubah kata kunci pencarian atau pilih kategori yang berbeda
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                      <i className="fas fa-clock mr-1 text-xs"></i>
                      {article.readTime}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                      onClick={() => {
                        // In a real app, this would navigate to article detail page
                        window.open(article.videoUrl, '_blank');
                      }}
                    >
                      <i className="fas fa-play mr-2"></i>
                      Tonton Video
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // Simulate article reading
                        alert(`Membaca artikel: ${article.title}`);
                      }}
                    >
                      <i className="fas fa-book-open mr-2"></i>
                      Baca Artikel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-teal-100 to-pink-100 border-teal-200">
            <CardContent className="p-8">
              <div className="bg-teal-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-lightbulb text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Butuh Panduan Lebih Personal?
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Jika kamu memiliki pertanyaan spesifik atau butuh dukungan lebih mendalam, 
                jangan ragu untuk berkonsultasi dengan AI counselor atau konselor profesional kami.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setLocation("/chat")}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                >
                  <i className="fas fa-robot mr-2"></i>
                  Chat dengan AI
                </Button>
                <Button
                  onClick={() => setLocation("/counselors")}
                  variant="outline"
                  className="border-teal-300 text-teal-700 hover:bg-teal-50"
                >
                  <i className="fas fa-user-md mr-2"></i>
                  Konselor Profesional
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
