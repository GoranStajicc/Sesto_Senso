import { CheckCircle, Home } from 'lucide-react';

interface OrderSuccessProps {
  isOpen: boolean;
  orderNumber: string;
  onClose: () => void;
}

export default function OrderSuccess({ isOpen, orderNumber, onClose }: OrderSuccessProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#2A2A2A] rounded-xl shadow-2xl max-w-md w-full p-8 text-center border border-[#4CAF50]/30">
        <div className="mb-6">
          <CheckCircle className="h-20 w-20 text-[#4CAF50] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Hvala vam!</h2>
          <p className="text-lg text-gray-300">
            Vaša porudžbina je primljena
          </p>
        </div>

        <div className="space-y-3 text-sm text-gray-300 mb-6">
          <p>Očekivano vreme dostave je do 60 minuta.</p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#4CAF50] text-white py-3 rounded-lg font-semibold hover:bg-[#3d8b40] transition-colors flex items-center justify-center gap-2"
        >
          <Home className="h-5 w-5" />
          Nazad na početnu
        </button>
      </div>
    </div>
  );
}
