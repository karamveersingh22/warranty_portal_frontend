import safrinaLogo from '../assets/Safrina_Logo_white_bgremove.png'

/**
 * Official Safrina Mattress logo, shared across customer and admin layouts.
 * The transparent source artwork is cropped and sized consistently by this
 * component without modifying the supplied brand asset.
 */
export function BrandMark({ className = 'h-8 w-14', rounded = 'rounded-md' }) {
  return (
    <span className={`inline-flex shrink-0 items-center overflow-hidden ${className} ${rounded}`}>
      <img
        src={safrinaLogo}
        alt="Safrina Mattress"
        className="h-full w-full object-cover object-bottom"
      />
    </span>
  )
}

export default function Brand({
  variant = 'dark', // Retained for API compatibility with existing callers.
  showTagline = true, // The official artwork already contains the tagline.
  size = 'md',
  className = '',
}) {
  const sizeClass = size === 'lg'
    ? 'h-[4.5rem] w-[12rem]'
    : size === 'sm'
      ? 'h-10 w-[6.75rem]'
      : 'h-14 w-36'

  return (
    <div
      className={`inline-flex overflow-hidden rounded-md ${sizeClass} ${className}`}
      data-variant={variant}
      data-show-tagline={showTagline}
    >
      <img
        src={safrinaLogo}
        alt="Safrina Mattress — Pamper yourself"
        className="h-full w-full object-cover object-bottom"
      />
    </div>
  )
}
