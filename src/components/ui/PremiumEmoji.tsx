'use client';

import React from 'react';

export type PremiumEmojiName =
  | 'trophy'
  | 'shield'
  | 'sparkles'
  | 'check'
  | 'warning'
  | 'pen'
  | 'lightning'
  | 'document'
  | 'image'
  | 'return'
  | 'clipboard'
  | 'lock';

export type EmojiSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface PremiumEmojiProps {
  name?: PremiumEmojiName;
  symbol?: string;
  size?: EmojiSize | number;
  variant?: 'default' | 'badge' | 'glow';
  className?: string;
  inline?: boolean;
  title?: string;
}

// Normalized mapping from standard OS Unicode emojis to custom premium icon identifiers
export const EMOJI_TO_NAME_MAP: Record<string, PremiumEmojiName> = {
  // Trophy / Winner / Judge
  '🏆': 'trophy',

  // Shield / Security / Compliance / Reviewer
  '🛡️': 'shield',
  '🛡': 'shield',

  // Sparkles / AI / Magic / 1-Click Fix
  '✨': 'sparkles',

  // Check / Approved / Verification
  '✅': 'check',
  '✔️': 'check',
  '✔': 'check',

  // Warning / Flag / Ambiguity / Alert
  '⚠️': 'warning',
  '⚠': 'warning',

  // Pen / Creator / Author / Write
  '✍️': 'pen',
  '✍': 'pen',

  // Lightning / Quick / Fast / Refine
  '⚡': 'lightning',

  // Document / Ingested Doc / Text
  '📄': 'document',
  '📑': 'document',

  // Image / Banner / Visual / Creative
  '🖼️': 'image',
  '🖼': 'image',

  // Return / Changes Requested / Rollback
  '↩️': 'return',
  '↩': 'return',

  // Clipboard / Audit Trail / Submitted for review
  '📋': 'clipboard',

  // Lock / Redaction Shield / PII Protection
  '🔒': 'lock',

  // Semantic shortcodes (:sparkles:, :check:, :shield:, etc.)
  ':trophy:': 'trophy',
  ':shield:': 'shield',
  ':sparkles:': 'sparkles',
  ':check:': 'check',
  ':warning:': 'warning',
  ':pen:': 'pen',
  ':lightning:': 'lightning',
  ':zap:': 'lightning',
  ':document:': 'document',
  ':doc:': 'document',
  ':image:': 'image',
  ':return:': 'return',
  ':clipboard:': 'clipboard',
  ':lock:': 'lock',
};

// Size translation
const SIZE_CLASSES: Record<EmojiSize, string> = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

// Custom Premium Visual SVGs designed with precision gradients, depth shadows, and crisp modern geometry
const PremiumTrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="trophy-gold" x1="4" y1="2" x2="20" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
      <linearGradient id="trophy-base" x1="6" y1="18" x2="18" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#78350F" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>
    </defs>
    {/* Base Pedestal */}
    <rect x="7" y="19" width="10" height="3" rx="1.5" fill="url(#trophy-base)" />
    <path d="M10 16H14V19H10V16Z" fill="#B45309" />
    {/* Cup Body */}
    <path
      d="M5 4C5 3.44772 5.44772 3 6 3H18C18.5523 3 19 3.44772 19 4V9C19 12.866 15.866 16 12 16C8.13401 16 5 12.866 5 9V4Z"
      fill="url(#trophy-gold)"
    />
    {/* Left Handle */}
    <path
      d="M5 6H3.5C2.67157 6 2 6.67157 2 7.5V8.5C2 10.433 3.567 12 5.5 12H6"
      stroke="#EAB308"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Right Handle */}
    <path
      d="M19 6H20.5C21.3284 6 22 6.67157 22 7.5V8.5C22 10.433 20.433 12 18.5 12H18"
      stroke="#EAB308"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Center Star Sheen */}
    <path
      d="M12 6.5L12.9 8.3L15 8.6L13.5 10L13.9 12L12 11L10.1 12L10.5 10L9 8.6L11.1 8.3L12 6.5Z"
      fill="#FEF08A"
    />
  </svg>
);

const PremiumShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="shield-grad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="50%" stopColor="#0D9488" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    <path
      d="M12 2L4 5.5V11.5C4 16.5 7.5 20.9 12 22C16.5 20.9 20 16.5 20 11.5V5.5L12 2Z"
      fill="url(#shield-grad)"
    />
    <path
      d="M12 4.2L6 6.8V11.5C6 15.3 8.6 18.8 12 19.8C15.4 18.8 18 15.3 18 11.5V6.8L12 4.2Z"
      stroke="#67E8F9"
      strokeWidth="1.2"
      strokeOpacity="0.8"
    />
    {/* Inner Lock / Check Emblem */}
    <path
      d="M9.5 11.5L11.5 13.5L15 9.5"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PremiumSparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="sparkle-grad-1" x1="4" y1="2" x2="20" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="50%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
    </defs>
    {/* Main 4-point Celestial Star */}
    <path
      d="M12 2C12 6.5 15.5 10 20 10C15.5 10 12 13.5 12 18C12 13.5 8.5 10 4 10C8.5 10 12 6.5 12 2Z"
      fill="url(#sparkle-grad-1)"
    />
    {/* Secondary Star */}
    <path
      d="M5 16C5 18 3 19 3 19C5 19 5 21 5 21C5 19 7 19 7 19C5 19 5 18 5 16Z"
      fill="#C084FC"
    />
    {/* Tertiary Small Star */}
    <path
      d="M19 4C19 5.5 17.5 6.5 17.5 6.5C19 6.5 19 8 19 8C19 6.5 20.5 6.5 20.5 6.5C19 6.5 19 5.5 19 4Z"
      fill="#38BDF8"
    />
  </svg>
);

const PremiumCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="check-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="10" fill="url(#check-grad)" />
    <path
      d="M7 12.2L10.5 15.5L17 9"
      stroke="#FFFFFF"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PremiumWarningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="warn-grad" x1="3" y1="2" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <path
      d="M10.268 3.384C11.0377 2.05067 12.9623 2.05067 13.732 3.384L21.5263 16.884C22.296 18.2173 21.3337 19.884 19.7942 19.884H4.20577C2.66632 19.884 1.70399 18.2173 2.47374 16.884L10.268 3.384Z"
      fill="url(#warn-grad)"
    />
    <path d="M12 8.5V13" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="12" cy="16.5" r="1.25" fill="#FFFFFF" />
  </svg>
);

const PremiumPenIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="pen-grad" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="50%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    {/* Barrel */}
    <path
      d="M16.5 3.5C17.3284 2.67157 18.6716 2.67157 19.5 3.5L20.5 4.5C21.3284 5.32843 21.3284 6.67157 20.5 7.5L8.5 19.5L3 21L4.5 15.5L16.5 3.5Z"
      fill="url(#pen-grad)"
    />
    {/* Nib accent */}
    <path d="M6 18L3 21L4.5 15.5" fill="#DDD6FE" />
    <path d="M15 5L19 9" stroke="#E0E7FF" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="5" cy="19" r="0.8" fill="#1E1B4B" />
  </svg>
);

const PremiumLightningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bolt-grad" x1="4" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="60%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      fill="url(#bolt-grad)"
      stroke="#B45309"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
  </svg>
);

const PremiumDocumentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="doc-grad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
    </defs>
    <path
      d="M6 2C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2H6Z"
      fill="url(#doc-grad)"
      stroke="#94A3B8"
      strokeWidth="1.2"
    />
    {/* Fold corner */}
    <path d="M14 2V8H20" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.2" />
    {/* Text lines */}
    <path d="M8 12H16" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M8 15H14" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M8 18H12" stroke="#CBD5E1" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const PremiumImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="img-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="60%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="18" height="18" rx="4" fill="url(#img-grad)" />
    {/* Sun */}
    <circle cx="8" cy="8" r="2" fill="#FDE047" />
    {/* Mountain peaks */}
    <path
      d="M4 18L10 12L14 16L17 13L20 18H4Z"
      fill="#FFFFFF"
      fillOpacity="0.85"
    />
  </svg>
);

const PremiumReturnIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="return-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#return-grad)" />
    <path
      d="M9 8L5 12M5 12L9 16M5 12H14C16.7614 12 19 14.2386 19 17V17.5"
      stroke="#FFFFFF"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PremiumClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="clip-grad" x1="4" y1="3" x2="20" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EEF2F6" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
    </defs>
    {/* Board */}
    <rect x="4" y="4" width="16" height="18" rx="2.5" fill="url(#clip-grad)" stroke="#94A3B8" strokeWidth="1.2" />
    {/* Metallic Clip */}
    <rect x="8" y="2" width="8" height="4" rx="1.5" fill="#475569" />
    {/* Checklist ticks */}
    <path d="M8 10L9.5 11.5L12 9" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.5 10.5H16.5" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 15L9.5 16.5L12 14" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.5 15.5H16.5" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const PremiumLockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="lock-body-grad" x1="4" y1="10" x2="20" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#3730A3" />
      </linearGradient>
      <linearGradient id="lock-shackle-grad" x1="6" y1="2" x2="18" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#CBD5E1" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
    </defs>
    {/* Shackle */}
    <path
      d="M7 10V6.5C7 4.01472 9.23858 2 12 2C14.7614 2 17 4.01472 17 6.5V10"
      stroke="url(#lock-shackle-grad)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Body */}
    <rect x="4" y="9" width="16" height="13" rx="3" fill="url(#lock-body-grad)" stroke="#6366F1" strokeWidth="1" />
    {/* Keyhole */}
    <circle cx="12" cy="14.5" r="1.5" fill="#F8FAFC" />
    <path d="M12 16V18.5" stroke="#F8FAFC" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ICON_COMPONENTS: Record<PremiumEmojiName, React.FC<{ className?: string }>> = {
  trophy: PremiumTrophyIcon,
  shield: PremiumShieldIcon,
  sparkles: PremiumSparklesIcon,
  check: PremiumCheckIcon,
  warning: PremiumWarningIcon,
  pen: PremiumPenIcon,
  lightning: PremiumLightningIcon,
  document: PremiumDocumentIcon,
  image: PremiumImageIcon,
  return: PremiumReturnIcon,
  clipboard: PremiumClipboardIcon,
  lock: PremiumLockIcon,
};

export const PremiumEmoji: React.FC<PremiumEmojiProps> = ({
  name,
  symbol,
  size = 'sm',
  variant = 'default',
  className = '',
  inline = true,
  title,
}) => {
  // Resolve icon name from either the name prop or the symbol prop
  let iconName: PremiumEmojiName | undefined = name;
  if (!iconName && symbol) {
    iconName = EMOJI_TO_NAME_MAP[symbol.trim()] || EMOJI_TO_NAME_MAP[symbol];
  }

  if (!iconName || !ICON_COMPONENTS[iconName]) {
    // If not found in custom set, render symbol fallback with polished font rendering
    return (
      <span
        className={`inline-block font-sans select-none ${className}`}
        style={{ verticalAlign: inline ? '-0.125em' : 'baseline' }}
        title={title}
      >
        {symbol}
      </span>
    );
  }

  const IconComp = ICON_COMPONENTS[iconName];

  const sizeClass = typeof size === 'number' ? `w-[${size}px] h-[${size}px]` : SIZE_CLASSES[size];
  const inlineStyle = typeof size === 'number' ? { width: size, height: size } : undefined;

  if (variant === 'badge') {
    return (
      <span
        className={`inline-flex items-center justify-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex-shrink-0 ${className}`}
        style={{ verticalAlign: inline ? '-0.15em' : 'baseline' }}
        title={title || iconName}
      >
        <IconComp className={`${sizeClass} flex-shrink-0 drop-shadow-xs`} />
      </span>
    );
  }

  if (variant === 'glow') {
    return (
      <span
        className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
        style={{ verticalAlign: inline ? '-0.15em' : 'baseline' }}
        title={title || iconName}
      >
        <span className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xs" />
        <IconComp className={`relative ${sizeClass} flex-shrink-0 drop-shadow-sm`} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 align-middle ${
        inline ? '-mt-0.5' : ''
      } ${className}`}
      style={{
        ...inlineStyle,
        verticalAlign: inline ? '-0.125em' : 'baseline',
      }}
      title={title || iconName}
    >
      <IconComp className={`${sizeClass} flex-shrink-0 drop-shadow-xs`} />
    </span>
  );
};

// Regex matching all recognized emojis and shortcodes that have premium visual representations
const EMOJI_PARSER_REGEX =
  /(:(?:trophy|shield|sparkles|check|warning|pen|lightning|zap|document|doc|image|return|clipboard|lock):|\uD83C\uDFC6|\uD83D\uDEE1\uFE0F|\uD83D\uDEE1|\u2728|\u2705|\u2714\uFE0F|\u2714|\u26A0\uFE0F|\u26A0|\u270D\uFE0F|\u270D|\u26A1|\uD83D\uDCC4|\uD83D\uDCD1|\uD83D\uDDBC\uFE0F|\uD83D\uDDBC|\u21A9\uFE0F|\u21A9|\uD83D\uDCCB|\uD83D\uDD12)/g;

/**
 * PremiumText Component:
 * Automatically transforms plain string text containing emojis (such as audit logs,
 * timeline remarks, or system notices) into high-fidelity custom visual icons, eliminating
 * standard OS emojis from the UI completely.
 */
export const PremiumText: React.FC<{
  text: string;
  size?: EmojiSize | number;
  className?: string;
  emojiClassName?: string;
}> = ({ text, size = 'sm', className = '', emojiClassName = 'mx-0.5' }) => {
  if (!text) return null;

  const parts = text.split(EMOJI_PARSER_REGEX);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const mappedName = EMOJI_TO_NAME_MAP[part];
        if (mappedName) {
          return (
            <PremiumEmoji
              key={index}
              name={mappedName}
              size={size}
              className={emojiClassName}
              inline
            />
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
};

export default PremiumEmoji;
