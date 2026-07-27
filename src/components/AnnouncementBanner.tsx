import { useState } from 'react';
import { X, Clock, MapPin, Truck } from 'lucide-react';

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative z-[60] bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2 sm:space-y-2.5">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 mt-0.5 flex-shrink-0" />
              <p className="font-semibold text-sm sm:text-base md:text-lg leading-snug">
                Radno vreme danas, 26.07. je do 17 časova.
              </p>
            </div>
            <div className="flex items-start gap-2.5 sm:gap-3">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 mt-0.5 flex-shrink-0" />
              <p className="font-semibold text-sm sm:text-base md:text-lg leading-snug">
                Od ponedeljka 27.07.2026. godine se nalazimo na novoj lokaciji, na Bežanijskoj Kosi.
              </p>
            </div>
            <div className="flex items-start gap-2.5 sm:gap-3">
              <Truck className="h-5 w-5 sm:h-6 sm:w-6 mt-0.5 flex-shrink-0" />
              <p className="font-semibold text-sm sm:text-base md:text-lg leading-snug">
                Proverite minimum za dostavu za svoju adresu pre poručivanja.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1.5 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Zatvori obaveštenje"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
