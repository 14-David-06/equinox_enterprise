import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black text-white p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center mb-4">
            <Image
              src="/logo-equinox-removebg-preview.png"
              alt="Logo Equinox"
              width={40}
              height={40}
              className="mr-2"
            />
            <span className="text-lg font-bold text-yellow-400">Equinox</span>
          </div>
          <p className="text-gray-300">Su socio confiable en transporte.</p>
        </div>
        <div>
          <h3 className="text-yellow-400 font-semibold mb-4">Enlaces Rápidos</h3>
          <ul className="space-y-2">
            <li><Link href="#home" className="hover:text-yellow-400">Inicio</Link></li>
            <li><Link href="#services" className="hover:text-yellow-400">Servicios</Link></li>
            <li><Link href="#about" className="hover:text-yellow-400">Acerca</Link></li>
            <li><Link href="#contact" className="hover:text-yellow-400">Contacto</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-yellow-400 font-semibold mb-4">Información de Contacto</h3>
          <p className="text-gray-300">Email: info@equinox.com</p>
          <p className="text-gray-300">Teléfono: +1 (123) 456-7890</p>
          <p className="text-gray-300">Dirección: 123 Calle Transporte, Ciudad, Estado</p>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
        <p>&copy; 2025 Equinox Transportation. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;