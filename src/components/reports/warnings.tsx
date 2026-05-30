'use client';

interface WarningsProps {
  warnings: string[];
}

export function Warnings({ warnings }: WarningsProps) {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h3 className="font-semibold mb-3 text-yellow-800">⚠️ Important Warnings</h3>
      <ul className="space-y-2">
        {warnings.map((warning, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-yellow-700"
          >
            <span className="text-yellow-500 mt-1">•</span>
            <span>{warning}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}