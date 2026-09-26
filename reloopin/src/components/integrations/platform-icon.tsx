import {
  CreditCard,
  Terminal,
} from "lucide-react";

export function PlatformIcon({
  platform,
  size = 20,
  className = "",
}: {
  platform: string;
  size?: number;
  className?: string;
}) {
  switch (platform) {
    case "shopify":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <rect width="24" height="24" rx="5" fill="#008060" />
          <path
            d="M17.2 6.8c-.1-.2-.3-.3-.5-.3h-1.6c-.1-1.2-1.1-2.1-2.3-2.1s-2.2.9-2.3 2.1H8.9c-.2 0-.4.1-.5.3l-2.4 9.6c-.1.3 0 .7.3.9.1.1.3.1.5.1h10.4c.2 0 .4-.1.5-.1.3-.2.4-.6.3-.9l-2.4-9.6zm-4.4-1.2c.6 0 1.1.4 1.2 1H11.6c.1-.6.6-1 1.2-1zm-3.6 2.2h7.6l2.1 8.4H7.1l2.1-8.4z"
            fill="#ffffff"
          />
        </svg>
      );
    case "woocommerce":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <rect width="24" height="24" rx="5" fill="#7F54B3" />
          <path
            d="M5.5 8.5C5.5 7.7 6.1 7 7 7h10c.9 0 1.5.7 1.5 1.5v5c0 .8-.7 1.5-1.5 1.5h-1.5l-2.5 2.5-2.5-2.5H7c-.9 0-1.5-.7-1.5-1.5v-5z"
            fill="#ffffff"
          />
          <text
            x="12"
            y="12.5"
            fill="#7F54B3"
            fontSize="5.5"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            WOO
          </text>
        </svg>
      );
    case "shopify_pos":
      return (
        <div
          className={`flex items-center justify-center rounded-md bg-[#008060] text-white shrink-0 ${className}`}
          style={{ width: size, height: size }}
          aria-hidden="true"
        >
          <CreditCard size={Math.round(size * 0.65)} />
        </div>
      );
    case "clover":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <rect width="24" height="24" rx="5" fill="#1CA642" />
          <circle cx="9.5" cy="9.5" r="3" fill="#ffffff" />
          <circle cx="14.5" cy="9.5" r="3" fill="#ffffff" />
          <circle cx="9.5" cy="14.5" r="3" fill="#ffffff" />
          <circle cx="14.5" cy="14.5" r="3" fill="#ffffff" />
        </svg>
      );
    case "square":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <rect width="24" height="24" rx="5" fill="#1E1E1E" />
          <rect
            x="6"
            y="6"
            width="12"
            height="12"
            rx="2"
            stroke="#ffffff"
            strokeWidth="2.2"
          />
          <rect x="9.5" y="9.5" width="5" height="5" rx="1" fill="#ffffff" />
        </svg>
      );
    case "instagram":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f09433" />
              <stop offset="25%" stopColor="#e6683c" />
              <stop offset="50%" stopColor="#dc2743" />
              <stop offset="75%" stopColor="#cc2366" />
              <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="5" fill="url(#ig-grad)" />
          <rect
            x="5.5"
            y="5.5"
            width="13"
            height="13"
            rx="3.5"
            stroke="#ffffff"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="12" r="3.2" stroke="#ffffff" strokeWidth="1.8" />
          <circle cx="15.8" cy="8.2" r="0.9" fill="#ffffff" />
        </svg>
      );
    case "tiktok":
      return (
        <div
          className={`flex items-center justify-center rounded-md bg-black text-white shrink-0 ${className}`}
          style={{ width: size, height: size }}
          aria-hidden="true"
        >
          <span className="font-bold text-[11px] tracking-tight">TT</span>
        </div>
      );
    case "twitter":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <rect width="24" height="24" rx="5" fill="#000000" />
          <path
            d="M17.2 4.5h2.4l-5.3 6.1 6.2 8.3h-4.9l-3.8-5-4.4 5H5l5.7-6.5L4.8 4.5h5l3.5 4.6zm-.9 13h1.3L8.8 5.8H7.4z"
            fill="#ffffff"
          />
        </svg>
      );
    case "google_reviews":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <rect width="24" height="24" rx="5" fill="#4285F4" />
          <path
            d="M12 7.5c1.2 0 2.2.4 3 1.2l2.2-2.2C15.8 5.2 14 4.5 12 4.5c-3.1 0-5.7 1.8-6.9 4.4l2.7 2.1C8.4 9.1 10 7.5 12 7.5z"
            fill="#EA4335"
          />
          <path
            d="M18.8 12.3c0-.6-.1-1.1-.2-1.6H12v3.1h3.9c-.2 1-.7 1.9-1.5 2.5l2.4 2c1.4-1.3 2-3.3 2-6z"
            fill="#4285F4"
          />
          <path
            d="M7.8 11C7.6 11.5 7.5 12 7.5 12.5s.1 1 .3 1.5L5.1 16.1C4.4 15 4 13.8 4 12.5s.4-2.5 1.1-3.6L7.8 11z"
            fill="#FBBC05"
          />
          <path
            d="M12 19.5c2.1 0 3.8-.7 5.1-1.9l-2.4-2c-.7.5-1.6.8-2.7.8-2 0-3.6-1.6-4.2-3.5L5.1 15C6.3 17.7 8.9 19.5 12 19.5z"
            fill="#34A853"
          />
        </svg>
      );
    case "trustpilot":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <rect width="24" height="24" rx="5" fill="#00B67A" />
          <polygon
            points="12,5.5 14,10 19,10.5 15.5,14 16.5,19 12,16.5 7.5,19 8.5,14 5,10.5 10,10"
            fill="#ffffff"
          />
        </svg>
      );
    case "custom_api":
    default:
      return (
        <div
          className={`flex items-center justify-center rounded-md bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)] shrink-0 ${className}`}
          style={{ width: size, height: size }}
          aria-hidden="true"
        >
          <Terminal size={Math.round(size * 0.65)} />
        </div>
      );
  }
}
