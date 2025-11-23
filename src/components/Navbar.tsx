import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/logo-equinox-removebg-preview.png"
            alt="Logo Equinox"
            width={60}
            height={60}
            className="mr-2"
          />
          <span className="text-xl font-bold text-yellow-400">Equinox</span>
        </div>
        <ul className="flex space-x-6">
          <li><Link href="#contact" className="hover:text-yellow-400">Acceder</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;