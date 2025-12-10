'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const certifications = [
  {
    name: 'ISO 9001',
    image: '/images/certifications/iso9001.png',
    description: 'Sistema de Gestión de Calidad'
  },
  {
    name: 'ISO 14001',
    image: '/images/certifications/14001.png',
    description: 'Sistema de Gestión Ambiental'
  },
  {
    name: 'ISO 45001',
    image: '/images/certifications/ISO-45001.png',
    description: 'Sistema de Gestión de Seguridad y Salud Ocupacional'
  },
  {
    name: 'ISO 39001',
    image: '/images/certifications/iso39001.jpeg',
    description: 'Sistema de Gestión de Seguridad Vial'
  },
  {
    name: 'NORSOK S-006',
    image: '/images/certifications/norsok-s006.png',
    description: 'Estándar Noruego para Servicios de HSE'
  },
  {
    name: 'Ministerio de Transporte',
    image: '/images/certifications/Logo_Ministerio_de_Transporte_(2022-2026).png',
    description: 'Habilitado por el Ministerio de Transporte'
  }
];

export default function CertificationsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate carousel
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === certifications.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const nextSlide = () => {
    setCurrentIndex(currentIndex === certifications.length - 1 ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? certifications.length - 1 : currentIndex - 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 relative">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/3 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
            Certificaciones y Acreditaciones
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Respaldados por las certificaciones más exigentes de la industria, garantizamos los más altos estándares de calidad y seguridad.
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Carousel */}
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl hover:bg-white/8 transition-all duration-500">
            <div className="overflow-hidden relative">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {certifications.map((cert, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      {/* Image */}
                      <div className="flex justify-center">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <Image
                              src={cert.image}
                              alt={cert.name}
                              width={cert.name === 'NORSOK S-006' ? 280 : 200}
                              height={cert.name === 'NORSOK S-006' ? 200 : 150}
                              className={`w-auto mx-auto object-contain filter brightness-100 contrast-110 ${
                                cert.name === 'NORSOK S-006' ? 'h-5gir0' : 'h-32'
                              }`}
                              priority={index === 0}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="text-center lg:text-left space-y-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-yellow-400">
                          {cert.name}
                        </h3>
                        <p className="text-lg text-gray-300 leading-relaxed">
                          {cert.description}
                        </p>
                        <div className="flex items-center justify-center lg:justify-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-400 font-semibold">Certificación Activa</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
              <button
                onClick={prevSlide}
                className="pointer-events-auto group bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <svg className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="pointer-events-auto group bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <svg className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3 mt-8">
            {certifications.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                  index === currentIndex
                    ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 bg-white/10 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-4000 ease-linear rounded-full"
              style={{ 
                width: `${((currentIndex + 1) / certifications.length) * 100}%`,
                transition: isHovered ? 'none' : 'width 4s linear'
              }}
            />
          </div>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-3 backdrop-blur-sm bg-white/5 border border-white/10 rounded-full px-6 py-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-300 font-medium">Certificaciones verificadas y actualizadas</span>
          </div>
        </div>
      </div>
    </section>
  );
}