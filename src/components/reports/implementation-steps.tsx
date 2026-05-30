'use client';

import type { ImplementationStep } from '@/types';

interface ImplementationStepsProps {
  steps: ImplementationStep[];
}

export function ImplementationSteps({ steps }: ImplementationStepsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Implementation Steps</h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex gap-4"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-medium">
              {step.step}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-lg mb-1">{step.title}</h3>
              <p className="text-gray-600 mb-2">{step.description}</p>
              {step.expected_outcome && (
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="text-sm text-green-800">
                    <strong>Expected Outcome:</strong> {step.expected_outcome}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}