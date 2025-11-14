import React, { useState } from 'react';
import { X, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PostalCodeSelector from './PostalCodeSelector';
import type { Customer } from '../types';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderNumber: string) => void; // Nije u upotrebi kod Netlify POST-a, ostavljeno radi kompatibilnosti
}

export default function Checkout({ isOpen, onClose, onSuccess }: CheckoutProps) {
  const { items, totalAmount, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('cash');

  const [formData, setFormData] = useState<Customer>({
    email: '',
    full_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
  });

  const [apartmentDetails, setApartmentDetails] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formDataToSend = new FormData(form);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataToSend as any).toString(),
      });

      if (response.ok || response.status === 303) {
        const orderNumber = `ORD-${Date.now()}`;
        clearCart();
        onSuccess(orderNumber);
      } else {
        alert('Greška pri slanju porudžbine. Molimo pokušajte ponovo.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Greška pri slanju porudžbine. Molimo pokušajte ponovo.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <div
          className="bg-[#2A2A2A] rounded-none sm:rounded-xl shadow-2xl max-w-2xl w-full h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto border border-[#FF6B35]/20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-[#2A2A2A] border-b border-[#FF6B35]/20 p-4 sm:p-6 flex items-center justify-between z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Završite porudžbinu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#FF6B35]/10 rounded-full transition-colors text-gray-300"
              aria-label="Zatvori"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form
            name="checkout"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 space-y-5 sm:space-y-6"
          >
            <input type="hidden" name="form-name" value="checkout" />
            <input type="hidden" name="bot-field" />

            <input type="hidden" name="payment_method" value={paymentMethod} />
            <input type="hidden" name="total_amount" value={totalAmount.toFixed(2)} />
            <input
              type="hidden"
              name="delivery_address"
              value={`${formData.address}, ${formData.city} ${formData.postal_code}`}
            />
            <input type="hidden" name="payment_status" value={paymentMethod === 'cash' ? 'pending' : 'pending'} />
            <input type="hidden" name="status" value="pending" />

            {/* Human-readable order items */}
            <input
              type="hidden"
              name="order_items"
              value={items
                .map((item) => {
                  const unit = item.selectedSize?.price ?? item.menuItem.price;
                  const name = item.menuItem.name;
                  const size = item.selectedSize?.size_name ? ` - Veličina: ${item.selectedSize.size_name}` : '';
                  const extras = item.specialInstructions ? ` | Dodaci: ${item.specialInstructions}` : '';
                  return `x${item.quantity} ${name}${size}${extras} | Cena: ${unit * item.quantity} RSD`;
                })
                .join('\n')}
            />

            {/* Individual pizza items with explicit size information */}
            {items.map((item, index) => {
              const pizzaName = item.menuItem.name;
              const pizzaSize = item.selectedSize?.size_name || 'N/A';
              const pizzaPrice = item.selectedSize?.price ?? item.menuItem.price;
              const pizzaQuantity = item.quantity;
              const pizzaExtras = item.specialInstructions || 'None';

              return (
                <React.Fragment key={`${item.menuItem.id}-${item.selectedSize?.id || 'default'}-${index}`}>
                  <input type="hidden" name={`pizza_${index + 1}_name`} value={pizzaName} />
                  <input type="hidden" name={`pizza_${index + 1}_size`} value={pizzaSize} />
                  <input type="hidden" name={`pizza_${index + 1}_quantity`} value={pizzaQuantity} />
                  <input type="hidden" name={`pizza_${index + 1}_price`} value={pizzaPrice} />
                  <input type="hidden" name={`pizza_${index + 1}_extras`} value={pizzaExtras} />
                  <input type="hidden" name={`pizza_${index + 1}_subtotal`} value={pizzaPrice * pizzaQuantity} />
                </React.Fragment>
              );
            })}
            <input type="hidden" name="total_items_count" value={items.length} />

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">Vaši podaci</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                    Ime i prezime *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2.5 border border-[#FF6B35]/20 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-base min-h-[48px] bg-[#1A1A1A] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2.5 border border-[#FF6B35]/20 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-base min-h-[48px] bg-[#1A1A1A] text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 sm:py-2.5 border border-[#FF6B35]/20 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-base min-h-[48px] bg-[#1A1A1A] text-white"
                />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">Adresa dostave</h3>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Ulica i broj *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 sm:py-2.5 border border-[#FF6B35]/20 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-base min-h-[48px] bg-[#1A1A1A] text-white"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Sprat, stan i interfon
                </label>
                <input
                  type="text"
                  name="apartment_details"
                  value={apartmentDetails}
                  onChange={(e) => setApartmentDetails(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-3 sm:py-2.5 border border-[#FF6B35]/20 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-base min-h-[48px] bg-[#1A1A1A] text-white placeholder:text-gray-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                    Grad *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2.5 border border-[#FF6B35]/20 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-base min-h-[48px] bg-[#1A1A1A] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                    Poštanski broj *
                  </label>
                  <PostalCodeSelector
                    value={formData.postal_code}
                    onChange={(value) => setFormData({ ...formData, postal_code: value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Napomena (opciono)
              </label>
              <textarea
                name="customer_notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Dodatne instrukcije za dostavu..."
                className="w-full px-4 py-3 sm:py-2.5 border border-[#FF6B35]/20 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none text-base min-h-[80px] bg-[#1A1A1A] text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">Način plaćanja</h3>
              <div className="p-4 border-2 border-[#FF6B35] bg-[#FF6B35]/10 rounded-lg">
                <Banknote className="h-8 w-8 mx-auto mb-2 text-[#FF6B35]" />
                <span className="block font-medium text-sm sm:text-base text-white text-center">Gotovina</span>
              </div>
            </div>

            <div className="border-t border-[#FF6B35]/20 pt-5 sm:pt-6">
              <div className="flex justify-between items-center text-lg sm:text-xl font-bold mb-5 sm:mb-6">
                <span className="text-white">Ukupno:</span>
                <span className="text-[#FF6B35]">{totalAmount.toFixed(2)} RSD</span>
              </div>
              <button
                type="submit"
                className="w-full bg-[#4CAF50] text-white py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#3d8b40] transition-colors shadow-lg hover:shadow-xl min-h-[52px] active:scale-98"
              >
                Potvrdi porudžbinu
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}