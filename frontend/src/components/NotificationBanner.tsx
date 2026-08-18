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
      className="neo-card"
      style={{
        padding: "14px 20px",
        marginBottom: "24px",
        background: "var(--neo-cyan-light)",
        border: "3px solid #000000",
        boxShadow: "5px 5px 0px #000000",
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
          fontSize: "1rem",
          fontWeight: 900,
        }}
      >
        <Sparkles size={22} style={{ color: "#000000" }} />
        <span>{notice}</span>
      </div>
      <button
        onClick={onClose}
        style={{
          background: "#000000",
          color: "#ffffff",
          border: "2px solid #000000",
          borderRadius: "4px",
          width: "28px",
          height: "28px",
          cursor: "pointer",
          fontWeight: 900,
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        &times;
      </button>
    </div>
  );
};
