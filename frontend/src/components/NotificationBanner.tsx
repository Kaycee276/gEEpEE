import React from "react";
import { Sparkles } from "lucide-react";

interface NotificationBannerProps {
  notice: string | null;
  onClose: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notice,
  onClose,
}) => {
  if (!notice) return null;

  return (
    <div
      className="glass-panel"
      style={{
        padding: "12px 20px",
        marginBottom: "24px",
        background: "#fef9c3",
        border: "2px solid #000000",
        boxShadow: "4px 4px 0px #000000",
        color: "#000000",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "0.95rem",
          fontWeight: 700,
        }}
      >
        <Sparkles size={20} style={{ color: "#000000" }} />
        <span>{notice}</span>
      </div>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "#000000",
          cursor: "pointer",
          fontWeight: 900,
          fontSize: "1.2rem",
        }}
      >
        &times;
      </button>
    </div>
  );
};
