import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section id="home" className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-20">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-5xl font-bold mb-4">Bienvenido a Equinox Transportation</h1>
            <p className="text-xl mb-8">Soluciones de transporte confiables, eficientes y seguras para su negocio.</p>
            <Image
              src="/logo-equinox-animacion.jpg"
              alt="Logo Equinox con Slogan y Animación"
              width={300}
              height={200}
              className="mx-auto mb-8"
            />
            <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition duration-300">
              Comenzar
            </button>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">Nuestros Servicios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-2xl font-semibold mb-4 text-yellow-500">Transporte de Carga</h3>
                <p className="text-gray-600">Transporte eficiente y seguro de carga en todo el país.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-2xl font-semibold mb-4 text-yellow-500">Entrega Exprés</h3>
                <p className="text-gray-600">Servicios rápidos y confiables de entrega exprés para envíos urgentes.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-2xl font-semibold mb-4 text-yellow-500">Almacenamiento</h3>
                <p className="text-gray-600">Soluciones seguras de almacenamiento para guardar sus mercancías de manera segura.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8 text-yellow-400">Acerca de Equinox</h2>
            <p className="text-xl max-w-3xl mx-auto">
              Equinox Transportation se compromete a proporcionar servicios de logística y transporte de primera clase.
              Con años de experiencia en la industria, garantizamos que sus mercancías lleguen a su destino de manera segura y a tiempo.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8 text-black">Contáctenos</h2>
            <p className="text-xl mb-8 text-gray-600">¿Listo para trabajar con nosotros? ¡Póngase en contacto hoy!</p>
            <button className="bg-yellow-500 text-black px-8 py-3 rounded-full hover:bg-yellow-600 transition duration-300">
              Contactar Ahora
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
