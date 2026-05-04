"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";

const content = {
  hr: {
    title: "Odaberite svoju košaricu",
    sub: "Svježe, sezonsko povrće od lokalnih OPG-ova — dostava svaka 2 tjedna, cijele godine.",
    popular: "Najpopularnije",
    taman: {
      name: "Košara Taman",
      price: "62",
      period: "mj.",
      desc: "Idealno za 1–2 osobe. Svježe ubrano sezonsko povrće direktno od provjerenih obiteljskih farmi.",
      cta: "Naruči Taman košaricu",
      features: ["min. 7 kg svježeg povrća", "6+ različitih kultura", "Dostava svaka 2 tjedna", "Cijele godine, 12 mjeseci", "Kućna adresa ili adresa tvrtke", "Sufinanciranje od strane firme"],
    },
    eko: {
      name: "Košara Eko",
      price: "66,50",
      period: "mj.",
      desc: "Ekološki uzgojena sezona. Odabir povrća iz certificiranih eko OPG-ova — čisto, prirodno, direktno s polja.",
      cta: "Naruči Eko košaricu",
      features: ["Eko certificirano povrće", "Sezonski odabir kultura", "Dostava svaka 2 tjedna", "Cijele godine, 12 mjeseci", "Kućna adresa ili adresa tvrtke", "Sufinanciranje od strane firme"],
    },
    super: {
      name: "Košara Super",
      price: "71",
      period: "mj.",
      desc: "Za veće obitelji ili prave ljubitelje svježeg povrća. Više kultura, veće količine, ista visoka kvaliteta.",
      cta: "Naruči Super košaricu",
      features: ["min. 10,5 kg svježeg povrća", "7+ različitih kultura", "Dostava svaka 2 tjedna", "Cijele godine, 12 mjeseci", "Kućna adresa ili adresa tvrtke", "Sufinanciranje od strane firme"],
    },
    compare: "Usporedi košarice",
    compLabel: ["", "Taman", "Eko", "Super"],
    compRows: [
      ["Težina po dostavi", "min. 7 kg", "~8 kg", "min. 10,5 kg"],
      ["Ekološki certifikat", "—", "✓", "—"],
      ["Broj kultura", "6+", "6+", "7+"],
      ["Dostava", "svaka 2 tjedna", "svaka 2 tjedna", "svaka 2 tjedna"],
      ["Cijena/mj.", "62€", "66,50€", "71€"],
    ],
    faqTitle: "Često postavljana pitanja",
    faqs: [
      { q: "Kako funkcionira dostava?", a: "Dostavljamo svaka 2 tjedna na adresu po vašem izboru – kućna adresa ili adresa tvrtke." },
      { q: "Što ako sam odsutan?", a: "Možete promijeniti adresu ili preskočiti dostavu uz najavu 3 dana unaprijed." },
      { q: "Može li tvrtka platiti pretplatu?", a: "Da! Iznos pretplate prihvaćamo kao employee benefit." },
      { q: "Mogu li otkazati pretplatu?", a: "Da, u bilo kojem trenutku bez naknade, uz 14 dana otkaznog roka." },
      { q: "Je li Eko povrće certificirano?", a: "Da, Eko košarica sadrži povrće od certificiranih eko OPG-ova koji primjenjuju standarde ekološke proizvodnje." },
    ],
    loading: "Učitavanje...",
  },
  en: {
    title: "Choose your basket",
    sub: "Fresh, seasonal produce from local family farms — delivered every 2 weeks, all year round.",
    popular: "Most popular",
    taman: {
      name: "Taman Basket",
      price: "62",
      period: "mo.",
      desc: "Ideal for 1–2 people. Freshly harvested seasonal vegetables directly from verified family farms.",
      cta: "Order Taman basket",
      features: ["min. 7 kg fresh produce", "6+ different varieties", "Delivery every 2 weeks", "All year, 12 months", "Home or office address", "Corporate co-funding accepted"],
    },
    eko: {
      name: "Eko Basket",
      price: "66.50",
      period: "mo.",
      desc: "Certified organic season. Vegetables from certified eco farms — clean, natural, straight from the field.",
      cta: "Order Eko basket",
      features: ["Certified organic produce", "Seasonal variety selection", "Delivery every 2 weeks", "All year, 12 months", "Home or office address", "Corporate co-funding accepted"],
    },
    super: {
      name: "Super Basket",
      price: "71",
      period: "mo.",
      desc: "For larger families or true fresh produce lovers. More varieties, bigger quantities, same high quality.",
      cta: "Order Super basket",
      features: ["min. 10.5 kg fresh produce", "7+ different varieties", "Delivery every 2 weeks", "All year, 12 months", "Home or office address", "Corporate co-funding accepted"],
    },
    compare: "Compare baskets",
    compLabel: ["", "Taman", "Eko", "Super"],
    compRows: [
      ["Weight per delivery", "min. 7 kg", "~8 kg", "min. 10.5 kg"],
      ["Organic certified", "—", "✓", "—"],
      ["Varieties", "6+", "6+", "7+"],
      ["Delivery", "every 2 weeks", "every 2 weeks", "every 2 weeks"],
      ["Price/mo.", "€62", "€66.50", "€71"],
    ],
    faqTitle: "Frequently asked questions",
    faqs: [
      { q: "How does delivery work?", a: "We deliver every 2 weeks to the address of your choice – home or office." },
      { q: "What if I'm away?", a: "You can change the address or skip a delivery with 3 days notice." },
      { q: "Can my company pay?", a: "Yes! We accept the subscription as an employee benefit." },
      { q: "Can I cancel?", a: "Yes, at any time with no fee, with a 14-day notice period." },
      { q: "Is the Eko produce certified?", a: "Yes, the Eko basket contains produce from certified organic farms." },
    ],
    loading: "Loading...",
  },
};

const PRICE_KEYS = {
  taman: process.env.NEXT_PUBLIC_STRIPE_PRICE_TAMAN,
  eko: process.env.NEXT_PUBLIC_STRIPE_PRICE_EKO,
  super: process.env.NEXT_PUBLIC_STRIPE_PRICE_SUPER,
};

export default function KosaricePage() {
  const { lang } = useLang();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const tx = content[lang];

  const handleCheckout = async (key: "taman" | "eko" | "super") => {
    const meRes = await fetch("/api/me");
    const meData = await meRes.json();
    if (!meData.user) { router.push(`/registracija?redirect=/kosarice`); return; }

    setLoading(key);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: PRICE_KEYS[key] }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setLoading(null);
    }
  };

  const baskets = [
    {
      key: "taman" as const,
      data: tx.taman,
      image: "/images/panier-taman.png",
      dark: false,
      badge: false,
      btnColor: "#3a7a52",
      priceColor: "#3a7a52",
    },
    {
      key: "eko" as const,
      data: tx.eko,
      image: "/images/panier-eko.png",
      dark: false,
      badge: false,
      btnColor: "#4a8a3a",
      priceColor: "#4a8a3a",
    },
    {
      key: "super" as const,
      data: tx.super,
      image: "/images/panier-super.png",
      dark: true,
      badge: true,
      btnColor: "#c8963e",
      priceColor: "#c8ddc0",
    },
  ];

  return (
    <>
      <Header />
      <main style={{ paddingTop: 68, background: "#faf7f0", minHeight: "100vh" }}>

        {/* Hero */}
        <section style={{ background: "linear-gradient(135deg, #1c3a28 0%, #3a7a52 100%)", padding: "5rem 1.5rem", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#faf7f0", fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 700, marginBottom: "1rem" }}>{tx.title}</h1>
          <p style={{ color: "rgba(250,247,240,0.8)", fontSize: "clamp(1rem, 2vw, 1.15rem)", maxWidth: 560, margin: "0 auto" }}>{tx.sub}</p>
        </section>

        {/* Cards */}
        <section style={{ padding: "5rem 1.5rem" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "1.75rem" }}>
            {baskets.map(({ key, data, image, dark, badge, btnColor, priceColor }) => (
              <div key={key} style={{ background: dark ? "#1c3a28" : "white", borderRadius: 24, overflow: "hidden", boxShadow: dark ? "0 8px 32px rgba(28,58,40,0.2)" : "0 4px 24px rgba(28,58,40,0.09)", display: "flex", flexDirection: "column", position: "relative" }}>
                <div style={{ height: 280, overflow: "hidden", position: "relative" }}>
                  <img src={image} alt={data.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                  {badge && (
                    <div style={{ position: "absolute", top: 16, right: 16, background: "#4a8a3a", color: "white", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", padding: "0.3rem 0.8rem", borderRadius: 20, textTransform: "uppercase" }}>
                      {tx.popular}
                    </div>
                  )}
                </div>
                <div style={{ padding: "2rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 24, color: dark ? "#faf7f0" : "#1c3a28", marginBottom: "0.5rem" }}>{data.name}</h2>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "1.25rem" }}>
                    <span style={{ fontSize: 38, fontWeight: 700, color: priceColor }}>{data.price}€</span>
                    <span style={{ color: dark ? "#6a9a7a" : "#8a9a8a", fontSize: 14 }}>/{data.period}</span>
                    <span style={{ color: dark ? "#6a9a7a" : "#8a9a8a", fontSize: 12, marginLeft: "0.4rem" }}>{lang === "hr" ? "(uklj. PDV)" : "(incl. VAT)"}</span>
                  </div>
                  <p style={{ color: dark ? "#9abfa8" : "#5a7a62", fontSize: 14, lineHeight: 1.75, marginBottom: "1.5rem", flex: 1 }}>{data.desc}</p>
                  <ul style={{ listStyle: "none", marginBottom: "1.75rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {data.features.map((f, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: 13, color: dark ? "#c8ddc0" : "#3d2b1a" }}>
                        <span style={{ color: btnColor, fontWeight: 700, fontSize: 15, flexShrink: 0 }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleCheckout(key)}
                    disabled={loading !== null}
                    style={{ background: btnColor, color: "white", border: "none", padding: "0.9rem", borderRadius: 50, fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%", opacity: loading ? 0.7 : 1 }}
                  >
                    {loading === key ? tx.loading : data.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section style={{ padding: "0 1.5rem 5rem" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 26, color: "#1c3a28", textAlign: "center", marginBottom: "2rem" }}>{tx.compare}</h2>
            <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(28,58,40,0.08)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#e8f0e4" }}>
                    {tx.compLabel.map((l, i) => (
                      <th key={i} style={{ padding: "1rem 1rem", textAlign: i === 0 ? "left" : "center", fontSize: 13, fontWeight: 700, color: "#1c3a28" }}>{l}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tx.compRows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f0ede5" }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: "0.8rem 1rem", fontSize: 13, color: j === 0 ? "#5a7a62" : "#1c3a28", textAlign: j === 0 ? "left" : "center", fontWeight: j === 2 ? 600 : 400 }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "0 1.5rem 6rem" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 26, color: "#1c3a28", textAlign: "center", marginBottom: "2.5rem" }}>{tx.faqTitle}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {tx.faqs.map((faq, i) => (
                <div key={i} style={{ background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 8px rgba(28,58,40,0.07)" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", textAlign: "left", padding: "1.25rem 1.5rem", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 15, fontWeight: 600, color: "#1c3a28" }}>
                    {faq.q}
                    <span style={{ color: "#3a7a52", fontSize: 20, fontWeight: 400, marginLeft: "1rem", flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && <div style={{ padding: "0 1.5rem 1.25rem", fontSize: 14, color: "#5a7a62", lineHeight: 1.75 }}>{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
