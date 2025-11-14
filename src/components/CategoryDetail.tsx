import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { localDataService } from '../lib/localDataService';
import { useCart } from '../context/CartContext';
import { useFlyToCart } from '../hooks/useFlyToCart';
import PizzaToppingsModal from './PizzaToppingsModal';
import MenuItemModal from './MenuItemModal';
import type { Category, MenuItem, MenuItemSize } from '../types';

interface CategoryDetailProps {
  category: Category;
  onBack: () => void;
  scrollPosition: number;
}

export default function CategoryDetail({ category, onBack, scrollPosition }: CategoryDetailProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, MenuItemSize>>({});
  const [pizzaModalOpen, setPizzaModalOpen] = useState(false);
  const [menuItemModalOpen, setMenuItemModalOpen] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState<{ item: MenuItem; size: MenuItemSize } | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const imageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { addItem, cartRef } = useCart();
  const flyToCart = useFlyToCart();

  useEffect(() => {
    window.scrollTo({
      top: scrollPosition,
      behavior: 'instant'
    });

    loadItems();
  }, [category.id, scrollPosition]);

  const loadItems = () => {
    try {
      const itemsData = localDataService.getMenuItems({
        category_id: category.id,
        is_available: true
      });

      setMenuItems(itemsData);

      const initialSizes: Record<string, MenuItemSize> = {};
      itemsData.forEach((item) => {
        if (item.sizes && item.sizes.length > 0) {
          initialSizes[item.id] = item.sizes[0];
        }
      });
      setSelectedSizes(initialSizes);
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    const selectedSize = selectedSizes[item.id];

    const isDrinkCategory = category.name.toLowerCase().includes('pić');
    const isNektarSok = item.name.toLowerCase().includes('nektar');
    const isPizzaCategory = category.name.toLowerCase().includes('pice') ||
                           category.name.toLowerCase().includes('pica') ||
                           category.name.toLowerCase().includes('pizza');

    const isPizza = isPizzaCategory && item.sizes && item.sizes.length > 0;

    const needsModal = category.name.toLowerCase().includes('sendvič') ||
                       category.name.toLowerCase().includes('paste') ||
                       category.name.toLowerCase().includes('tortilje') ||
                       category.name.toLowerCase().includes('pasta') ||
                       category.name.toLowerCase().includes('doručak') ||
                       category.name.toLowerCase().includes('dorucak') ||
                       category.name.toLowerCase().includes('slatke palačinke') ||
                       category.name.toLowerCase().includes('slatke palacinke') ||
                       category.name.toLowerCase().includes('slane palačinke') ||
                       category.name.toLowerCase().includes('slane palacinke') ||
                       (isDrinkCategory && isNektarSok);

    if (isPizza && selectedSize) {
      console.log('Opening pizza modal for:', item.name, selectedSize.size_name);
      setSelectedPizza({ item, size: selectedSize });
      setPizzaModalOpen(true);
    } else if (needsModal) {
      console.log('Opening menu item modal for:', item.name);
      setSelectedMenuItem(item);
      setMenuItemModalOpen(true);
    } else {
      const sourceEl = imageRefs.current[item.id];
      const targetEl = cartRef.current;

      flyToCart(sourceEl, targetEl);
      addItem(item, 1, selectedSize);
    }
  };

  const handleSizeChange = (itemId: string, size: MenuItemSize) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [itemId]: size,
    }));
  };

  const getDisplayPrice = (item: MenuItem) => {
    if (item.sizes && item.sizes.length > 0) {
      const selectedSize = selectedSizes[item.id];
      return selectedSize?.price || item.sizes[0].price;
    }
    return item.price;
  };

  return (
    <section className="py-12 sm:py-16 bg-[#1A1A1A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#FF6B35] hover:text-[#e55a2a] font-semibold mb-6 sm:mb-8 transition-colors min-h-[44px] active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
          Nazad na kategorije
        </button>

        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">{category.name}</h2>
          <p className="text-base sm:text-lg text-gray-300">
            Izaberite jelo i dodajte ga u korpu
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Trenutno nema dostupnih jela u ovoj kategoriji.
            </p>
            <p className="text-gray-500 mt-2">
              Molimo vas da proverite kasnije ili kontaktirajte restoran.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {menuItems.map(item => (
              <li
                key={item.id}
                className="bg-[#2A2A2A] rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group active:scale-98 border border-[#FF6B35]/20"
              >
                <div
                  ref={(el) => (imageRefs.current[item.id] = el)}
                  className="relative aspect-square overflow-hidden bg-[#1A1A1A]"
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FF6B35]/20 to-[#4CAF50]/20">
                      <span className="text-[#FF6B35] text-4xl font-bold">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{item.name}</h3>
                  {item.description && (
                    <p className="text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm line-clamp-2">{item.description}</p>
                  )}

                  {item.sizes && item.sizes.length > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <label className="text-xs sm:text-sm font-semibold text-gray-300 mb-2 block">
                        Veličina:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {item.sizes.map((size) => (
                          <button
                            key={size.id}
                            onClick={() => handleSizeChange(item.id, size)}
                            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all min-h-[44px] flex items-center justify-center active:scale-95 ${
                              selectedSizes[item.id]?.id === size.id
                                ? 'bg-[#FF6B35] text-white shadow-md'
                                : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#2A2A2A] border border-[#FF6B35]/20'
                            }`}
                          >
                            {size.size_name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xl sm:text-2xl font-bold text-[#FF6B35]">
                      {getDisplayPrice(item).toFixed(2)} RSD
                    </span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-[#4CAF50] text-white p-3 rounded-full hover:bg-[#3d8b40] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 min-w-[48px] min-h-[48px] flex items-center justify-center"
                      aria-label={`Dodaj ${item.name} u korpu`}
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <PizzaToppingsModal
        isOpen={pizzaModalOpen && selectedPizza !== null}
        onClose={() => {
          setPizzaModalOpen(false);
          setSelectedPizza(null);
        }}
        pizzaName={selectedPizza?.item.name || ''}
        pizzaSize={selectedPizza?.size.size_name || ''}
        basePrice={selectedPizza?.size.price || 0}
        pizzaImage={selectedPizza?.item.image_url}
      />

      <MenuItemModal
        isOpen={menuItemModalOpen && selectedMenuItem !== null}
        onClose={() => {
          setMenuItemModalOpen(false);
          setSelectedMenuItem(null);
        }}
        itemName={selectedMenuItem?.name || ''}
        basePrice={selectedMenuItem?.price || 0}
        itemImage={selectedMenuItem?.image_url}
        categoryName={category.name}
        menuItem={selectedMenuItem || undefined}
      />
    </section>
  );
}
