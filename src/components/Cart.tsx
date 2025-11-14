import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  onMenuClick: () => void;
}

export default function Cart({ isOpen, onClose, onCheckout, onMenuClick }: CartProps) {
  const { items, updateQuantity, removeItem, totalAmount, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-[#2A2A2A] shadow-2xl z-50 flex flex-col safe-area-inset border-l border-[#FF6B35]/20">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#FF6B35]/20">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Vaša korpa 🛒</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#FF6B35]/10 rounded-full transition-colors text-gray-300"
            aria-label="Zatvori korpu"
          >
            <X className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center">
            <ShoppingBag className="h-24 w-24 text-[#FF6B35]/30 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">Korpa je prazna 😮</h3>
            <p className="text-sm sm:text-base text-gray-400 mb-6">
              Dodajte nešto ukusno iz našeg menija! 🍕
            </p>
            <button
              onClick={onMenuClick}
              className="bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e55a2a] transition-colors min-h-[48px] active:scale-95"
            >
              Pogledajte meni
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${item.menuItem.id}-${item.selectedSize?.id || 'no-size'}-${index}`}
                  className="bg-[#1A1A1A] rounded-lg p-3 sm:p-4 space-y-3 border border-[#FF6B35]/20"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2">
                      <h3 className="font-semibold text-sm sm:text-base text-white">{item.menuItem.name}</h3>
                      {item.selectedSize && (
                        <p className="text-xs text-[#FF6B35] font-medium mt-0.5">
                          {item.selectedSize.size_name}
                        </p>
                      )}
                      <p className="text-sm text-gray-300 mt-1">
                        {(item.selectedSize?.price || item.menuItem.price).toFixed(2)} RSD
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.menuItem.id, item.selectedSize?.id)}
                      className="text-[#FF6B35] hover:text-[#e55a2a] p-2 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 -mt-2 active:scale-90"
                      aria-label="Ukloni iz korpe"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {item.specialInstructions && (
                    <p className="text-sm text-gray-400 italic">
                      Napomena: {item.specialInstructions}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1, item.selectedSize?.id)}
                        className="p-2 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-90 text-gray-300 border border-[#FF6B35]/20"
                        aria-label="Smanji količinu"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-semibold text-white w-10 text-center text-base">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1, item.selectedSize?.id)}
                        className="p-2 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-90 text-gray-300 border border-[#FF6B35]/20"
                        aria-label="Povećaj količinu"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="font-bold text-white text-sm sm:text-base">
                      {((item.selectedSize?.price || item.menuItem.price) * item.quantity).toFixed(2)} RSD
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#FF6B35]/20 bg-[#2A2A2A] p-4 sm:p-6 space-y-4">
              <div className="flex justify-between items-center text-base sm:text-lg">
                <span className="font-semibold text-gray-300">Ukupno ({totalItems} {totalItems === 1 ? 'stavka' : 'stavki'}):</span>
                <span className="font-bold text-xl sm:text-2xl text-[#4CAF50]">
                  {totalAmount.toFixed(2)} RSD
                </span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-[#4CAF50] text-white py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#3d8b40] transition-colors shadow-lg hover:shadow-xl min-h-[52px] active:scale-98"
              >
                Nastavite sa narudžbinom 🚀
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
