import { Instagram, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white border-t border-[#FF6B35]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="text-3xl font-bold text-[#FF6B35] mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Sesto Senso
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Autentična italijanska kuhinja u srcu Srbije
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-5 text-lg">Brzi linkovi</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#home" className="hover:text-[#FF6B35] transition-all duration-200 hover:translate-x-1 inline-block">
                  Početna
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-orange-500 transition-all duration-200 hover:translate-x-1 inline-block">
                  Meni
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-orange-500 transition-all duration-200 hover:translate-x-1 inline-block">
                  O nama
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-orange-500 transition-all duration-200 hover:translate-x-1 inline-block">
                  Kontakt
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-5 text-lg">Kontakt</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+381691116999" className="hover:text-[#FF6B35] transition-colors">
                  +381 069 111 6 999
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:sesto21senso@gmail.com" className="hover:text-[#FF6B35] transition-colors">
                  sesto21senso@gmail.com
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-5 text-lg">Pratite nas</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com/napoli_picerija" target="_blank" rel="noopener noreferrer" className="bg-[#2A2A2A] p-3.5 rounded-xl hover:bg-[#FF6B35] transition-all duration-300 hover:scale-110 shadow-lg border border-[#FF6B35]/20" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-[#FF6B35]/20 pt-10 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sesto Senso. Sva prava zadržana.</p>
        </div>
      </div>
    </footer>
  );
}