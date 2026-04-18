'use client';

import { useState } from 'react';
import { ChevronDown, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COUNTRY_CODES = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+90', country: 'TR', flag: '🇹🇷' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+20', country: 'EG', flag: '🇪🇬' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+966', country: 'SA', flag: '🇸🇦' },
  { code: '+212', country: 'MA', flag: '🇲🇦' },
  { code: '+213', country: 'DZ', flag: '🇩🇿' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}

export default function PhoneInput({ value, onChange, className = '', required = false }: PhoneInputProps) {
  // Extract code and number if value exists
  const initialCode = COUNTRY_CODES.find(c => value.startsWith(c.code))?.code || '+33';
  const initialNumber = value.startsWith(initialCode) ? value.slice(initialCode.length).trim() : value;

  const [selectedCode, setSelectedCode] = useState(initialCode);
  const [phoneNumber, setPhoneNumber] = useState(initialNumber);
  const [isOpen, setIsOpen] = useState(false);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replace(/[^\d\-\s]/g, ''); // Only allow digits, spaces, hyphens
    setPhoneNumber(num);
    onChange(`${selectedCode} ${num}`);
  };

  const handleCodeChange = (code: string) => {
    setSelectedCode(code);
    setIsOpen(false);
    onChange(`${code} ${phoneNumber}`);
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Phone Icon */}
      <Phone className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />

      {/* Country Code Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="h-full py-4 ps-11 pe-4 border border-r-0 border-gray-200 rounded-s-xl bg-gray-50 flex items-center gap-2 hover:bg-gray-100 transition-colors focus:outline-none"
        >
          <span className="text-gray-700 font-medium">{selectedCode}</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full start-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto"
              >
                {COUNTRY_CODES.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCodeChange(country.code)}
                    className="w-full text-start px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span className="font-medium text-gray-700">{country.code}</span>
                    <span className="text-sm text-gray-400 ms-auto">{country.country}</span>
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Phone Number Input */}
      <input
        type="tel"
        required={required}
        value={phoneNumber}
        onChange={handleNumberChange}
        className="flex-1 input-field !rounded-s-none !ps-4 focus:z-10 focus:ring-1 focus:ring-gold focus:border-gold border-gray-200"
        placeholder="123 456 7890"
      />
    </div>
  );
}
