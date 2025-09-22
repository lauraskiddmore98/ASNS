import Image from 'next/image'

interface SNSHeaderProps {
  subtitle?: string
}

export function SnsHeader({ subtitle }: SNSHeaderProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center justify-center">
        <Image
          src="/logo-sns.svg"
          alt="SNS Bank Logo"
          width={114}
          height={36}
          priority
        />
      </div>
      {subtitle && (
        <p className="text-orange-600 text-sm">{subtitle}</p>
      )}
    </div>
  )
}