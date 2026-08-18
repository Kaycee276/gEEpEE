import React, { useEffect } from 'react';

interface NotificationBannerProps {
  notice: string | null;
  onClose: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({ notice, onClose }) => {
  const isCritical = Boolean(
    notice && (
      notice.toLowerCase().includes('failure') ||
      notice.toLowerCase().includes('error') ||
      notice.toLowerCase().includes('halted') ||
      notice.toLowerCase().includes('missing')
    )
  );

  useEffect(() => {
    if (!notice || isCritical) return;

    // Timed auto-dismiss after 4 seconds for normal notifications
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [notice, isCritical, onClose]);

  if (!notice) return null;

  // Timed Dropdown Toast for Normal Notifications
  if (!isCritical) {
    return (
      <div style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 9999,
        maxWidth: '380px',
        background: 'var(--neo-yellow)',
        color: '#000000',
        border: '2.5px solid #000000',
        boxShadow: '4px 4px 0px #000000',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        animation: 'slideInDown 0.2s ease-out'
      }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 900, lineHeight: 1.3 }}>
          {notice}
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#000000',
            color: '#ffffff',
            border: 'none',
            padding: '2px 6px',
            fontSize: '0.75rem',
            fontWeight: 900,
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      </div>
    );
  }

  // Sticky Click-to-Close Banner for Critical Notifications
  return (
    <div className="neo-card" style={{
      padding: '10px 14px',
      background: 'var(--neo-red-light)',
      border: '2.5px solid #000000',
      boxShadow: '3px 3px 0px #000000',
      color: '#000000',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px'
    }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 900 }}>
        ⚠️ {notice}
      </div>
      <button
        onClick={onClose}
        style={{
          background: '#000000',
          color: '#ffffff',
          border: 'none',
          padding: '4px 10px',
          cursor: 'pointer',
          fontWeight: 900,
          fontSize: '0.8rem',
          textTransform: 'uppercase'
        }}
      >
        Dismiss ✕
      </button>
    </div>
  );
};
