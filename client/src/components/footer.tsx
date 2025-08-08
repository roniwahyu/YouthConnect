import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-teal-500 to-pink-400 rounded-xl p-2">
                <i className="fas fa-heart text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-white">CURHATIN</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Platform konseling kesehatan mental terpercaya untuk remaja Indonesia. 
              Aman, anonim, dan mudah diakses kapan saja.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                <i className="fab fa-tiktok text-xl"></i>
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                <i className="fab fa-youtube text-xl"></i>
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Fitur</h4>
            <ul className="space-y-2">
              <li><Link href="/login" className="hover:text-teal-400 transition-colors">AI Chat Counseling</Link></li>
              <li><Link href="/counselors" className="hover:text-teal-400 transition-colors">Konselor Profesional</Link></li>
              <li><Link href="/dashboard" className="hover:text-teal-400 transition-colors">Mood Tracking</Link></li>
              <li><Link href="/journal" className="hover:text-teal-400 transition-colors">Digital Journal</Link></li>
              <li><Link href="/srq29" className="hover:text-teal-400 transition-colors">Tes SRQ-29</Link></li>
              <li><Link href="/relaxation" className="hover:text-teal-400 transition-colors">Tools Relaksasi</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Dukungan</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-teal-400 transition-colors">Pusat Bantuan</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">FAQ</a></li>
              <li className="pt-2">
                <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm">
                  <strong>Darurat:</strong> 119 atau 021-7256526
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 CURHATIN. Semua hak dilindungi undang-undang.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Powered by AI & Professional Care</span>
            <div className="flex items-center space-x-2">
              <i className="fas fa-shield-alt text-green-500"></i>
              <span className="text-green-500 text-sm font-medium">SSL Secured</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
