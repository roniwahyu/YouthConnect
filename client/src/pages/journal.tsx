import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/header";
import { getStoredUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Journal() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(getStoredUser());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "",
  });

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  const { data: journalEntries = [], isLoading } = useQuery({
    queryKey: ["/api/journal"],
    enabled: !!user,
    select: (data) => Array.isArray(data) ? data : [],
  });

  const createEntryMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; mood?: string }) => {
      const response = await apiRequest("POST", "/api/journal", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Jurnal Tersimpan",
        description: "Entry jurnal berhasil dibuat!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      setIsCreateOpen(false);
      setFormData({ title: "", content: "", mood: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan jurnal",
        variant: "destructive",
      });
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: async (data: { id: string; title: string; content: string; mood?: string }) => {
      const { id, ...updateData } = data;
      const response = await apiRequest("PUT", `/api/journal/${id}`, updateData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Jurnal Diperbarui",
        description: "Entry jurnal berhasil diperbarui!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      setEditingEntry(null);
      setFormData({ title: "", content: "", mood: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui jurnal",
        variant: "destructive",
      });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/journal/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Jurnal Dihapus",
        description: "Entry jurnal berhasil dihapus!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus jurnal",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Judul dan konten harus diisi!",
        variant: "destructive",
      });
      return;
    }

    if (editingEntry) {
      updateEntryMutation.mutate({
        id: editingEntry.id,
        ...formData,
        mood: formData.mood || undefined,
      });
    } else {
      createEntryMutation.mutate({
        ...formData,
        mood: formData.mood || undefined,
      });
    }
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      content: entry.content,
      mood: entry.mood || "",
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus entry ini?")) {
      deleteEntryMutation.mutate(id);
    }
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis = {
      "very-happy": "😊",
      "happy": "🙂",
      "neutral": "😐",
      "sad": "😔",
      "very-sad": "😢",
    };
    return moodEmojis[mood as keyof typeof moodEmojis] || "📝";
  };

  const getMoodLabel = (mood: string) => {
    const moodLabels = {
      "very-happy": "Sangat Bahagia",
      "happy": "Bahagia",
      "neutral": "Biasa Saja",
      "sad": "Sedih",
      "very-sad": "Sangat Sedih",
    };
    return moodLabels[mood as keyof typeof moodLabels] || "Tidak Ada Mood";
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Jurnal <span className="text-gradient-teal-pink">Digital</span>
            </h1>
            <p className="text-gray-600">
              Tulis perasaan dan refleksi harianmu untuk membantu pemahaman diri
            </p>
          </div>
          
          <Dialog open={isCreateOpen || !!editingEntry} onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditingEntry(null);
              setFormData({ title: "", content: "", mood: "" });
            }
          }}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                <i className="fas fa-plus mr-2"></i>
                Tulis Jurnal Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEntry ? "Edit Entry Jurnal" : "Buat Entry Jurnal Baru"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Judul</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Berikan judul untuk entry ini..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="mood">Mood (Opsional)</Label>
                  <Select value={formData.mood} onValueChange={(value) => setFormData({ ...formData, mood: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih mood hari ini" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very-happy">😊 Sangat Bahagia</SelectItem>
                      <SelectItem value="happy">🙂 Bahagia</SelectItem>
                      <SelectItem value="neutral">😐 Biasa Saja</SelectItem>
                      <SelectItem value="sad">😔 Sedih</SelectItem>
                      <SelectItem value="very-sad">😢 Sangat Sedih</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="content">Konten</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Tulis perasaan, pikiran, atau refleksi harianmu..."
                    rows={10}
                    className="resize-none"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateOpen(false);
                      setEditingEntry(null);
                      setFormData({ title: "", content: "", mood: "" });
                    }}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={createEntryMutation.isPending || updateEntryMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    {createEntryMutation.isPending || updateEntryMutation.isPending ? (
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                    ) : (
                      <i className="fas fa-save mr-2"></i>
                    )}
                    {editingEntry ? "Perbarui" : "Simpan"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Journal Entries */}
        {isLoading ? (
          <div className="text-center py-12">
            <i className="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Memuat jurnal...</p>
          </div>
        ) : journalEntries?.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-book text-orange-500 text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Mulai Jurnal Pertamamu
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Belum ada entry jurnal. Mulai tulis perasaan dan refleksi harianmu untuk membantu memahami diri lebih baik.
            </p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <i className="fas fa-pen mr-2"></i>
              Tulis Entry Pertama
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {journalEntries?.map((entry: any) => (
              <Card key={entry.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{entry.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          <i className="fas fa-calendar mr-1"></i>
                          {new Date(entry.createdAt).toLocaleDateString("id-ID", {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        {entry.mood && (
                          <Badge variant="secondary" className="text-xs">
                            {getMoodEmoji(entry.mood)} {getMoodLabel(entry.mood)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(entry)}
                        className="text-gray-500 hover:text-orange-600"
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                        className="text-gray-500 hover:text-red-600"
                        disabled={deleteEntryMutation.isPending}
                      >
                        {deleteEntryMutation.isPending ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i className="fas fa-trash"></i>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {entry.content.split('\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {entry.updatedAt !== entry.createdAt && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        <i className="fas fa-edit mr-1"></i>
                        Diedit pada {new Date(entry.updatedAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-orange-100 to-yellow-100 border-orange-200">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="bg-orange-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lightbulb text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tips Menulis Jurnal</h3>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-2">📝 Tulis Rutin</h4>
                    <p className="text-sm text-orange-800">Coba tulis setiap hari, meski hanya beberapa kalimat</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-2">💭 Jujur pada Diri</h4>
                    <p className="text-sm text-orange-800">Ekspresikan perasaan tanpa filter, ini space amanmu</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-2">🔍 Refleksi Pola</h4>
                    <p className="text-sm text-orange-800">Baca kembali entry lama untuk melihat perkembanganmu</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
