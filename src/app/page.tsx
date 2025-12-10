import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CertificationsCarousel from '@/components/CertificationsCarousel';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-400/10 animate-pulse-slow"></div>
          
          {/* Decorative blurred circles */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float-delayed"></div>
          
          <div className="container mx-auto text-center px-4 relative z-10">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-12 shadow-2xl max-w-4xl mx-auto">
              <br />
              <br />
              <br />
              <br />
              <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent animate-fade-in-up">
                Equinox Logistica y Transporte
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-gray-300 animate-fade-in-up-delay">
                Soluciones de transporte confiables, eficientes y seguras para su negocio
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Nuestros Servicios
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Service Card 1 */}
              <div className="group backdrop-blur-lg bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-yellow-400">Transporte de Carga</h3>
                <p className="text-gray-300">Transporte eficiente y seguro de carga en todo el país con seguimiento en tiempo real.</p>
              </div>

              {/* Service Card 2 */}
              <div className="group backdrop-blur-lg bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-yellow-400">Entrega Exprés</h3>
                <p className="text-gray-300">Servicios rápidos y confiables de entrega exprés para envíos urgentes las 24 horas.</p>
              </div>

              {/* Service Card 3 */}
              <div className="group backdrop-blur-lg bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-yellow-400">Almacenamiento</h3>
                <p className="text-gray-300">Soluciones seguras de almacenamiento con tecnología de punta para proteger sus mercancías.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-12 hover:bg-white/10 transition-all duration-500">
              <h2 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                Acerca de Equinox
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed text-center">
                Equinox Transportation se compromete a proporcionar servicios de logística y transporte de primera clase.
                Con años de experiencia en la industria, garantizamos que sus mercancías lleguen a su destino de manera segura y a tiempo.
                Nuestra flota moderna y nuestro equipo altamente capacitado están listos para superar sus expectativas.
              </p>
            </div>
          </div>
        </section>

        {/* Certifications Carousel Section */}
        <CertificationsCarousel />

        {/* Contact Section */}
        <section id="contact" className="py-24 relative">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Contáctenos
            </h2>
            <p className="text-xl mb-12 text-gray-300 max-w-2xl mx-auto">
              ¿Listo para transformar su logística? Póngase en contacto con nosotros hoy y descubra cómo podemos ayudarle.
            </p>
            <button className="group relative px-12 py-5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg rounded-full overflow-hidden shadow-xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105">
              <span className="relative z-10">Contactar Ahora</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="absolute inset-0 translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700"></div>
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
