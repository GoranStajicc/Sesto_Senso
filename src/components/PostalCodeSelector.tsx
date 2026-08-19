import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { DELIVERY_ZONES } from '../data/deliveryZones';

interface PostalCodeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function PostalCodeSelector({ value, onChange, required = false }: PostalCodeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredZones = DELIVERY_ZONES.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayValue = value || 'Izaberite zonu dostave...';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (zoneName: string) => {
    onChange(zoneName);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={
          'w-full px-4 py-3 sm:py-2.5 border rounded-lg text-left flex items-center justify-between min-h-[48px] transition-all ' +
          (isOpen
            ? 'border-[#FF6B35] ring-2 ring-[#FF6B35] bg-[#1A1A1A]'
            : 'border-[#FF6B35]/20 bg-[#1A1A1A] hover:border-[#FF6B35]/40') +
          (!value && required ? ' text-gray-500' : ' text-white')
        }
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate text-base">{displayValue}</span>
        <ChevronDown
          className={'h-5 w-5 text-gray-400 flex-shrink-0 ml-2 transition-transform ' + (isOpen ? 'transform rotate-180' : '')}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#1A1A1A] border border-[#FF6B35]/20 rounded-lg shadow-2xl max-h-80 flex flex-col">
          <div className="p-3 border-b border-[#FF6B35]/20 sticky top-0 bg-[#1A1A1A]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pretražite zonu dostave..."
                className="w-full pl-10 pr-4 py-2 bg-[#2A2A2A] border border-[#FF6B35]/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-sm"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {filteredZones.length > 0 ? (
              <ul role="listbox" className="py-1">
                {filteredZones.map((zone) => {
                  const isSelected = zone.name === value;
                  return (
                    <li
                      key={zone.name}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(zone.name)}
                      className={
                        'px-4 py-3 cursor-pointer transition-colors ' +
                        (isSelected ? 'bg-[#FF6B35]/20 text-[#FF6B35] font-medium' : 'text-white hover:bg-[#2A2A2A]')
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{zone.name}</span>
                        <span className={'text-xs font-mono ' + (isSelected ? 'text-[#FF6B35]' : 'text-gray-400')}>
                          min {zone.minimum} RSD
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">
                Nema rezultata za "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
