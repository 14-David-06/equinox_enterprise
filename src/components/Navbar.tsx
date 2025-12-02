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
            width={60}
            height={60}
            className="mr-3 group-hover:scale-110 transition-transform duration-300"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
            Equinox
          </span>
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
              href="#contact" 
              className="group relative px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-full overflow-hidden hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Acceder</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;