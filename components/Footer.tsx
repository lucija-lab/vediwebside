"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

const t = {
  hr: {
    tagline: "Svježe košarice direktno od naših OPG-ova, svaka 2 tjedna, cijele godine.",
    nav: "Stranice",
    links: [
      { label: "Košarice", href: "/kosarice" },
      { label: "Naše farme", href: "/#farme" },
      { label: "O nama", href: "/#o-nama" },
      { label: "Prijava", href: "/prijava" },
    ],
    legal: "Pravni dokumenti",
    legalLinks: [
      { label: "Uvjeti korištenja", href: "/uvjeti" },
      { label: "Politika privatnosti", href: "/privatnost" },
    ],
    contact: "Kontakt",
    rights: "Sva prava pridržana.",
    company: "LMB 1759 Export d.o.o.",
  },
  en: {
    tagline: "Fresh baskets directly from local farms, every 2 weeks, all year round.",
    nav: "Pages",
    links: [
      { label: "Baskets", href: "/kosarice" },
      { label: "Our farms", href: "/#farme" },
      { label: "About", href: "/#o-nama" },
      { label: "Sign in", href: "/prijava" },
    ],
    legal: "Legal",
    legalLinks: [
      { label: "Terms & Conditions", href: "/uvjeti" },
      { label: "Privacy Policy", href: "/privatnost" },
    ],
    contact: "Contact",
    rights: "All rights reserved.",
    company: "LMB 1759 Export d.o.o.",
  },
};

export default function Footer() {
  const { lang } = useLang();
  const tx = t[lang];

  return (
    <footer style={{ background: "#1c3a28", color: "#c8dfd0", padding: "4rem 1.5rem 2rem" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <Image src="/images/logo.png" alt="Verdi" width={80} height={32} style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: "#8ab09a", maxWidth: 220 }}>{tx.tagline}</p>
          </div>

          <div>
            <h4 style={headStyle}>{tx.nav}</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              {tx.links.map(l => (
                <li key={l.href}><Link href={l.href} style={footLink}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={headStyle}>{tx.legal}</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              {tx.legalLinks.map(l => (
                <li key={l.href}><Link href={l.href} style={footLink}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={headStyle}>{tx.contact}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <a href="mailto:lucija@verdihrvatska.com" style={footLink}>lucija@verdihrvatska.com</a>
              <a href="tel:0998216219" style={footLink}>099 821 6219</a>
              <p style={{ color: "#8ab09a", fontSize: 13, marginTop: "0.4rem" }}>{tx.company}</p>
              <p style={{ color: "#8ab09a", fontSize: 13 }}>OIB: 23568488873</p>
              <p style={{ color: "#8ab09a", fontSize: 13 }}>Susedgradska ulica 3, 10000 Zagreb</p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #2d5c3e", paddingTop: "1.5rem", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#5a8a6a" }}>© {new Date().getFullYear()} Verdi · {tx.rights}</p>
        </div>
      </div>
    </footer>
  );
}

const headStyle: React.CSSProperties = { fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b0d0bc", marginBottom: "1.2rem" };
const footLink: React.CSSProperties = { color: "#8ab09a", textDecoration: "none", fontSize: 15 };
