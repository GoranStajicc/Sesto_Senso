import { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { MenuItem } from '../types';

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  basePrice: number;
  itemImage?: string;
  categoryName?: string;
  menuItem?: MenuItem;
}

const MENU_ITEM_ADDONS: Record<number, string[]> = {
  0: ['Kečap Ljuti', 'Kečap Blagi'],
  100: ['Mocarela', 'Rukola', 'Pančeta', 'Feta', 'Plodovi Mora', 'Piletina', 'Čili Sos', 'Tabasko', 'Gorgonzola', 'Susam', 'Kajmak', 'Masline', 'Jaje', 'Paradajz', 'Kulen', 'Pečenica', 'Suvi Vrat', 'Pečurke', 'Šunka', 'Kačkavalj', 'Feferoni', 'Majonez', 'Pavlaka', 'Parmezan', 'Goveđa Pršuta'],
  120: ['Njegušski pršut']
};

const BREAKFAST_ADDONS: Record<number, string[]> = {
  60: ['Lepinja'],
  80: ['Jaje', 'Šunka', 'Pečurke'],
  100: ['Paradajz', 'Feta', 'Slanina', 'Kačkavalj', 'Kajmak', 'Viršla', 'Eurokrem', 'Marmelada'],
  130: ['Pršuta']
};

const SWEET_PANCAKE_ADDONS: Record<number, string[]> = {
  80: ['Banana', 'Orasi', 'Plazma', 'Višnja', 'Šlag'],
  100: ['Ananas'],
  130: ['Dodatak Eurokrem'],
  150: ['Dodatak Nutela']
};

const SALTY_PANCAKE_ADDONS: Record<number, string[]> = {
  150: ['Pohovanje']
};

const NEKTAR_FLAVORS: Record<number, string[]> = {
  0: []
};

const PASTA_TYPES = ['Špagete', 'Taljatele', 'Pene', 'Fusili'];

export default function MenuItemModal({
  isOpen,
  onClose,
  itemName,
  basePrice,
  itemImage,
  categoryName,
  menuItem
}: MenuItemModalProps) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [nothingSelected, setNothingSelected] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedPasta, setSelectedPasta] = useState<string>('');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
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
      setSelectedAddons([]);
      setNothingSelected(false);
      setQuantity(1);
      setSelectedFlavor('');
      setSelectedPasta('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isBreakfast = categoryName?.toLowerCase().includes('doručak') || categoryName?.toLowerCase().includes('dorucak');
  const isSweetPancake = categoryName?.toLowerCase().includes('slatke palačinke') || categoryName?.toLowerCase().includes('slatke palacinke');
  const isSaltyPancake = categoryName?.toLowerCase().includes('slane palačinke') || categoryName?.toLowerCase().includes('slane palacinke');
  const isPasta = categoryName?.toLowerCase().includes('paste') || categoryName?.toLowerCase().includes('pasta');
  const isLasagna = itemName?.toLowerCase().includes('lazanje');
  const isNektarSok = itemName?.toLowerCase().includes('nektar');

  const hasAddons = isNektarSok ? true : (menuItem?.hasAddons !== false);
  const hasFlavors = menuItem?.flavors && menuItem.flavors.length > 0;
  const flavors = menuItem?.flavors || [];

  let addonsToUse = MENU_ITEM_ADDONS;
  if (isNektarSok) {
    addonsToUse = NEKTAR_FLAVORS;
  } else if (isBreakfast) {
    addonsToUse = BREAKFAST_ADDONS;
  } else if (isSweetPancake) {
    addonsToUse = SWEET_PANCAKE_ADDONS;
  } else if (isSaltyPancake) {
    addonsToUse = SALTY_PANCAKE_ADDONS;
  }

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
      setSelectedAddons([]);
    }
  };

  const calculateTotalPrice = () => {
    let addonsPrice = 0;
    Object.entries(addonsToUse).forEach(([priceKey, addonsList]) => {
      const price = Number(priceKey);
      addonsList.forEach(addon => {
        if (selectedAddons.includes(addon)) {
          addonsPrice += price;
        }
      });
    });

    return (basePrice + addonsPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (isPasta && !isLasagna && !selectedPasta) {
      return;
    }

    if (hasFlavors && !selectedFlavor) {
      return;
    }

    const parts: string[] = [];

    if (isPasta && !isLasagna && selectedPasta) {
      parts.push(selectedPasta);
    }

    if (hasFlavors && selectedFlavor) {
      parts.push(`Ukus: ${selectedFlavor}`);
    }

    if (selectedAddons.length > 0) {
      parts.push(selectedAddons.join(', '));
    } else if (nothingSelected) {
      parts.push('Bez dodataka');
    }

    const specialInstructions = parts.length > 0 ? parts.join(' | ') : undefined;

    const menuItem = {
      id: `${itemName}-${Date.now()}`,
      category_id: '',
      name: itemName,
      description: '',
      price: calculateTotalPrice() / quantity,
      image_url: itemImage || '',
      is_available: true,
      is_featured: false,
      display_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    addItem(menuItem, quantity, undefined, specialInstructions);

    onClose();
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

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
            <h2 className="text-2xl font-bold text-white mb-1">{itemName}</h2>
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
          {isPasta && !isLasagna && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-1">Pasta:</h3>
              <p className="text-sm text-gray-400 mb-4">Obavezan izbor testenine:</p>

              <div className="grid grid-cols-2 gap-2 mb-2">
                {PASTA_TYPES.map(pasta => {
                  const isSelected = selectedPasta === pasta;

                  return (
                    <label
                      key={pasta}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF6B35]/10 border-[#FF6B35] shadow-md'
                          : 'bg-[#1A1A1A] border-gray-700 hover:border-[#FF6B35]/40 hover:bg-[#1A1A1A]/80'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pasta"
                        checked={isSelected}
                        onChange={() => setSelectedPasta(pasta)}
                        className="w-4 h-4 text-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2 focus:ring-offset-[#2A2A2A] bg-[#1A1A1A] border-gray-600 cursor-pointer"
                      />
                      <span className="text-white text-sm font-medium">{pasta}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {hasFlavors && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Ukusi</h3>

              <div className="flex flex-wrap gap-3">
                {flavors.map(flavor => {
                  const isSelected = selectedFlavor === flavor;

                  return (
                    <button
                      key={flavor}
                      type="button"
                      onClick={() => {
                        console.log('Clicking flavor:', flavor);
                        console.log('Previous selectedFlavor:', selectedFlavor);
                        setSelectedFlavor(flavor);
                      }}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        isSelected
                          ? 'bg-[#FF6B35] text-white shadow-lg scale-105'
                          : 'bg-[#1A1A1A] text-gray-300 border-2 border-gray-700 hover:border-[#FF6B35]/40 hover:scale-105'
                      }`}
                    >
                      {flavor}
                    </button>
                  );
                })}
              </div>
              {selectedFlavor && (
                <p className="text-xs text-gray-400 mt-2">Izabran ukus: {selectedFlavor}</p>
              )}
            </div>
          )}

          {!isLasagna && hasAddons && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-4">{isNektarSok ? 'Ukus' : 'Dodaci'}</h3>

            <label className="flex items-center gap-3 p-4 bg-[#1A1A1A] rounded-xl border-2 border-[#FF6B35]/20 hover:border-[#FF6B35]/40 transition-all cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={nothingSelected}
                onChange={handleNothingSelectedToggle}
                className="w-5 h-5 rounded border-2 border-gray-600 text-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2 focus:ring-offset-[#2A2A2A] bg-[#1A1A1A] cursor-pointer"
              />
              <span className="font-semibold text-white">Ništa od ponuđenog</span>
            </label>

            <div className="mb-6">
              {Object.entries(addonsToUse)
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
          </div>
          )}
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
            disabled={(isPasta && !isLasagna && !selectedPasta) || (hasFlavors && !selectedFlavor)}
            className="w-full bg-gradient-to-r from-[#FF6B35] to-[#e55a2a] hover:from-[#e55a2a] hover:to-[#FF6B35] text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
