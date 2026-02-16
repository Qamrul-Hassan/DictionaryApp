export default function BannerBookArt() {
  return (
    <svg
      viewBox="0 0 900 360"
      role="presentation"
      aria-hidden="true"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="pageFade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e9f5ff" />
          <stop offset="100%" stopColor="#d5e7f7" />
        </linearGradient>
        <linearGradient id="bookShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="glyphFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      <ellipse cx="450" cy="342" rx="214" ry="10" fill="#0f172a" opacity="0.12" />

      <g opacity="0.85">
        <path d="M450 307 L210 294 L450 200 Z" fill="url(#pageFade)" />
        <path d="M450 307 L690 294 L450 200 Z" fill="url(#pageFade)" />

        <path d="M450 307 L205 296 L450 212 Z" fill="#edf4fb" opacity="0.78" />
        <path d="M450 307 L695 296 L450 212 Z" fill="#edf4fb" opacity="0.78" />

        <path d="M450 307 C432 300 392 294 330 294 C286 294 247 297 210 302" fill="none" stroke="#c6d6e5" strokeWidth="2" />
        <path d="M450 307 C468 300 508 294 570 294 C614 294 653 297 690 302" fill="none" stroke="#c6d6e5" strokeWidth="2" />
      </g>

      <path d="M450 307 C436 298 405 294 362 294 C337 294 311 296 283 300" stroke="url(#bookShadow)" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M450 307 C464 298 495 294 538 294 C563 294 589 296 617 300" stroke="url(#bookShadow)" strokeWidth="7" strokeLinecap="round" fill="none" />

      <g fill="url(#glyphFade)" fontFamily="Georgia, Times New Roman, serif">
        <text x="432" y="236" fontSize="34" fontWeight="700" transform="rotate(-10 432 236)">a</text>
        <text x="486" y="244" fontSize="40" fontWeight="700" transform="rotate(11 486 244)">b</text>
        <text x="398" y="226" fontSize="30" transform="rotate(8 398 226)">c</text>
        <text x="515" y="220" fontSize="32" transform="rotate(-16 515 220)">d</text>
        <text x="450" y="204" fontSize="26" transform="rotate(12 450 204)">e</text>
      </g>
    </svg>
  );
}
