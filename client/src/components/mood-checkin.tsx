import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface MoodCheckinProps {
  onClose: () => void;
}

export default function MoodCheckin({ onClose }: MoodCheckinProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [note, setNote] = useState("");

  const moods = [
    { value: "very-happy", emoji: "😊", label: "Sangat Bahagia" },
    { value: "happy", emoji: "🙂", label: "Bahagia" },
    { value: "neutral", emoji: "😐", label: "Biasa Saja" },
    { value: "sad", emoji: "😔", label: "Sedih" },
    { value: "very-sad", emoji: "😢", label: "Sangat Sedih" },
  ];

  const saveMoodMutation = useMutation({
    mutationFn: async (data: { mood: string; note?: string }) => {
      const response = await apiRequest("POST", "/api/moods", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Mood Tersimpan",
        description: "Terima kasih sudah berbagi perasaanmu hari ini!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/moods"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan mood",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      toast({
        title: "Error",
        description: "Pilih mood terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    saveMoodMutation.mutate({ mood: selectedMood, note: note || undefined });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Bagaimana perasaanmu hari ini?</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-5 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-4 rounded-lg text-center transition-all ${
                    selectedMood === mood.value
                      ? "bg-teal-100 border-2 border-teal-500"
                      : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs font-medium text-gray-700">{mood.label}</div>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ceritakan sedikit (opsional)
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Apa yang membuatmu merasakan mood ini?"
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Batal
              </Button>
              <Button
                type="submit"
                disabled={saveMoodMutation.isPending || !selectedMood}
                className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
              >
                {saveMoodMutation.isPending ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fas fa-heart mr-2"></i>
                )}
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
