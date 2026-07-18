import React, { useState } from 'react';
import { subjectSymbols } from '../data/symbols';

interface SymbolPaletteButtonProps {
  subject: string;
  onInsert: (symbol: string) => void;
}

export const SymbolPaletteButton: React.FC<SymbolPaletteButtonProps> = ({ subject, onInsert }) => {
  const [isOpen, setIsOpen] = useState(false);
  const symbols = subjectSymbols[subject] || subjectSymbols.Default;

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
      >
        Ω
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-2 p-2 bg-white border rounded-xl shadow-lg w-64 grid grid-cols-6 gap-1">
          {symbols.map((symbol) => (
            <button
              key={symbol}
              onClick={() => {
                onInsert(symbol);
                setIsOpen(false);
              }}
              className="p-1 text-lg hover:bg-orange-100 rounded"
            >
              {symbol}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
