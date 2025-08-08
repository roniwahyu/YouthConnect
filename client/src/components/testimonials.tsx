export default function Testimonials() {
  const testimonials = [
    {
      name: "Maya S.",
      role: "Siswa SMA, 17 tahun",
      content: "CURHATIN benar-benar membantu saya melewati masa sulit di sekolah. AI chatnya sangat memahami dan konselor profesionalnya juga luar biasa.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "Ardi P.",
      role: "Mahasiswa, 19 tahun", 
      content: "Fitur mood tracking sangat membantu saya memahami pola emosi. Sekarang saya lebih aware dengan kesehatan mental saya.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "Sari L.",
      role: "Siswa SMK, 16 tahun",
      content: "Gratis 7 hari trial sangat membantu! Saya bisa merasakan manfaatnya sebelum memutuskan untuk berlangganan.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-teal-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Apa Kata <span className="text-gradient-teal-pink">Pengguna</span> Kami?
          </h2>
          <p className="text-xl text-gray-600">Ribuan remaja telah merasakan manfaat CURHATIN</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
