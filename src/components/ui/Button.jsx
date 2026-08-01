import { forwardRef } from 'react'

export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className = '', ...props },
  ref
) {
  const base = 'button'
  const isPrimary = variant === 'primary'
  const variantClass = isPrimary ? 'button--primary' : 'button--secondary'
  const sizeClass = size === 'sm' ? 'button--sm' : ''

  return (
    <button
      ref={ref}
      className={`${base} ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    />
  )
})
