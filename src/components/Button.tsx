import type { ReactNode } from 'react'

export function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  ariaLabel,
  title,
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
  disabled?: boolean
  ariaLabel?: string
  title?: string
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`btn btn-${variant} ${className}`} aria-label={ariaLabel} title={title}>
      {children}
    </button>
  )
}
