import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function LandingHero() {
  return (
    <section className="relative pt-16 pb-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-100/50 to-pink-100/50"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-teal-200/30 rounded-full -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200/30 rounded-full translate-x-48 translate-y-48"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <i className="fas fa-star text-yellow-500 mr-2"></i>
              Gratis 7 hari untuk pengguna baru
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Platform <span className="text-gradient-teal-pink">Konseling</span><br/>
              Kesehatan Mental untuk <span className="text-gradient-teal-pink">Remaja</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Dapatkan dukungan emosional yang kamu butuhkan dengan AI counselor, konselor profesional, 
              dan komunitas yang peduli. Aman, anonim, dan mudah diakses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/login">
                <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-lg px-8 py-4">
                  <i className="fas fa-play mr-2"></i>
                  Mulai Konseling Gratis
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-2 border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-600 text-lg px-8 py-4"
              >
                <i className="fas fa-video mr-2"></i>
                Lihat Demo
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <i className="fas fa-shield-alt text-teal-500 mr-2"></i>
                100% Anonim
              </div>
              <div className="flex items-center">
                <i className="fas fa-clock text-teal-500 mr-2"></i>
                24/7 Tersedia
              </div>
              <div className="flex items-center">
                <i className="fas fa-heart text-pink-500 mr-2"></i>
                Gratis 7 Hari
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Young person in counseling session" 
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
            
            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <i className="fas fa-comments text-teal-600"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">AI Counselor</p>
                  <p className="text-xs text-gray-500">Siap membantu 24/7</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-pink-100 p-2 rounded-lg">
                  <i className="fas fa-user-md text-pink-600"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Konselor Profesional</p>
                  <p className="text-xs text-gray-500">Tersedia untuk sesi mendalam</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
