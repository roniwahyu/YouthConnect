import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/header";
import { getStoredUser, setStoredUser, isTrialActive, getTrialDaysLeft } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState(getStoredUser());
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

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
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal logout",
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      // In a real app, this would update user profile via API
      return new Promise((resolve) => {
        setTimeout(() => resolve({ ...user, ...data }), 1000);
      });
    },
    onSuccess: (updatedUser: any) => {
      setStoredUser(updatedUser);
      setUser(updatedUser);
      setIsEditingProfile(false);
      toast({
        title: "Profil Diperbarui",
        description: "Informasi profil berhasil disimpan!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui profil",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      // In a real app, this would change password via API
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (data.currentPassword === "wrongpassword") {
            reject(new Error("Password saat ini salah"));
          } else {
            resolve(true);
          }
        }, 1000);
      });
    },
    onSuccess: () => {
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Password Diubah",
        description: "Password berhasil diubah!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal mengubah password",
        variant: "destructive",
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      // In a real app, this would delete account via API
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000);
      });
    },
    onSuccess: () => {
      setStoredUser(null);
      setUser(null);
      toast({
        title: "Akun Dihapus",
        description: "Akun Anda telah dihapus. Terima kasih telah menggunakan CURHATIN.",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus akun",
        variant: "destructive",
      });
    },
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      toast({
        title: "Error",
        description: "Nama dan email harus diisi!",
        variant: "destructive",
      });
      return;
    }
    updateProfileMutation.mutate(profileForm);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Semua field password harus diisi!",
        variant: "destructive",
      });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Konfirmasi password tidak cocok!",
        variant: "destructive",
      });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password baru minimal 6 karakter!",
        variant: "destructive",
      });
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.")) {
      deleteAccountMutation.mutate();
    }
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      logoutMutation.mutate();
    }
  };

  if (!user) return null;

  const trialActive = isTrialActive(user);
  const daysLeft = getTrialDaysLeft(user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-pink-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Saya</h1>
          <p className="text-gray-600">Kelola informasi akun dan pengaturan Anda</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Informasi Profil</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditingProfile(true);
                    setProfileForm({ name: user.name, email: user.email });
                  }}
                >
                  <i className="fas fa-edit mr-2"></i>
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Nama Lengkap</Label>
                    <p className="text-lg font-medium text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-lg font-medium text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Bergabung Sejak</Label>
                    <p className="text-lg font-medium text-gray-900">
                      {new Date(user.registeredAt).toLocaleDateString("id-ID", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle>Ubah Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Password Saat Ini</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Password Baru</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    {changePasswordMutation.isPending ? (
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                    ) : (
                      <i className="fas fa-key mr-2"></i>
                    )}
                    Ubah Password
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Zona Berbahaya</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Hapus Akun</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Menghapus akun akan menghilangkan semua data Anda secara permanen. 
                      Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <Button
                      onClick={handleDeleteAccount}
                      disabled={deleteAccountMutation.isPending}
                      variant="destructive"
                    >
                      {deleteAccountMutation.isPending ? (
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                      ) : (
                        <i className="fas fa-trash mr-2"></i>
                      )}
                      Hapus Akun
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status Langganan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.isSubscribed ? (
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <i className="fas fa-crown mr-1"></i>
                      Premium Active
                    </Badge>
                  ) : trialActive ? (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                      <i className="fas fa-clock mr-1"></i>
                      Trial ({daysLeft} hari tersisa)
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                      <i className="fas fa-times mr-1"></i>
                      Trial Berakhir
                    </Badge>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    {user.isSubscribed ? (
                      <p>Anda memiliki akses penuh ke semua fitur CURHATIN.</p>
                    ) : trialActive ? (
                      <p>Nikmati semua fitur premium selama masa trial Anda.</p>
                    ) : (
                      <p>Trial telah berakhir. Upgrade untuk akses penuh.</p>
                    )}
                  </div>
                  
                  {!user.isSubscribed && (
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700">
                      <i className="fas fa-crown mr-2"></i>
                      Upgrade ke Premium
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Aktivitas Anda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chat Sessions</span>
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Journal Entries</span>
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mood Records</span>
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Achievements</span>
                    <span className="font-medium">-</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                variant="outline" 
                className="w-full"
              >
                {logoutMutation.isPending ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fas fa-sign-out-alt mr-2"></i>
                )}
                Logout
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profil</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <Label htmlFor="editName">Nama Lengkap</Label>
              <Input
                id="editName"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditingProfile(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
              >
                {updateProfileMutation.isPending ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fas fa-save mr-2"></i>
                )}
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
