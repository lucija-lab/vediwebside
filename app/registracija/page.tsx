"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";

const t = {
  hr: {
    title: "Registracija", sub: "Kreirajte račun i naručite svoju prvu košaricu",
    firstName: "Ime", lastName: "Prezime", email: "E-mail", phone: "Broj mobitela",
    address: "Adresa dostave", city: "Grad", password: "Lozinka", confirm: "Potvrdi lozinku",
    btn: "Kreiraj račun", loading: "Kreiranje...",
    hasAccount: "Već imate račun?", login: "Prijavite se",
    terms: "Registracijom prihvaćate naše", termsLink: "Uvjete korištenja", and: "i", privacyLink: "Politiku privatnosti",
    passMatch: "Lozinke se ne podudaraju.",
  },
  en: {
    title: "Register", sub: "Create an account and order your first basket",
    firstName: "First name", lastName: "Last name", email: "Email", phone: "Phone",
    address: "Delivery address", city: "City", password: "Password", confirm: "Confirm password",
    btn: "Create account", loading: "Creating...",
    hasAccount: "Already have an account?", login: "Sign in",
    terms: "By registering you accept our", termsLink: "Terms of service", and: "and", privacyLink: "Privacy policy",
    passMatch: "Passwords do not match.",
  },
};

function RegistracijaForm() {
  const { lang } = useLang();
  const tx = t[lang];
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/kosarice";

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError(tx.passMatch); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      router.push(redirect);
      router.refresh();
    } catch {
      setError(lang === "hr" ? "Greška. Pokušajte ponovo." : "Error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
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
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>{tx.firstName}</label>
              <input type="text" required value={form.firstName} onChange={set("firstName")} placeholder="Ana" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{tx.lastName}</label>
              <input type="text" required value={form.lastName} onChange={set("lastName")} placeholder="Kovač" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>{tx.email}</label>
            <input type="email" required value={form.email} onChange={set("email")} placeholder="ana@email.com" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{tx.phone}</label>
            <input type="tel" value={form.phone} onChange={set("phone")} placeholder="099 123 4567" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{tx.address}</label>
            <input type="text" required value={form.address} onChange={set("address")} placeholder="Ilica 10" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{tx.city}</label>
            <input type="text" required value={form.city} onChange={set("city")} placeholder="Zagreb" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{tx.password}</label>
            <input type="password" required value={form.password} onChange={set("password")} placeholder="••••••••" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{tx.confirm}</label>
            <input type="password" required value={form.confirm} onChange={set("confirm")} placeholder="••••••••" style={inputStyle} />
          </div>
          <p style={{ fontSize: 12, color: "#8a9a8a", lineHeight: 1.6 }}>
            {tx.terms}{" "}
            <Link href="/uvjeti" style={{ color: "#3a7a52" }}>{tx.termsLink}</Link>{" "}
            {tx.and}{" "}
            <Link href="/privatnost" style={{ color: "#3a7a52" }}>{tx.privacyLink}</Link>.
          </p>
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? tx.loading : tx.btn}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: "1.75rem", paddingTop: "1.75rem", borderTop: "1px solid #ede8dc" }}>
          <p style={{ fontSize: 14, color: "#8a9a8a" }}>
            {tx.hasAccount}{" "}
            <Link href="/prijava" style={{ color: "#3a7a52", fontWeight: 600, textDecoration: "none" }}>{tx.login}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegistracijaPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 68, background: "#faf7f0", padding: "5rem 1.5rem" }}>
        <Suspense fallback={<div />}>
          <RegistracijaForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "#3d2b1a", marginBottom: "0.5rem" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.8rem 1rem", border: "1.5px solid #e2d9c8", borderRadius: 10, fontSize: 15, color: "#1c3a28", background: "#faf7f0", outline: "none", boxSizing: "border-box" };
const btnStyle: React.CSSProperties = { background: "#3a7a52", color: "white", border: "none", padding: "1rem", borderRadius: 50, fontSize: 16, fontWeight: 600, cursor: "pointer", width: "100%", marginTop: "0.25rem" };
