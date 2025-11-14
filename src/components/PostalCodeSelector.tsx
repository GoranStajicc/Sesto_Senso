import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

// Belgrade postal codes with their neighborhoods
const BELGRADE_POSTAL_CODES = [
  { code: '11000', name: 'Akademija' },
  { code: '11070', name: 'Arena' },
  { code: '11040', name: 'Banjica' },
  { code: '11070', name: 'Banovo Brdo' },
  { code: '11030', name: 'Bele Vode' },
  { code: '11080', name: 'Bežanija' },
  { code: '11070', name: 'Blokovi' },
  { code: '11050', name: 'Braće Jerković' },
  { code: '11000', name: 'Čalije' },
  { code: '11030', name: 'Cerak' },
  { code: '11030', name: 'Čukarica' },
  { code: '11040', name: 'Dedinje' },
  { code: '11000', name: 'Dorćol' },
  { code: '11000', name: 'Dunavski kej' },
  { code: '11050', name: 'Dušanovac' },
  { code: '11030', name: 'Filmski Grad' },
  { code: '11070', name: 'Fontana' },
  { code: '11070', name: 'Gazela' },
  { code: '11158', name: 'Gornji Grad' },
  { code: '11090', name: 'Jajinci' },
  { code: '11224', name: 'Kaluđerica' },
  { code: '11000', name: 'Kalvarija' },
  { code: '11000', name: 'Kanarevo brdo' },
  { code: '11000', name: 'Karaburma' },
  { code: '11060', name: 'Konjarnik' },
  { code: '11000', name: 'Kotež' },
  { code: '11208', name: 'Krnjača' },
  { code: '11090', name: 'Kumodraž' },
  { code: '11050', name: 'Labudovo brdo' },
  { code: '11070', name: 'Ledine' },
  { code: '11050', name: 'Medaković' },
  { code: '11060', name: 'Miljakovac' },
  { code: '11000', name: 'Mirijevo' },
  { code: '11060', name: 'Mladost' },
  { code: '11000', name: 'Palilula' },
  { code: '11000', name: 'Pariske Komune' },
  { code: '11070', name: 'Paviljoni-Stari Merkator' },
  { code: '11090', name: 'Petlovo Brdo' },
  { code: '11090', name: 'Rakovica' },
  { code: '11000', name: 'Sava' },
  { code: '11000', name: 'Savski Venac' },
  { code: '11000', name: 'Savski kej' },
  { code: '11000', name: 'Senjak' },
  { code: '11000', name: 'Stari Grad' },
  { code: '11000', name: 'Stari aerodrom' },
  { code: '11080', name: 'Staro sajmište' },
  { code: '11000', name: 'Stepa Stepanović' },
  { code: '11000', name: 'Studentski Grad' },
  { code: '11070', name: 'Ušće' },
  { code: '11223', name: 'Veliki Mokri Lug' },
  { code: '11030', name: 'Vidikovac' },
  { code: '11060', name: 'Višnjička Banja' },
  { code: '11000', name: 'Voždovac' },
  { code: '11000', name: 'Vračar' },
  { code: '11030', name: 'Žarkovo' },
  { code: '11080', name: 'Zemun Centar' },
  { code: '11000', name: 'Zvezdara' }
].sort((a, b) => a.name.localeCompare(b.name, 'sr')); // Sort alphabetically by Serbian locale

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

  // Filter postal codes based on search term (search by neighborhood name or postal code)
  const filteredPostalCodes = BELGRADE_POSTAL_CODES.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.includes(searchTerm)
  );

  // Get the selected neighborhood name based on postal code
  const selectedItem = BELGRADE_POSTAL_CODES.find(item => item.code === value);
  const displayValue = selectedItem ? `${selectedItem.name} (${selectedItem.code})` : value || 'Izaberite naselje...';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle selection
  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 sm:py-2.5 border rounded-lg text-left flex items-center justify-between min-h-[48px] transition-all ${
          isOpen
            ? 'border-[#FF6B35] ring-2 ring-[#FF6B35] bg-[#1A1A1A]'
            : 'border-[#FF6B35]/20 bg-[#1A1A1A] hover:border-[#FF6B35]/40'
        } ${!value && required ? 'text-gray-500' : 'text-white'}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate text-base">{displayValue}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 flex-shrink-0 ml-2 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#1A1A1A] border border-[#FF6B35]/20 rounded-lg shadow-2xl max-h-80 flex flex-col">
          {/* Search input */}
          <div className="p-3 border-b border-[#FF6B35]/20 sticky top-0 bg-[#1A1A1A]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pretražite naselje ili poštanski broj..."
                className="w-full pl-10 pr-4 py-2 bg-[#2A2A2A] border border-[#FF6B35]/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-sm"
              />
            </div>
          </div>

          {/* Scrollable list */}
          <div className="overflow-y-auto flex-1">
            {filteredPostalCodes.length > 0 ? (
              <ul role="listbox" className="py-1">
                {filteredPostalCodes.map((item) => (
                  <li
                    key={`${item.code}-${item.name}`}
                    role="option"
                    aria-selected={item.code === value}
                    onClick={() => handleSelect(item.code)}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      item.code === value
                        ? 'bg-[#FF6B35]/20 text-[#FF6B35] font-medium'
                        : 'text-white hover:bg-[#2A2A2A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <span className={`text-xs font-mono ${
                        item.code === value ? 'text-[#FF6B35]' : 'text-gray-400'
                      }`}>
                        {item.code}
                      </span>
                    </div>
                  </li>
                ))}
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
