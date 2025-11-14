import { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { toppings } from '../data/toppings';
import { useCart } from '../context/CartContext';

interface PizzaToppingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pizzaName: string;
  pizzaSize: string;
  basePrice: number;
  pizzaImage?: string;
}

const PIZZA_ADDONS: Record<number, Record<number, string[]>> = {
  28: {
    0: ['Kečap Blagi', 'Kečap Ljuti'],
    200: ['Ananas', 'Feferoni', 'Feta', 'Gorgonzola', 'Jaje', 'Kajmak', 'Kačkavalj', 'Kulen', 'Majonez', 'Masline', 'Mocarela', 'Morski plodovi', 'Paradajz', 'Parmezan', 'Pavlaka', 'Pečenica', 'Pečurke', 'Piletina', 'Punjena ivica', 'Rukola', 'Susam', 'Suvi vrat', 'Tabasko', 'Čili sos', 'Šunka'],
    250: ['Pršuta']
  },
  32: {
    0: ['Kečap Blagi', 'Kečap Ljuti'],
    250: ['Ananas', 'Feferoni', 'Feta', 'Gorgonzola', 'Jaje', 'Kajmak', 'Kačkavalj', 'Kulen', 'Majonez', 'Masline', 'Mocarela', 'Morski plodovi', 'Paradajz', 'Parmezan', 'Pavlaka', 'Pečenica', 'Pečurke', 'Piletina', 'Punjena ivica', 'Rukola', 'Susam', 'Suvi vrat', 'Tabasko', 'Čili sos', 'Šunka'],
    300: ['Pršuta']
  },
  42: {
    0: ['Kečap Blagi', 'Kečap Ljuti'],
    300: ['Ananas', 'Feferoni', 'Feta', 'Jaje', 'Kulen', 'Majonez', 'Masline', 'Paradajz', 'Pavlaka', 'Pečenica', 'Pečurke', 'Rukola', 'Susam', 'Suvi vrat', 'Čili sos', 'Šunka'],
    350: ['Gorgonzola', 'Kajmak', 'Kačkavalj', 'Mocarela', 'Morski plodovi', 'Parmezan', 'Piletina', 'Pršuta', 'Punjena ivica', 'Tabasko']
  },
  50: {
    0: ['Kečap Blagi', 'Kečap Ljuti'],
    350: ['Ananas', 'Feferoni', 'Feta', 'Jaje', 'Kulen', 'Majonez', 'Masline', 'Paradajz', 'Pavlaka', 'Pečenica', 'Pečurke', 'Rukola', 'Susam', 'Suvi vrat', 'Čili sos', 'Šunka'],
    400: ['Gorgonzola', 'Kajmak', 'Kačkavalj', 'Mocarela', 'Morski plodovi', 'Parmezan', 'Piletina', 'Pršuta', 'Punjena ivica', 'Tabasko']
  }
};

export default function PizzaToppingsModal({
  isOpen,
  onClose,
  pizzaName,
  pizzaSize,
  basePrice,
  pizzaImage
}: PizzaToppingsModalProps) {
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [nothingSelected, setNothingSelected] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setSelectedToppings([]);
      setSelectedAddons([]);
      setNothingSelected(false);
      setQuantity(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeToppings = toppings[pizzaSize] || {};
  const sizeNum = parseInt(pizzaSize);
  const sizeAddons = PIZZA_ADDONS[sizeNum] || {};

  const handleToppingToggle = (toppingName: string) => {
    if (nothingSelected) return;

    setSelectedToppings(prev =>
      prev.includes(toppingName)
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const handleAddonToggle = (addonName: string) => {
    if (nothingSelected) return;

    setSelectedAddons(prev =>
      prev.includes(addonName)
        ? prev.filter(a => a !== addonName)
        : [...prev, addonName]
    );
  };

  const handleNothingSelectedToggle = () => {
    setNothingSelected(!nothingSelected);
    if (!nothingSelected) {
      setSelectedToppings([]);
      setSelectedAddons([]);
    }
  };

  const calculateTotalPrice = () => {
    let toppingsPrice = 0;

    Object.values(sizeToppings).forEach(priceGroup => {
      priceGroup.forEach(topping => {
        if (selectedToppings.includes(topping.name)) {
          toppingsPrice += topping.price;
        }
      });
    });

    let addonsPrice = 0;
    Object.entries(sizeAddons).forEach(([priceKey, addonsList]) => {
      const price = Number(priceKey);
      addonsList.forEach(addon => {
        if (selectedAddons.includes(addon)) {
          addonsPrice += price;
        }
      });
    });

    return (basePrice + toppingsPrice + addonsPrice) * quantity;
  };

  const handleAddToCart = () => {
    const allExtras = [...selectedToppings, ...selectedAddons];
    const extrasList = allExtras.length > 0
      ? allExtras.join(', ')
      : (nothingSelected ? 'Bez dodataka' : '');

    const specialInstructions = extrasList || undefined;

    const menuItem = {
      id: `${pizzaName}-${pizzaSize}-${Date.now()}`,
      category_id: '',
      name: pizzaName,
      description: '',
      price: basePrice,
      image_url: pizzaImage || '',
      is_available: true,
      is_featured: false,
      display_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const selectedSize = {
      id: `size-${pizzaSize}-${Date.now()}`,
      menu_item_id: menuItem.id,
      size_name: pizzaSize,
      price: calculateTotalPrice() / quantity,
      is_available: true,
      display_order: 0,
      created_at: new Date().toISOString()
    };

    addItem(menuItem, quantity, selectedSize, specialInstructions);

    onClose();
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  const priceGroups = Object.keys(sizeToppings).sort((a, b) => Number(a) - Number(b));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#2A2A2A] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-[#FF6B35]/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#FF6B35]/20">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{pizzaName}</h2>
            <p className="text-gray-400">Veličina: {pizzaSize}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#FF6B35]/10 transition-colors group"
            aria-label="Zatvori"
          >
            <X className="h-6 w-6 text-gray-400 group-hover:text-[#FF6B35] transition-colors" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Dodaci</h3>

            <label className="flex items-center gap-3 p-4 bg-[#1A1A1A] rounded-xl border-2 border-[#FF6B35]/20 hover:border-[#FF6B35]/40 transition-all cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={nothingSelected}
                onChange={handleNothingSelectedToggle}
                className="w-5 h-5 rounded border-2 border-gray-600 text-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2 focus:ring-offset-[#2A2A2A] bg-[#1A1A1A] cursor-pointer"
              />
              <span className="font-semibold text-white">Ništa od ponuđenog</span>
            </label>

            {Object.keys(sizeAddons).length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-bold text-white mb-4">Dodaci</h4>
                {Object.entries(sizeAddons)
                  .sort((a, b) => Number(a[0]) - Number(b[0]))
                  .map(([priceKey, addonsList]) => {
                    const price = Number(priceKey);

                    return (
                      <div key={priceKey} className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">
                          {price === 0 ? 'Besplatno' : `+${price} RSD po dodatku`}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {addonsList.map(addon => {
                            const isSelected = selectedAddons.includes(addon);
                            const isDisabled = nothingSelected;

                            return (
                              <label
                                key={addon}
                                className={`flex items-start gap-2 p-2.5 rounded-lg border-2 transition-all cursor-pointer ${
                                  isDisabled
                                    ? 'opacity-50 cursor-not-allowed bg-[#1A1A1A] border-gray-700'
                                    : isSelected
                                    ? 'bg-[#FF6B35]/10 border-[#FF6B35] shadow-md'
                                    : 'bg-[#1A1A1A] border-gray-700 hover:border-[#FF6B35]/40 hover:bg-[#1A1A1A]/80'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleAddonToggle(addon)}
                                  disabled={isDisabled}
                                  className="mt-0.5 w-4 h-4 rounded border-2 border-gray-600 text-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2 focus:ring-offset-[#2A2A2A] bg-[#1A1A1A] cursor-pointer disabled:cursor-not-allowed"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-medium leading-tight">{addon}</p>
                                  {price > 0 && (
                                    <p className="text-gray-400 text-xs mt-0.5">+{price} RSD</p>
                                  )}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {priceGroups.map(priceKey => {
              const price = Number(priceKey);
              const toppingsList = sizeToppings[priceKey];

              return (
                <div key={priceKey} className="mb-6">
                  <h4 className="text-md font-bold text-[#FF6B35] mb-3">
                    {price === 0 ? 'Besplatni dodaci' : `Dodaci za ${price} RSD`}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {toppingsList.map(topping => {
                      const isSelected = selectedToppings.includes(topping.name);
                      const isDisabled = nothingSelected;

                      return (
                        <label
                          key={topping.name}
                          className={`flex items-start gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                            isDisabled
                              ? 'opacity-50 cursor-not-allowed bg-[#1A1A1A] border-gray-700'
                              : isSelected
                              ? 'bg-[#FF6B35]/10 border-[#FF6B35] shadow-md'
                              : 'bg-[#1A1A1A] border-gray-700 hover:border-[#FF6B35]/40 hover:bg-[#1A1A1A]/80'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToppingToggle(topping.name)}
                            disabled={isDisabled}
                            className="mt-0.5 w-4 h-4 rounded border-2 border-gray-600 text-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2 focus:ring-offset-[#2A2A2A] bg-[#1A1A1A] cursor-pointer disabled:cursor-not-allowed"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium leading-tight">{topping.name}</p>
                            {topping.price > 0 && (
                              <p className="text-gray-400 text-xs mt-0.5">+{topping.price} RSD</p>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-[#FF6B35]/20 p-6 bg-[#1A1A1A]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-semibold">Količina:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="p-2 rounded-full bg-[#2A2A2A] hover:bg-[#FF6B35] disabled:opacity-50 disabled:cursor-not-allowed transition-colors group"
                aria-label="Smanji količinu"
              >
                <Minus className="h-5 w-5 text-white" />
              </button>
              <span className="text-white font-bold text-xl w-12 text-center">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="p-2 rounded-full bg-[#2A2A2A] hover:bg-[#FF6B35] transition-colors group"
                aria-label="Povećaj količinu"
              >
                <Plus className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-[#FF6B35] to-[#e55a2a] hover:from-[#e55a2a] hover:to-[#FF6B35] text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Dodaj u korpu</span>
            <span className="text-xl">{calculateTotalPrice()} RSD</span>
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1A1A1A;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FF6B35;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e55a2a;
        }
      `}</style>
    </div>
  );
}
