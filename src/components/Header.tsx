import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import AnnouncementBanner from './AnnouncementBanner';

interface HeaderProps {
  onCartClick: () => void;
  onMenuClick: (section: string) => void;
}

export default function Header({ onCartClick, onMenuClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, cartRef } = useCart();

  const menuItems = [
    { id: 'home', label: 'Početna' },
    { id: 'menu', label: 'Meni' },
    { id: 'about', label: 'O nama' },
    { id: 'contact', label: 'Kontakt' }
  ];

  return (
    <header className="fixed w-full top-0 z-50">
      <div className="bg-[#1A1A1A]/95 backdrop-blur-sm shadow-soft border-b border-[#FF6B35]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onMenuClick('home')}>
            <img
              src="/images/image.png"
              alt="Pizza Napoli Logo"
              className="h-12 sm:h-14 object-contain"
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-[#FF6B35] tracking-tight group-hover:text-[#e55a2a] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>Sesto Senso</h1>
          </div>

          <nav className="hidden md:flex space-x-10">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => onMenuClick(item.id)}
                className="text-gray-300 hover:text-[#FF6B35] transition-all duration-200 font-medium text-base relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6B35] group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              ref={cartRef}
              onClick={onCartClick}
              className="relative p-3 text-gray-300 hover:text-[#FF6B35] transition-all duration-200 hover:bg-[#FF6B35]/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Korpa"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4CAF50] text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 text-gray-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Meni"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-[#1A1A1A] border-t border-[#FF6B35]/20 shadow-lg">
          <nav className="px-4 py-3 space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onMenuClick(item.id);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3.5 text-base text-gray-300 hover:bg-[#FF6B35]/10 hover:text-[#FF6B35] rounded-lg transition-all duration-200 font-medium min-h-[44px] flex items-center"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
      </div>
    </header>
  );
}
