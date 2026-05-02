"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";

const t = {
  hr: {
    title: "Zaboravljena lozinka",
    sub: "Unesite e-mail adresu i poslat ćemo vam uputu za resetiranje lozinke.",
    email: "E-mail adresa",
    btn: "Pošalji uputu",
    loading: "Slanje...",
    back: "Povratak na prijavu",
    successTitle: "E-mail je poslan!",
    successMsg: "Ako postoji račun s tom adresom, primite e-mail s uputama za resetiranje lozinke. Provjerite i mapu neželjene pošte.",
    error: "Greška. Pokušajte ponovo.",
  },
  en: {
    title: "Forgot password",
    sub: "Enter your email address and we'll send you instructions to reset your password.",
    email: "Email address",
    btn: "Send instructions",
    loading: "Sending...",
    back: "Back to login",
    successTitle: "Email sent!",
    successMsg: "If an account exists with that address, you'll receive an email with password reset instructions. Check your spam folder too.",
    error: "Error. Please try again.",
  },
};

export default function ZaboravljenaLozinkaPage() {
  const { lang } = useLang();
  const tx = t[lang];

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setError(tx.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main style={{ paddingTop: 68, background: "#faf7f0", padding: "5rem 1.5rem" }}>
        <div style={{ width: "100%", maxWidth: 480, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <Image src="/images/logo.png" alt="Verdi" width={80} height={32} style={{ objectFit: "contain" }} />
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 28, color: "#1c3a28", marginTop: "1.25rem", marginBottom: "0.4rem" }}>{tx.title}</h1>
            <p style={{ color: "#5a7a62", fontSize: 15 }}>{tx.sub}</p>
          </div>

          <div style={{ background: "white", borderRadius: 20, padding: "2.5rem", boxShadow: "0 4px 24px rgba(28,58,40,0.09)" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#e8f5ee", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: 28 }}>✓</div>
                <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 22, color: "#1c3a28", marginBottom: "0.75rem" }}>{tx.successTitle}</h2>
                <p style={{ color: "#5a7a62", fontSize: 15, lineHeight: 1.7 }}>{tx.successMsg}</p>
                <Link href="/prijava" style={{ display: "inline-block", marginTop: "2rem", color: "#3a7a52", fontWeight: 600, textDecoration: "none", fontSize: 14 }}>
                  ← {tx.back}
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.25rem", color: "#dc2626", fontSize: 14 }}>
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div>
                    <label style={labelStyle}>{tx.email}</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ana@email.com"
                      style={inputStyle}
                    />
                  </div>
                  <button type="submit" disabled={loading} style={btnStyle}>
                    {loading ? tx.loading : tx.btn}
                  </button>
                </form>
                <div style={{ textAlign: "center", marginTop: "1.75rem", paddingTop: "1.75rem", borderTop: "1px solid #ede8dc" }}>
                  <Link href="/prijava" style={{ fontSize: 14, color: "#3a7a52", fontWeight: 600, textDecoration: "none" }}>
                    ← {tx.back}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "#3d2b1a", marginBottom: "0.5rem" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.8rem 1rem", border: "1.5px solid #e2d9c8", borderRadius: 10, fontSize: 15, color: "#1c3a28", background: "#faf7f0", outline: "none", boxSizing: "border-box" };
const btnStyle: React.CSSProperties = { background: "#3a7a52", color: "white", border: "none", padding: "1rem", borderRadius: 50, fontSize: 16, fontWeight: 600, cursor: "pointer", width: "100%", marginTop: "0.25rem" };
