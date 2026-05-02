"use client";

import { useState } from "react";

interface CheckoutButtonProps {
  priceId: string;
  label: string;
  className?: string;
}

export default function CheckoutButton({
  priceId,
  label,
  className,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading} className={className}>
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Učitavanje...
        </span>
      ) : (
        label
      )}
    </button>
  );
}
