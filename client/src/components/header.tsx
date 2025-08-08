import { useState } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { getStoredUser, setStoredUser } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState(getStoredUser());

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      return response.json();
    },
    onSuccess: () => {
      setStoredUser(null);
      setUser(null);
      toast({
        title: "Berhasil Logout",
        description: "Sampai jumpa lagi!",
      });
      setLocation("/");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={user ? "/dashboard" : "/"}>
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="bg-gradient-to-r from-teal-500 to-pink-400 rounded-xl p-2">
                <i className="fas fa-heart text-white text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold text-gradient-teal-pink">
                CURHATIN
              </h1>
            </div>
          </Link>
          
          {user ? (
            <nav className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/chat" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                Chat
              </Link>
              <Link href="/journal" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                Jurnal
              </Link>
              <Link href="/education" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                Edukasi
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                Profil
              </Link>
              <Button 
                onClick={handleLogout}
                variant="outline"
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fas fa-sign-out-alt mr-2"></i>
                )}
                Logout
              </Button>
            </nav>
          ) : (
            <nav className="flex items-center space-x-6">
              <a href="#features" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                Fitur
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                Testimoni
              </a>
              <Link href="/login">
                <Button variant="outline" className="text-gray-700 hover:text-teal-600">
                  Masuk
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                  Daftar Gratis
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
