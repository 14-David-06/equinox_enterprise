'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ nombre?: string; cedula?: string } | null>(null);

  useEffect(() => {
    // comprobar sesión actual
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        const data = await res.json();
        if (mounted && data?.authenticated) setUser(data.user);
      } catch (err) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'backdrop-blur-xl bg-black/80 border-b border-white/10 shadow-2xl' 
        : 'backdrop-blur-md bg-white/5'
    }`}>
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo-equinox-removebg-preview.png"
            alt="Logo Equinox"
            width={160}
            height={160}
            className="mr-3 group-hover:scale-110 transition-transform duration-300"
          />
        </Link>
        <ul className="flex space-x-8 items-center">
          <li>
            <Link 
              href="#services" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium"
            >
              Servicios
            </Link>
          </li>
          <li>
            <Link 
              href="#about" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium"
            >
              Acerca
            </Link>
          </li>
          <li>
            <Link 
              href="/inspeccion" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium"
            >
              Preoperacional
            </Link>
          </li>
          {user && (
            <li>
              <Link 
                href="/dashboard" 
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium"
              >
                Dashboard Preoperativos
              </Link>
            </li>
          )}
          <li>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-200">{user.nombre ?? user.cedula}</span>
                <button
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                    setUser(null);
                    location.href = '/';
                  }}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-all duration-200"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-full hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105 transition-all duration-300"
              >
                Acceder
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;