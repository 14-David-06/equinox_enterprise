'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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
        <Link href="#home" className="flex items-center group">
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
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;