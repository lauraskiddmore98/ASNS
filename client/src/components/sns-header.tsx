import { useFormStore } from '@/hooks/use-form-store';

export function SnsHeader() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-10 h-10 sns-green rounded-lg flex items-center justify-center">
        <span className="text-black font-bold text-lg" data-testid="sns-logo">SNS</span>
      </div>
      <span className="font-semibold text-lg text-brand" data-testid="bank-text">Bank</span>
    </div>
  );
}
