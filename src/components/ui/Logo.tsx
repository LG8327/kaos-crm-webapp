import React from 'react'
import Image from 'next/image'

interface LogoProps {
  className?: string
  variant?: 'full' | 'icon' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Logo: React.FC<LogoProps> = ({ 
  className = '',
  variant = 'full',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: variant === 'icon' ? 'w-6 h-6' : 'h-6',
    md: variant === 'icon' ? 'w-8 h-8' : 'h-8',
    lg: variant === 'icon' ? 'w-10 h-10' : 'h-10',
    xl: variant === 'icon' ? 'w-16 h-16' : 'h-16'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  }

  const logoSizes = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 64
  }

  if (variant === 'icon') {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <Image 
          src="/kaos-logo.svg" 
          alt="KAOS CRM" 
          width={logoSizes[size]} 
          height={logoSizes[size]}
          className="w-full h-full"
        />
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <span className={`font-bold text-white ${textSizes[size]} ${className}`}>
        KAOS CRM
      </span>
    )
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={sizeClasses[size]}>
        <Image 
          src="/kaos-logo.svg" 
          alt="KAOS CRM" 
          width={logoSizes[size]} 
          height={logoSizes[size]}
          className="w-full h-full"
        />
      </div>
      <span className={`font-bold text-white ${textSizes[size]}`}>
        KAOS CRM
      </span>
    </div>
  )
}

export default Logo
