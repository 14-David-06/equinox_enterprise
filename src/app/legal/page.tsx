import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentos Legales | Equinox Logística y Transporte',
  description: 'Centro de documentos legales de Equinox Logística y Transporte S.A.S.',
};

const documentosLegales = [
  {
    titulo: 'Política de Privacidad',
    descripcion: 'Información sobre cómo recopilamos, usamos y protegemos sus datos personales.',
    href: '/legal/politica-privacidad',
    icono: '🔒',
  },
  {
    titulo: 'Política de Cookies',
    descripcion: 'Detalles sobre el uso de cookies y tecnologías similares en nuestra plataforma.',
    href: '/legal/politica-cookies',
    icono: '🍪',
  },
  {
    titulo: 'Tratamiento de Datos',
    descripcion: 'Autorización y condiciones para el tratamiento de sus datos personales.',
    href: '/legal/tratamiento-datos',
    icono: '📋',
  },
  {
    titulo: 'Términos y Condiciones',
    descripcion: 'Reglas y condiciones que rigen el uso de nuestra plataforma y servicios.',
    href: '/legal/terminos-condiciones',
    icono: '📜',
  },
];

export default function LegalIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex flex-col">
      <Navbar />
      <main className="flex-1 pt-40 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">
              Centro Legal
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Documentos legales y políticas de EQUINOX LOGÍSTICA Y TRANSPORTE S.A.S. 
              que rigen el uso de nuestra plataforma y el tratamiento de su información.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentosLegales.map((doc) => (
              <Link
                key={doc.href}
                href={doc.href}
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-yellow-400/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{doc.icono}</span>
                  <div>
                    <h2 className="text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors mb-2">
                      {doc.titulo}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {doc.descripcion}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-yellow-400 text-sm font-medium">
                  Leer documento
                  <svg 
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">¿Tiene preguntas?</h3>
            <p className="text-gray-400 mb-6">
              Si tiene dudas sobre nuestras políticas o necesita más información, 
              no dude en contactarnos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:legal@equinox.com.co" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                legal@equinox.com.co
              </a>
              <a 
                href="mailto:protecciondatos@equinox.com.co" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-yellow-400 text-yellow-400 font-semibold rounded-xl hover:bg-yellow-400/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Protección de Datos
              </a>
            </div>
          </div>

          {/* Last Updated */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Documentos actualizados al 1 de febrero de 2026
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
