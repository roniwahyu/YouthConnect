import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { setStoredUser } from "@/lib/auth";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      setStoredUser(data.user);
      toast({
        title: "Berhasil Login",
        description: `Selamat datang kembali, ${data.user.name}!`,
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Login gagal",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; name: string }) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      setStoredUser(data.user);
      toast({
        title: "Berhasil Daftar",
        description: `Selamat datang, ${data.user.name}! Anda mendapat 7 hari gratis.`,
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Registrasi gagal",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast({
          title: "Error",
          description: "Email dan password harus diisi!",
          variant: "destructive",
        });
        return;
      }
      loginMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    } else {
      if (!formData.email || !formData.password || !formData.name || !formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Semua field harus diisi!",
          variant: "destructive",
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Konfirmasi password tidak cocok!",
          variant: "destructive",
        });
        return;
      }
      registerMutation.mutate({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-pink-400 rounded-xl p-3">
              <i className="fas fa-heart text-white text-2xl"></i>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            <span className="text-gradient-teal-pink">CURHATIN</span>
          </CardTitle>
          <p className="text-center text-muted-foreground">
            {isLogin ? "Masuk ke akun Anda" : "Daftar gratis dan dapatkan 7 hari trial"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Masukkan email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Masukkan password"
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Konfirmasi password"
                />
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
              disabled={loginMutation.isPending || registerMutation.isPending}
            >
              {loginMutation.isPending || registerMutation.isPending ? (
                <i className="fas fa-spinner fa-spin mr-2"></i>
              ) : (
                <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'} mr-2`}></i>
              )}
              {isLogin ? "Masuk" : "Daftar Gratis"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-teal-600 hover:text-teal-700 transition-colors"
            >
              {isLogin ? "Belum punya akun? Daftar di sini" : "Sudah punya akun? Masuk di sini"}
            </button>
          </div>

          {!isLogin && (
            <div className="mt-4 p-3 bg-teal-50 rounded-lg">
              <div className="flex items-center text-sm text-teal-700">
                <i className="fas fa-gift mr-2"></i>
                <span>Gratis 7 hari trial untuk pengguna baru!</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
