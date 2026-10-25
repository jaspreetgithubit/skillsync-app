export default function MagneticButton({
  children,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ transform: 'none' }}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
