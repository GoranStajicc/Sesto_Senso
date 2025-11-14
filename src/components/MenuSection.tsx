import { useState, useEffect } from 'react';
import { localDataService } from '../lib/localDataService';
import type { Category } from '../types';
import CategoryDetail from './CategoryDetail';

export default function MenuSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    try {
      const categoriesData = localDataService.getCategories({ is_active: true });
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: Category) => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      const headerOffset = 80;
      const elementPosition = menuSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      setScrollPosition(offsetPosition);
    }

    setSelectedCategory(category);
  };

  if (selectedCategory) {
    return (
      <CategoryDetail
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
        scrollPosition={scrollPosition}
      />
    );
  }

  if (loading) {
    return (
      <section id="menu" className="py-20 bg-[#1A1A1A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF6B35] rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4CAF50] rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#FF6B35] rounded-full filter blur-3xl animate-pulse"></div>
        </div>
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded-xl w-56 mx-auto mb-6"></div>
                <div className="h-5 bg-gray-200 rounded-lg w-96 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-12 sm:py-20 bg-[#1A1A1A] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF6B35] rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4CAF50] rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#FF6B35] rounded-full filter blur-3xl animate-pulse"></div>
      </div>
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 tracking-tight px-4" style={{ fontFamily: "'Playfair Display', serif" }}>Naš Meni 🍽️</h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
            Izaberite kategoriju i istražite našu ponudu 👨‍🍳
          </p>
        </div>

        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(category => (
            <li
              key={category.id}
              className="bg-[#2A2A2A] rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2 active:scale-95 border border-[#FF6B35]/20"
              onClick={() => handleCategorySelect(category)}
            >
              <div className="relative aspect-square overflow-hidden">
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FF6B35] to-[#4CAF50]">
                    <span className="text-white text-5xl font-bold drop-shadow-lg">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent group-hover:from-black/40 transition-all duration-300"></div>
              </div>
              <div className="p-2 sm:p-4">
                <button
                  className="w-full bg-[#FF6B35] text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold hover:bg-[#e55a2a] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 text-xs sm:text-base"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategorySelect(category);
                  }}
                >
                  {category.name}
                </button>
              </div>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </section>
  );
}
