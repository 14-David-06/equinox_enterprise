'use client';
// Force redeploy v2 - Production navbar fix
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ nombre?: string; cedula?: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Marcar como montado para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // comprobar sesión actual
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        const data = await res.json();
        if (isMounted && data?.authenticated) setUser(data.user);
      } catch {
        // ignore
      }
    })();
    return () => { isMounted = false; };
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

  // No renderizar hasta que esté montado para evitar problemas de hidratación
  if (!mounted) {
    return (
      <nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-equinos-blanco-2-removebg-preview.png"
              alt="Logo Equinox"
              width={80}
              height={80}
              priority
              className="w-[80px] sm:w-[100px] xl:w-[140px]"
            />
          </Link>
          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 xl:hidden" />
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: scrolled || mobileMenuOpen ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group" style={{ zIndex: 51 }} onClick={closeMenu}>
            <Image
              src="/logo-equinos-blanco-2-removebg-preview.png"
              alt="Logo Equinox"
              width={80}
              height={80}
              priority
              className="w-[80px] sm:w-[100px] xl:w-[140px] group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Menú Desktop - Solo visible en xl (1280px+) */}
          <ul className="hidden xl:flex items-center space-x-5 2xl:space-x-8">
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
                  href="/inspeccion-vehicular" 
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium text-sm lg:text-base"
                >
                  Inspección Vehicular
                </Link>
              </li>
            )}
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

          {/* Botón Hamburguesa - Solo visible en móvil/tablet (< 1280px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ zIndex: 51 }}
            className="xl:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="Menú"
          >
            <span 
              className="w-5 h-0.5 bg-white rounded transition-all duration-300"
              style={{ transform: mobileMenuOpen ? 'rotate(45deg) translateY(8px)' : 'none' }}
            />
            <span 
              className="w-5 h-0.5 bg-white rounded transition-all duration-300"
              style={{ opacity: mobileMenuOpen ? 0 : 1 }}
            />
            <span 
              className="w-5 h-0.5 bg-white rounded transition-all duration-300"
              style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }}
            />
          </button>
        </div>
      </nav>

      {/* Menú Móvil Overlay */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          visibility: mobileMenuOpen ? 'visible' : 'hidden',
          transition: 'visibility 0.3s',
        }}
        className="xl:hidden"
      >
        {/* Backdrop */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            opacity: mobileMenuOpen ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
          onClick={closeMenu}
        />
        
        {/* Panel del Menú */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
            width: '280px',
            background: 'linear-gradient(to bottom, rgb(15, 23, 42), rgb(0, 0, 0))',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.5)',
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease-out',
          }}
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
                      href="/inspeccion-vehicular" 
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all duration-200"
                    >
                      <span className="text-xl">📋</span>
                      <span className="font-medium">Inspección Vehicular</span>
                    </Link>
                  </li>
                )}
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
