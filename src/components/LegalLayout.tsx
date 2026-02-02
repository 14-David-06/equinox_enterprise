'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex flex-col">
      <Navbar />
      <main className="flex-1 pt-40 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center gap-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-yellow-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>/</li>
              <li className="text-yellow-400">{title}</li>
            </ol>
          </nav>

          {/* Content Card */}
          <article className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
            <header className="mb-8 pb-6 border-b border-white/10">
              <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-3">
                {title}
              </h1>
              <p className="text-gray-400 text-sm">
                Última actualización: {lastUpdated}
              </p>
            </header>

            <div className="prose prose-invert prose-yellow max-w-none">
              {children}
            </div>
          </article>

          {/* Links to other legal pages */}
          <nav className="mt-8 p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">Documentos Legales</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/legal/politica-privacidad" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                Política de Privacidad
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/legal/politica-cookies" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                Política de Cookies
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/legal/tratamiento-datos" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                Tratamiento de Datos
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/legal/terminos-condiciones" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                Términos y Condiciones
              </Link>
            </div>
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  );
}
