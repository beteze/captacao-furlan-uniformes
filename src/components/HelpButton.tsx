import React from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpButtonProps {
  onClick: () => void;
}

export default function HelpButton({ onClick }: HelpButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors border border-blue-200"
      title="Precisa de ajuda?"
    >
      <HelpCircle className="w-4 h-4 mr-2" />
      Preciso de ajuda
    </button>
  );
}