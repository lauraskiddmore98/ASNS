import { useFormStore } from '@/hooks/use-form-store';

export function ProgressIndicator() {
  const { currentStep } = useFormStore();

  return (
    <div className="flex items-center space-x-4" data-testid="progress-indicator">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4].map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`progress-step ${
                index < currentStep
                  ? 'completed'
                  : index === currentStep
                  ? 'active'
                  : ''
              }`}
              data-testid={`progress-step-${step}`}
            >
              {step}
            </div>
            {index < 3 && <div className="w-12 h-0.5 bg-muted"></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
