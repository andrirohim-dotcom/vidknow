'use client';

interface ExportFormatSelectorProps {
  onSelect: (format: 'html' | 'pdf') => void;
  disabled?: boolean;
}

export function ExportFormatSelector({ onSelect, disabled }: ExportFormatSelectorProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onSelect('html')}
        disabled={disabled}
        className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 disabled:opacity-50"
      >
        HTML
      </button>
      <button
        onClick={() => onSelect('pdf')}
        disabled={disabled}
        className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 disabled:opacity-50"
      >
        PDF
      </button>
    </div>
  );
}