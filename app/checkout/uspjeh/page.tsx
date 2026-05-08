"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";

const t = {
  hr: {
    title: "Hvala na narudžbi!",
    sub: "Vaša pretplata je uspješno aktivirana. Dobrodošli u Verdi obitelj!",
    detail1: "Primite potvrdni e-mail s detaljima narudžbe.",
    detail2: "Prva dostava stiže za 2 tjedna.",
    detail3: "Za pitanja pišite na lucija@verdihrvatska.com.",
    btn: "Povratak na početnu",
  },
  en: {
    title: "Thank you for your order!",
    sub: "Your subscription has been successfully activated. Welcome to the Verdi family!",
    detail1: "You'll receive a confirmation email with your order details.",
    detail2: "Your first delivery arrives in 2 weeks.",
    detail3: "For questions, write to lucija@verdihrvatska.com.",
    btn: "Back to home",
  },
};

function SuccessContent() {
  const { lang } = useLang();
  const tx = t[lang];
  const params = useSearchParams();
  const called = useRef(false);

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId || called.current) return;
    called.current = true;
    fetch("/api/create-invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    }).catch(() => {});
    fetch("/api/sync-subscription", { method: "POST" }).catch(() => {});
  }, [params]);

  return (
    <>
      <Header />
      <main style={{ paddingTop: 68, background: "#faf7f0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
          <Image src="/images/logo.png" alt="Verdi" width={80} height={32} style={{ objectFit: "contain", margin: "0 auto 2rem" }} />

          <div style={{ background: "white", borderRadius: 24, padding: "3rem 2.5rem", boxShadow: "0 4px 32px rgba(28,58,40,0.1)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #1c3a28, #3a7a52)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.75rem", fontSize: 32, color: "white" }}>
              ✓
            </div>

            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "#1c3a28", marginBottom: "1rem", fontWeight: 700 }}>
              {tx.title}
            </h1>
            <p style={{ color: "#5a7a62", fontSize: 16, lineHeight: 1.7, marginBottom: "2rem" }}>
              {tx.sub}
            </p>

            <ul style={{ listStyle: "none", textAlign: "left", display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "2.5rem" }}>
              {[tx.detail1, tx.detail2, tx.detail3].map((d, i) => (
                <li key={i} style={{ display: "flex", gap: "0.75rem", fontSize: 14, color: "#4a6a52", lineHeight: 1.6 }}>
                  <span style={{ color: "#3a7a52", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {d}
                </li>
              ))}
            </ul>

            <Link href="/" style={{ display: "inline-block", background: "#3a7a52", color: "white", textDecoration: "none", padding: "0.9rem 2.5rem", borderRadius: 50, fontSize: 15, fontWeight: 600 }}>
              {tx.btn}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutUspjehPage() {
  return (
    <Suspense fallback={<div />}>
      <SuccessContent />
    </Suspense>
  );
}
