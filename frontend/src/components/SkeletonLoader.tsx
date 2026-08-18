import React from 'react';

interface SkeletonProps {
  height?: string;
  width?: string;
  count?: number;
  style?: React.CSSProperties;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  height = '60px',
  width = '100%',
  count = 3,
  style = {}
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse-fast"
          style={{
            height,
            width,
            background: 'var(--neo-bg)',
            border: '2px solid #000000',
            boxShadow: '2px 2px 0px #000000',
            opacity: 0.7,
            ...style
          }}
        />
      ))}
    </div>
  );
};
