export function Button({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn bg-transparent text-brand-700 hover:bg-brand-50',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${variants[variant] ?? variants.primary} disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
