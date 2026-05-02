"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";

const t = {
  hr: { title: "Prijava", sub: "Dobrodošli natrag", email: "E-mail adresa", password: "Lozinka", forgot: "Zaboravili ste lozinku?", btn: "Prijavi se", loading: "Prijava...", noAccount: "Nemate račun?", register: "Registrirajte se" },
  en: { title: "Sign in", sub: "Welcome back", email: "Email address", password: "Password", forgot: "Forgot your password?", btn: "Sign in", loading: "Signing in...", noAccount: "Don't have an account?", register: "Register" },
};

function PrijavaForm() {
  const { lang } = useLang();
  const tx = t[lang];
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      const role = data.user?.role || "client";
      const dest = role === "admin" ? "/admin" : role === "livreur" ? "/livreur" : (redirect !== "/" ? redirect : "/compte");
      router.push(dest);
      router.refresh();
    } catch {
      setError(lang === "hr" ? "Greška. Pokušajte ponovo." : "Error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 440 }}>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <Image src="/images/logo.png" alt="Verdi" width={80} height={32} style={{ objectFit: "contain" }} />
        <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 30, color: "#1c3a28", marginTop: "1.25rem", marginBottom: "0.4rem" }}>{tx.title}</h1>
        <p style={{ color: "#5a7a62", fontSize: 15 }}>{tx.sub}</p>
      </div>

      <div style={{ background: "white", borderRadius: 20, padding: "2.5rem", boxShadow: "0 4px 24px rgba(28,58,40,0.09)" }}>
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.25rem", color: "#dc2626", fontSize: 14 }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={labelStyle}>{tx.email}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="ana@email.com" style={inputStyle} />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>{tx.password}</label>
              <Link href="/zaboravljena-lozinka" style={{ fontSize: 13, color: "#3a7a52", textDecoration: "none" }}>{tx.forgot}</Link>
            </div>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
          </div>
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? tx.loading : tx.btn}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: "1.75rem", paddingTop: "1.75rem", borderTop: "1px solid #ede8dc" }}>
          <p style={{ fontSize: 14, color: "#8a9a8a" }}>
            {tx.noAccount}{" "}
            <Link href={`/registracija${redirect !== "/" ? `?redirect=${redirect}` : ""}`} style={{ color: "#3a7a52", fontWeight: 600, textDecoration: "none" }}>{tx.register}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PrijavaPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 68, minHeight: "100vh", background: "#faf7f0", display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 1.5rem" }}>
        <Suspense fallback={<div />}>
          <PrijavaForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "#3d2b1a", marginBottom: "0.5rem" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.85rem 1rem", border: "1.5px solid #e2d9c8", borderRadius: 10, fontSize: 15, color: "#1c3a28", background: "#faf7f0", outline: "none", boxSizing: "border-box" };
const btnStyle: React.CSSProperties = { background: "#3a7a52", color: "white", border: "none", padding: "1rem", borderRadius: 50, fontSize: 16, fontWeight: 600, cursor: "pointer", width: "100%", marginTop: "0.5rem" };
