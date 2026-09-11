import React from 'react';

export type StatusDotVariant = 'forest' | 'amber' | 'crimson' | 'neutral';

interface StatusDotProps {
  variant?: StatusDotVariant;
  pulse?: boolean;
  size?: number;
  className?: string;
  title?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  variant = 'forest',
  pulse = false,
  size = 7,
  className = '',
  title,
}) => {
  const colorMap: Record<StatusDotVariant, string> = {
    forest: 'var(--color-forest)',
    amber: 'var(--color-amber)',
    crimson: 'var(--color-crimson)',
    neutral: 'var(--text-muted)',
  };

  return (
    <span
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: size,
        height: size,
      }}
      className={className}
    >
      <span
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: colorMap[variant],
          display: 'block',
          animation: pulse ? 'status-blink 2s infinite ease-in-out' : 'none',
        }}
      />
      <style>{`
        @keyframes status-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </span>
  );
};
