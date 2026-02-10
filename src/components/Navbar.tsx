'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Cerrar menú móvil al cambiar tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || mobileMenuOpen
          ? 'backdrop-blur-xl bg-black/90 border-b border-white/10 shadow-2xl' 
          : 'backdrop-blur-md bg-white/5'
      }`}>
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group z-50" onClick={closeMenu}>
            <Image
              src="/logo-equinos-blanco-2-removebg-preview.png"
              alt="Logo Equinox"
              width={80}
              height={80}
              className="w-[80px] sm:w-[100px] xl:w-[140px] group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Menú Desktop */}
          <ul className="hidden xl:flex space-x-5 2xl:space-x-8 items-center">
            <li>
              <Link 
                href="#services" 
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium text-sm lg:text-base"
              >
                Servicios
              </Link>
            </li>
            <li>
              <Link 
                href="#about" 
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium text-sm lg:text-base"
              >
                Acerca
              </Link>
            </li>
            <li>
              <Link 
                href="/preoperacional" 
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium text-sm lg:text-base"
              >
                Pre-operacional
              </Link>
            </li>
            {user && (
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium text-sm lg:text-base"
                >
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              {user ? (
                <div className="flex items-center gap-3 lg:gap-4">
                  <span className="text-xs lg:text-sm text-gray-200 max-w-[100px] truncate">{user.nombre ?? user.cedula}</span>
                  <button
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                      setUser(null);
                      location.href = '/';
                    }}
                    className="px-3 lg:px-4 py-1.5 lg:py-2 bg-white/5 border border-white/10 text-white text-sm rounded-full hover:bg-white/10 transition-all duration-200"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="px-4 lg:px-6 py-1.5 lg:py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-sm lg:text-base rounded-full hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105 transition-all duration-300"
                >
                  Acceder
                </Link>
              )}
            </li>
          </ul>

          {/* Botón Hamburguesa - Móvil/Tablet */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="Menú"
          >
            <span className={`w-5 h-0.5 bg-white rounded transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-white rounded transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-white rounded transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Menú Móvil Overlay */}
      <div 
        className={`fixed inset-0 z-40 xl:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMenu}
        />
        
        {/* Panel del Menú */}
        <div 
          className={`absolute top-0 right-0 h-full w-[280px] bg-gradient-to-b from-slate-900 to-black border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full pt-20 pb-8 px-6">
            {/* Links de navegación */}
            <nav className="flex-1">
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="#services" 
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all duration-200"
                  >
                    <span className="text-xl">🚀</span>
                    <span className="font-medium">Servicios</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#about" 
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all duration-200"
                  >
                    <span className="text-xl">📋</span>
                    <span className="font-medium">Acerca</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/preoperacional" 
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all duration-200"
                  >
                    <span className="text-xl">🚛</span>
                    <span className="font-medium">Pre-operacional</span>
                  </Link>
                </li>
                {user && (
                  <li>
                    <Link 
                      href="/dashboard" 
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all duration-200"
                    >
                      <span className="text-xl">📊</span>
                      <span className="font-medium">Dashboard</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            {/* Usuario / Acceder */}
            <div className="border-t border-white/10 pt-6">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <span className="text-yellow-400 text-lg">👤</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{user.nombre ?? 'Usuario'}</p>
                      <p className="text-gray-400 text-xs truncate">CC: {user.cedula}</p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                      setUser(null);
                      closeMenu();
                      location.href = '/';
                    }}
                    className="w-full px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-all duration-200 font-medium"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300"
                >
                  <span>🔐</span>
                  <span>Acceder</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;