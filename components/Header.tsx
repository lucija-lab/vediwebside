"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

const t = {
  hr: { baskets: "Košarice", farms: "Naše farme", about: "O nama", login: "Prijava", logout: "Odjava", order: "Naruči", langBtn: "EN", hello: "Zdravo" },
  en: { baskets: "Baskets", farms: "Our farms", about: "About us", login: "Sign in", logout: "Sign out", order: "Order now", langBtn: "HR", hello: "Hello" },
};

export default function Header() {
  const { lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ firstName: string; email: string; role: string } | null>(null);
  const tx = t[lang];

  useEffect(() => {
    fetch("/api/me").then(r => r.json()).then(d => setUser(d.user)).catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: "rgba(250,247,240,0.96)", backdropFilter: "blur(10px)",
      borderBottom: "1px solid #e2d9c8",
    }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

        <Link href="/">
          <Image src="/images/logo.png" alt="Verdi" width={88} height={34} style={{ objectFit: "contain", display: "block" }} priority />
        </Link>

        <nav style={{ display: "flex", gap: "2.5rem", alignItems: "center" }} className="hdr-desktop">
          <Link href="/kosarice" style={navLink}>{tx.baskets}</Link>
          <Link href="/#farme" style={navLink}>{tx.farms}</Link>
          <Link href="/#o-nama" style={navLink}>{tx.about}</Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <a href="https://www.instagram.com/verdihrvatska?igsh=bTJpaHFhMWc4ejF3&utm_source=qr" target="_blank" rel="noopener noreferrer" style={{ color: "#3a7a52", display: "flex", alignItems: "center" }} className="hdr-desktop">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <button onClick={() => setLang(lang === "hr" ? "en" : "hr")} style={langBtnStyle}>{tx.langBtn}</button>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }} className="hdr-desktop">
              <Link href={user.role === "admin" ? "/admin" : user.role === "livreur" ? "/livreur" : "/compte"} style={{ fontSize: 14, color: "#3d2b1a", fontWeight: 500, textDecoration: "none" }}>{tx.hello}, {user.firstName}</Link>
              <button onClick={handleLogout} style={{ ...loginLink, background: "none", border: "none", cursor: "pointer", padding: 0 }}>{tx.logout}</button>
            </div>
          ) : (
            <Link href="/prijava" style={loginLink} className="hdr-desktop">{tx.login}</Link>
          )}

          <Link href="/kosarice" style={orderBtn}>{tx.order}</Link>

          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }} className="hdr-mobile" aria-label="Menu">
            <svg width="22" height="22" fill="none" stroke="#3a7a52" strokeWidth="2.2" strokeLinecap="round">
              {menuOpen ? (<><line x1="4" y1="4" x2="18" y2="18"/><line x1="18" y1="4" x2="4" y2="18"/></>) : (<><line x1="3" y1="6" x2="19" y2="6"/><line x1="3" y1="12" x2="19" y2="12"/><line x1="3" y1="18" x2="19" y2="18"/></>)}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ background: "#faf7f0", borderTop: "1px solid #e2d9c8", padding: "1.25rem 1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <Link href="/kosarice" style={mobileLink} onClick={() => setMenuOpen(false)}>{tx.baskets}</Link>
          <Link href="/#farme" style={mobileLink} onClick={() => setMenuOpen(false)}>{tx.farms}</Link>
          <Link href="/#o-nama" style={mobileLink} onClick={() => setMenuOpen(false)}>{tx.about}</Link>
          {user ? (
            <>
              <Link href={user.role === "admin" ? "/admin" : user.role === "livreur" ? "/livreur" : "/compte"} style={mobileLink} onClick={() => setMenuOpen(false)}>{lang === "hr" ? "Moj račun" : "My account"}</Link>
              <button onClick={handleLogout} style={{ ...mobileLink, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>{tx.logout}</button>
            </>
          ) : (
            <>
              <Link href="/prijava" style={mobileLink} onClick={() => setMenuOpen(false)}>{tx.login}</Link>
              <Link href="/registracija" style={mobileLink} onClick={() => setMenuOpen(false)}>{lang === "hr" ? "Registracija" : "Register"}</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) { .hdr-mobile { display: none !important; } }
        @media (max-width: 768px) { .hdr-desktop { display: none !important; } }
      `}</style>
    </header>
  );
}

const navLink: React.CSSProperties = { color: "#3a7a52", fontWeight: 500, fontSize: 15, textDecoration: "none" };
const loginLink: React.CSSProperties = { color: "#3d2b1a", fontWeight: 500, fontSize: 15, textDecoration: "none" };
const langBtnStyle: React.CSSProperties = { background: "transparent", border: "1.5px solid #3a7a52", color: "#3a7a52", borderRadius: 20, padding: "0.28rem 0.7rem", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em" };
const orderBtn: React.CSSProperties = { background: "#3a7a52", color: "white", padding: "0.48rem 1.3rem", borderRadius: 50, fontSize: 14, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" };
const mobileLink: React.CSSProperties = { color: "#3a7a52", fontWeight: 500, fontSize: 16, textDecoration: "none" };
