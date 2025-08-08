import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/header";
import { getStoredUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function SRQ29() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(getStoredUser());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>(new Array(29).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  const { data: previousAssessments = [] } = useQuery({
    queryKey: ["/api/srq29"],
    enabled: !!user,
    select: (data) => Array.isArray(data) ? data : [],
  });

  const submitAssessmentMutation = useMutation({
    mutationFn: async (answers: boolean[]) => {
      const response = await apiRequest("POST", "/api/srq29", { answers });
      return response.json();
    },
    onSuccess: (data) => {
      setTestResult(data);
      setShowResult(true);
      toast({
        title: "Tes Selesai",
        description: "Hasil tes SRQ-29 berhasil disimpan!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/srq29"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan hasil tes",
        variant: "destructive",
      });
    },
  });

  const questions = [
    "Apakah Anda sering merasa sakit kepala?",
    "Apakah nafsu makan Anda berkurang?",
    "Apakah tidur Anda tidak nyenyak?",
    "Apakah Anda mudah takut?",
    "Apakah tangan Anda gemetar?",
    "Apakah Anda merasa tegang, cemas atau khawatir?",
    "Apakah pencernaan Anda terganggu?",
    "Apakah Anda sulit berpikir jernih?",
    "Apakah Anda merasa tidak bahagia?",
    "Apakah Anda lebih sering menangis?",
    "Apakah Anda sulit menikmati kegiatan sehari-hari?",
    "Apakah Anda sulit mengambil keputusan?",
    "Apakah pekerjaan sehari-hari Anda terganggu?",
    "Apakah Anda tidak mampu berperan serta dalam hidup?",
    "Apakah Anda kehilangan minat terhadap berbagai hal?",
    "Apakah Anda merasa tidak berguna?",
    "Apakah Anda mempunyai pikiran untuk mengakhiri hidup?",
    "Apakah Anda merasa lelah sepanjang waktu?",
    "Apakah perut Anda terasa tidak enak?",
    "Apakah Anda mudah lelah?",
    "Apakah Anda adalah orang yang mudah panik?",
    "Apakah Anda merasa tegang sepanjang waktu?",
    "Apakah Anda merasa khawatir berlebihan tentang sesuatu?",
    "Apakah Anda kurang tertarik pada berbagai hal?",
    "Apakah Anda merasa putus asa?",
    "Apakah Anda merasa sulit berkonsentrasi?",
    "Apakah aktivitas sehari-hari Anda berkurang?",
    "Apakah Anda kehilangan kemampuan untuk berpikir?",
    "Apakah masa depan Anda terasa suram dan tanpa harapan?"
  ];

  const handleAnswerChange = (questionIndex: number, answer: boolean) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestion] === null) {
      toast({
        title: "Jawaban Diperlukan",
        description: "Silakan pilih jawaban untuk melanjutkan",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (answers.some(answer => answer === null)) {
      toast({
        title: "Tes Belum Lengkap",
        description: "Mohon jawab semua pertanyaan sebelum mengirim",
        variant: "destructive",
      });
      return;
    }

    submitAssessmentMutation.mutate(answers);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(29).fill(null));
    setShowResult(false);
    setTestResult(null);
  };

  const getScoreInterpretation = (score: number) => {
    if (score <= 5) {
      return {
        level: "Rendah",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    } else if (score <= 12) {
      return {
        level: "Sedang",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    } else if (score <= 20) {
      return {
        level: "Tinggi",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      };
    } else {
      return {
        level: "Sangat Tinggi",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    }
  };

  if (!user) return null;

  if (showResult && testResult) {
    const interpretation = getScoreInterpretation(testResult.score);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-pink-50">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-chart-bar text-blue-500 text-3xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hasil Tes SRQ-29</h1>
            <p className="text-gray-600">Berikut hasil asesmen kesehatan mental Anda</p>
          </div>

          <Card className={`${interpretation.bgColor} ${interpretation.borderColor} border-2`}>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold mb-2">
                  <span className={interpretation.color}>{testResult.score}</span>
                  <span className="text-gray-400 text-3xl">/29</span>
                </div>
                <div className={`inline-block px-4 py-2 rounded-full ${interpretation.bgColor} border ${interpretation.borderColor}`}>
                  <span className={`font-semibold ${interpretation.color}`}>
                    Tingkat Stres: {interpretation.level}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Interpretasi Hasil:</h3>
                <p className="text-gray-700 leading-relaxed">{testResult.interpretation}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={resetTest}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Tes Ulang
                </Button>
                <Button
                  onClick={() => setLocation("/chat")}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                >
                  <i className="fas fa-comments mr-2"></i>
                  Konsultasi AI
                </Button>
                <Button
                  onClick={() => setLocation("/counselors")}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                >
                  <i className="fas fa-user-md mr-2"></i>
                  Konselor Profesional
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Previous Results */}
          {previousAssessments && previousAssessments.length > 1 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Riwayat Tes Sebelumnya</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {previousAssessments.slice(1, 6).map((assessment: any, index: number) => {
                    const prevInterpretation = getScoreInterpretation(assessment.score);
                    return (
                      <div key={assessment.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">
                            {new Date(assessment.createdAt).toLocaleDateString("id-ID", {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold text-gray-900">{assessment.score}</span>
                          <span className={`px-2 py-1 rounded text-sm font-medium ${prevInterpretation.color} ${prevInterpretation.bgColor}`}>
                            {prevInterpretation.level}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-pink-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentQuestion === 0 && (
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-clipboard-check text-blue-500 text-3xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Tes Kesehatan Mental <span className="text-gradient-teal-pink">SRQ-29</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Self Reporting Questionnaire (SRQ-29) adalah asesmen standar WHO untuk mengevaluasi 
              tingkat stres dan masalah kesehatan mental. Jawab setiap pertanyaan dengan jujur 
              berdasarkan kondisi Anda dalam 30 hari terakhir.
            </p>
            
            <Card className="bg-blue-50 border-blue-200 max-w-2xl mx-auto">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Petunjuk Pengisian:</h3>
                <ul className="text-left text-blue-800 space-y-2">
                  <li>• Jawab "Ya" jika gejala tersebut sering Anda alami</li>
                  <li>• Jawab "Tidak" jika gejala tersebut jarang atau tidak pernah Anda alami</li>
                  <li>• Pertimbangkan kondisi Anda dalam 30 hari terakhir</li>
                  <li>• Jawab semua pertanyaan untuk hasil yang akurat</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Pertanyaan {currentQuestion + 1} dari {questions.length}
              </CardTitle>
              <div className="text-sm text-gray-500">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% selesai
              </div>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mt-2" />
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-900 mb-6 leading-relaxed">
                {questions[currentQuestion]}
              </h2>
              
              <RadioGroup
                value={answers[currentQuestion]?.toString()}
                onValueChange={(value) => handleAnswerChange(currentQuestion, value === "true")}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-transparent hover:border-green-200 hover:bg-green-50 transition-all">
                  <RadioGroupItem value="false" id="no" />
                  <Label htmlFor="no" className="flex-1 cursor-pointer text-lg">
                    <span className="font-medium text-green-700">Tidak</span>
                    <span className="block text-sm text-gray-600 mt-1">
                      Jarang atau tidak pernah mengalami gejala ini
                    </span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-transparent hover:border-red-200 hover:bg-red-50 transition-all">
                  <RadioGroupItem value="true" id="yes" />
                  <Label htmlFor="yes" className="flex-1 cursor-pointer text-lg">
                    <span className="font-medium text-red-700">Ya</span>
                    <span className="block text-sm text-gray-600 mt-1">
                      Sering mengalami gejala ini dalam 30 hari terakhir
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex justify-between">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
                className="flex items-center"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Sebelumnya
              </Button>
              
              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={submitAssessmentMutation.isPending}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  {submitAssessmentMutation.isPending ? (
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-check mr-2"></i>
                  )}
                  Selesai & Lihat Hasil
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  Selanjutnya
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Progres: {answers.filter(answer => answer !== null).length} dari {questions.length} dijawab</span>
              <span>Estimasi waktu: {Math.max(1, questions.length - currentQuestion)} menit tersisa</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
