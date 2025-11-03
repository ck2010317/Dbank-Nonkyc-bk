export function DbankLogo({
  className = "w-8 h-8",
  textClassName = "text-2xl",
}: { className?: string; textClassName?: string }) {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Card shape */}
        <rect
          x="10"
          y="25"
          width="80"
          height="50"
          rx="8"
          fill="url(#gradient1)"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Chip */}
        <rect x="20" y="35" width="15" height="12" rx="2" fill="currentColor" opacity="0.8" />

        {/* Card lines */}
        <line x1="20" y1="55" x2="50" y2="55" stroke="currentColor" strokeWidth="2" opacity="0.6" />
        <line x1="20" y1="62" x2="40" y2="62" stroke="currentColor" strokeWidth="2" opacity="0.6" />

        {/* D letter integrated */}
        <path d="M 60 40 L 60 60 Q 75 60 75 50 Q 75 40 60 40 Z" fill="currentColor" opacity="0.9" />

        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
      <span className={`font-bold tracking-tight ${textClassName}`}>dbank</span>
    </div>
  )
}
