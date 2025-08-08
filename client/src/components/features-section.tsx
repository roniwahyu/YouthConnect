import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function FeaturesSection() {
  const features = [
    {
      title: "AI Chat Counseling",
      description: "Konseling 24/7 dengan AI yang memahami emosi remaja. Dapatkan dukungan instan kapan saja.",
      icon: "fas fa-robot",
      color: "teal",
      href: "/login"
    },
    {
      title: "Mood Tracking",
      description: "Pantau perubahan suasana hati harian dengan visualisasi yang mudah dipahami.",
      icon: "fas fa-heart",
      color: "pink",
      href: "/login"
    },
    {
      title: "Konselor Profesional", 
      description: "Akses ke psikolog dan konselor bersertifikat untuk sesi konseling mendalam.",
      icon: "fas fa-user-md",
      color: "purple",
      href: "/counselors"
    },
    {
      title: "Digital Journal",
      description: "Tulis perasaan dan pikiran dalam jurnal digital yang aman dan privat.",
      icon: "fas fa-book",
      color: "orange",
      href: "/journal"
    },
    {
      title: "Tes SRQ-29",
      description: "Asesmen kesehatan mental standar WHO untuk evaluasi kondisi psikologis.",
      icon: "fas fa-clipboard-check", 
      color: "blue",
      href: "/srq29"
    },
    {
      title: "Tools Relaksasi",
      description: "Meditasi terpandu, musik relaksasi, dan teknik pernapasan untuk menenangkan pikiran.",
      icon: "fas fa-leaf",
      color: "green",
      href: "/relaxation"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      teal: "from-teal-50 to-teal-100 bg-teal-500 text-teal-600 hover:text-teal-700",
      pink: "from-pink-50 to-pink-100 bg-pink-500 text-pink-600 hover:text-pink-700", 
      purple: "from-purple-50 to-purple-100 bg-purple-500 text-purple-600 hover:text-purple-700",
      orange: "from-orange-50 to-orange-100 bg-orange-500 text-orange-600 hover:text-orange-700",
      blue: "from-blue-50 to-blue-100 bg-blue-500 text-blue-600 hover:text-blue-700",
      green: "from-green-50 to-green-100 bg-green-500 text-green-600 hover:text-green-700"
    };
    return colors[color as keyof typeof colors] || colors.teal;
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Fitur Lengkap untuk <span className="text-gradient-teal-pink">Kesehatan Mental</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dapatkan akses ke berbagai tools dan fitur yang dirancang khusus untuk mendukung kesehatan mental remaja
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colorClasses = getColorClasses(feature.color);
            const [gradientClasses, bgClass, textClass] = colorClasses.split(' ');
            
            return (
              <div key={index} className={`bg-gradient-to-br ${gradientClasses} p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group`}>
                <div className={`${bgClass} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <i className={`${feature.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <Link href={feature.href}>
                  <button className={`${textClass} font-semibold transition-colors`}>
                    Coba Sekarang <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
