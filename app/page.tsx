"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";

const content = {
  hr: {
    heroTitle: "Svježe povrće, ravno s farme do vaših vrata",
    heroSub: "Verdi dostavlja košarice pune zdravog, sezonskog povrća direktno od OPG-ova – svaka 2 tjedna, cijele godine.",
    heroCta: "Odaberi svoju košaricu",
    whyTitle: "Zašto Verdi?",
    why: [
      { icon: "🌱", title: "Domaće i svježe", text: "Povrće se bere neposredno prije dostave, direktno od provjerenih OPG-ova iz vaše blizine." },
      { icon: "🗓️", title: "Cijele godine", text: "Dostava svaka 2 tjedna, 12 mjeseci godišnje – sa sezonskim rotacijama namirnica." },
      { icon: "🥕", title: "Raznolikost", text: "Prosječno 14+ različitih vrsta povrća i voća po košarici, svaka sadrži 6+ kultura." },
      { icon: "🤝", title: "Podržite naše", text: "S Verdi suradnjom izravno pomažete malim obiteljskim proizvođačima i lokalnoj ekonomiji." },
    ],
    basketsTitle: "Naše košarice",
    basketsSub: "Tri košarice, ista kvaliteta – odaberite ono što vam odgovara.",
    taman: { name: 'Košara "Taman"', price: "62€/mj. (uklj. PDV)", weight: "min. 7 kg", cultures: "6+ kultura", desc: "Svježe sezonsko povrće za 1–2 osobe. Dostavlja se svaka 2 tjedna, kamo i kada želite.", cta: "Naruči Taman" },
    eko: { name: 'Košara "Eko"', price: "66,50€/mj. (uklj. PDV)", weight: "~8 kg", cultures: "Eko certificirano", desc: "Ekološki certificirano povrće s OPG Novak. Svježe, prirodno, direktno s polja.", cta: "Naruči Eko" },
    super: { name: 'Košara "Super"', price: "71€/mj. (uklj. PDV)", weight: "min. 10,5 kg", cultures: "7+ kultura", desc: "Bogatija košarica za veće kućanstvo ili prave ljubitelje svježeg povrća.", cta: "Naruči Super" },
    farmsTitle: "Naši OPG partneri",
    farmsSub: "Surađujemo s obiteljskim farmama iz Zagreba i okolice. Ljudi koji s ljubavlju uzgajaju ono što jedete.",
    farms: [
      { name: "OPG Tomislav Beti", loc: "Drenje Šćitarjevsko, Zagreb", text: "Obiteljski posao s tradicijom dugom 31 godinu. Tim od 3 člana, 6 ha, 20+ kultura godišnje.", img: "/images/farms/farm-1.jpg" },
      { name: "OPG Krešimir Čabrajec", loc: "Utrine, Zagreb", text: "4 generacije na OPG-u, svježe ubrano dnevno, nešpricano, održivi uzgoj. 15–20 artikala po sezoni.", img: "/images/farms/farm-2.jpg" },
      { name: "OPG Lacković", loc: "Zetkan, Dubrava", text: "Mladi agronom Luka Lacković, 30 ha. Plastenički i vanjski uzgoj, obiteljski posao od 2009.", img: "/images/farms/farm-3.jpg" },
      { name: "OPG Miličević", loc: "Sesvete, Zagreb", text: "8 ha, fokus na održivost i kvalitetu. Sezonsko povrće + hladno prešani sokovi iz vlastitih voćnjaka.", img: "/images/farms/farm-4.jpg" },
      { name: "OPG Novak", loc: "Miroševec, Zagreb", text: "Najveće zagrebačko ekološko gospodarstvo. 50+ tona ekološki certificiranog povrća godišnje.", img: "/images/farms/farm-5.jpg" },
      { name: "OPG Draganićki Plastenici", loc: "Draganići, Karlovac", text: "Obitelj Troha, više od stoljeća u poljoprivredi. Plastenički i vanjski uzgoj, vlastite presadnice.", img: "/images/farms/farm-6.jpg" },
    ],
    reviewsTitle: "Što kažu naši kupci",
    reviews: [
      { name: "Maja K.", city: "Zagreb", text: "Nevjerojatno svježe! Od kad naručujem Verdi, prestala sam ići na tržnicu. Povrće je uvijek savršeno i raznovrsno.", stars: 5 },
      { name: "Ivan P.", city: "Zaprešić", text: "Super košarica je idealna za nas četvero. Djeca su oduševljena svježim povrćem, a mi štedimo i podupiremo lokalne.", stars: 5 },
      { name: "Ana M.", city: "Samobor", text: "Kvaliteta je neusporediva s trgovinom. Svaka dostava je iznenađenje – uvijek nešto novo i sezonsko.", stars: 5 },
      { name: "Tomislav R.", city: "Velika Gorica", text: "Odlično rješenje za užurban ritam života. Zdravo, lokalno, svježe – i dostavljeno na vrata ureda!", stars: 5 },
    ],
    ctaTitle: "Pripremi se na okus prave svježe hrane",
    ctaSub: "Pridruži se stotinama zadovoljnih kupaca koji svaka 2 tjedna dobivaju košaricu svježeg povrća.",
    ctaBtn: "Pogledaj košarice",
  },
  en: {
    heroTitle: "Fresh vegetables, straight from the farm to your door",
    heroSub: "Verdi delivers baskets full of healthy, seasonal produce directly from local farms – every 2 weeks, all year round.",
    heroCta: "Choose your basket",
    whyTitle: "Why Verdi?",
    why: [
      { icon: "🌱", title: "Local & fresh", text: "Vegetables are harvested just before delivery, directly from verified family farms nearby." },
      { icon: "🗓️", title: "All year round", text: "Delivery every 2 weeks, 12 months a year – with seasonal ingredient rotations." },
      { icon: "🥕", title: "Variety", text: "Average 14+ different types of fruit and veg per basket, each containing 6+ varieties." },
      { icon: "🤝", title: "Support locals", text: "With Verdi you directly help small family producers and strengthen the local economy." },
    ],
    basketsTitle: "Our baskets",
    basketsSub: "Three baskets, same quality – choose what suits you best.",
    taman: { name: "\"Taman\" Basket", price: "€62/mo. (incl. VAT)", weight: "min. 7 kg", cultures: "6+ varieties", desc: "Fresh seasonal vegetables for 1–2 people. Delivered every 2 weeks, wherever and whenever you want.", cta: "Order Taman" },
    eko: { name: "\"Eko\" Basket", price: "€66.50/mo. (incl. VAT)", weight: "~8 kg", cultures: "Eco certified", desc: "Certified organic produce from verified eco farms. Clean, natural, straight from the field.", cta: "Order Eko" },
    super: { name: "\"Super\" Basket", price: "€71/mo. (incl. VAT)", weight: "min. 10.5 kg", cultures: "7+ varieties", desc: "A fuller basket for larger households or true fresh produce lovers.", cta: "Order Super" },
    farmsTitle: "Our farm partners",
    farmsSub: "We work with family farms from Zagreb and the surrounding area. People who grow what you eat with love.",
    farms: [
      { name: "OPG Tomislav Beti", loc: "Drenje Šćitarjevsko, Zagreb", text: "Family business with 31 years of tradition. Team of 3, 6 ha, 20+ crops per year.", img: "/images/farms/farm-1.jpg" },
      { name: "OPG Krešimir Čabrajec", loc: "Utrine, Zagreb", text: "4 generations on the farm, daily harvested, no pesticides, sustainable growing. 15–20 items per season.", img: "/images/farms/farm-2.jpg" },
      { name: "OPG Lacković", loc: "Zetkan, Dubrava", text: "Young agronomist Luka Lacković, 30 ha. Greenhouse and open-air growing, family business since 2009.", img: "/images/farms/farm-3.jpg" },
      { name: "OPG Miličević", loc: "Sesvete, Zagreb", text: "8 ha, focus on sustainability and quality. Seasonal veg + cold-pressed juices from own orchards.", img: "/images/farms/farm-4.jpg" },
      { name: "OPG Novak", loc: "Miroševec, Zagreb", text: "Zagreb's largest organic farm. 50+ tons of certified organic produce per year.", img: "/images/farms/farm-5.jpg" },
      { name: "OPG Draganićki Plastenici", loc: "Draganići, Karlovac", text: "Troha family, over a century in farming. Greenhouse and outdoor growing, own seedlings.", img: "/images/farms/farm-6.jpg" },
    ],
    reviewsTitle: "What our customers say",
    reviews: [
      { name: "Maja K.", city: "Zagreb", text: "Incredibly fresh! Since I started ordering from Verdi, I stopped going to the market. Always perfect and varied.", stars: 5 },
      { name: "Ivan P.", city: "Zaprešić", text: "The Super basket is ideal for our family of four. The kids love the fresh vegetables and we support local too.", stars: 5 },
      { name: "Ana M.", city: "Samobor", text: "Quality is incomparable to any shop. Every delivery is a surprise – always something new and seasonal.", stars: 5 },
      { name: "Tomislav R.", city: "Velika Gorica", text: "Perfect for a busy lifestyle. Healthy, local, fresh – delivered to the office door!", stars: 5 },
    ],
    ctaTitle: "Taste the difference of truly fresh food",
    ctaSub: "Join hundreds of happy customers who receive a basket of fresh vegetables every 2 weeks.",
    ctaBtn: "View baskets",
  },
};

export default function HomePage() {
  const { lang } = useLang();
  const tx = content[lang];

  return (
    <>
      <Header />

      <main style={{ paddingTop: 68 }}>

        {/* ── HERO ── */}
        <section style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <Image src="/images/hero.jpg" alt="Verdi košarica" fill style={{ objectFit: "cover", objectPosition: "center" }} priority />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(28,58,40,0.72) 0%, rgba(28,58,40,0.35) 100%)" }} />
          <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "2rem 1.5rem", maxWidth: 720, margin: "0 auto" }}>
            <p style={{ color: "#c8dfd0", fontSize: 13, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              {lang === "hr" ? "Svježe · Lokalno · Sezonsko" : "Fresh · Local · Seasonal"}
            </p>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#faf7f0", fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "1.5rem" }}>
              {tx.heroTitle}
            </h1>
            <p style={{ color: "rgba(250,247,240,0.88)", fontSize: "clamp(1rem, 2.2vw, 1.2rem)", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: 560, margin: "0 auto 2.5rem" }}>
              {tx.heroSub}
            </p>
            <Link href="/kosarice" style={{
              display: "inline-block", background: "#3a7a52", color: "white",
              padding: "0.9rem 2.5rem", borderRadius: 50, fontSize: 16, fontWeight: 600,
              textDecoration: "none", boxShadow: "0 4px 20px rgba(58,122,82,0.4)"
            }}>
              {tx.heroCta} →
            </Link>
          </div>
        </section>

        {/* ── WHY VERDI ── */}
        <section style={{ background: "#faf7f0", padding: "6rem 1.5rem" }} id="o-nama">
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "#1c3a28", marginBottom: "1rem" }}>{tx.whyTitle}</h2>
              <div style={{ width: 48, height: 3, background: "#3a7a52", margin: "0 auto" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2.5rem" }}>
              {tx.why.map((item, i) => (
                <div key={i} style={{ textAlign: "center", padding: "2rem 1.5rem", background: "white", borderRadius: 16, boxShadow: "0 2px 20px rgba(28,58,40,0.07)" }}>
                  <div style={{ fontSize: 40, marginBottom: "1rem" }}>{item.icon}</div>
                  <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 19, color: "#1c3a28", marginBottom: "0.75rem" }}>{item.title}</h3>
                  <p style={{ color: "#5a7a62", fontSize: 15, lineHeight: 1.7 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BASKETS PREVIEW ── */}
        <section style={{ background: "#e8f0e4", padding: "6rem 1.5rem" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "#1c3a28", marginBottom: "0.75rem" }}>{tx.basketsTitle}</h2>
              <p style={{ color: "#5a7a62", fontSize: 16 }}>{tx.basketsSub}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              {/* Taman */}
              <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(28,58,40,0.1)" }}>
                <div style={{ height: 260, overflow: "hidden" }}>
                  <img src="/images/panier-taman.png" alt="Košara Taman" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                </div>
                <div style={{ padding: "1.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                    <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 22, color: "#1c3a28", margin: 0 }}>{tx.taman.name}</h3>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#888", background: "#f0f0f0", padding: "0.2rem 0.6rem", borderRadius: 20, whiteSpace: "nowrap" }}>{lang === "hr" ? "Limitiran broj pretplata" : "Limited subscriptions"}</span>
                  </div>
                  <p style={{ fontSize: 26, fontWeight: 700, color: "#3a7a52", marginBottom: "0.75rem" }}>{tx.taman.price}</p>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.9rem", flexWrap: "wrap" }}>
                    <span style={tagStyle}>{tx.taman.weight}</span>
                    <span style={tagStyle}>{tx.taman.cultures}</span>
                  </div>
                  <p style={{ color: "#5a7a62", fontSize: 14, lineHeight: 1.7, marginBottom: "1.5rem" }}>{tx.taman.desc}</p>
                  <Link href="/kosarice" style={ctaGreen}>{tx.taman.cta}</Link>
                </div>
              </div>
              {/* Eko */}
              <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(28,58,40,0.12)", position: "relative" }}>
                <div style={{ height: 260, overflow: "hidden", position: "relative" }}>
                  <img src="/images/panier-eko.png" alt="Košara Eko" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                </div>
                <div style={{ padding: "1.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                    <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 22, color: "#1c3a28", margin: 0 }}>{tx.eko.name}</h3>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#888", background: "#f0f0f0", padding: "0.2rem 0.6rem", borderRadius: 20, whiteSpace: "nowrap" }}>{lang === "hr" ? "Limitiran broj pretplata" : "Limited subscriptions"}</span>
                  </div>
                  <p style={{ fontSize: 26, fontWeight: 700, color: "#4a8a3a", marginBottom: "0.75rem" }}>{tx.eko.price}</p>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.9rem", flexWrap: "wrap" }}>
                    <span style={tagStyle}>{tx.eko.weight}</span>
                    <span style={tagStyle}>{tx.eko.cultures}</span>
                  </div>
                  <p style={{ color: "#5a7a62", fontSize: 14, lineHeight: 1.7, marginBottom: "1.5rem" }}>{tx.eko.desc}</p>
                  <Link href="/kosarice" style={ctaGreen}>{tx.eko.cta}</Link>
                </div>
              </div>
              {/* Super */}
              <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(28,58,40,0.1)" }}>
                <div style={{ height: 260, overflow: "hidden", position: "relative" }}>
                  <img src="/images/panier-super.png" alt="Košara Super" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                  <div style={{ position: "absolute", top: 14, right: 14, background: "#4a8a3a", color: "white", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", padding: "0.3rem 0.75rem", borderRadius: 20, textTransform: "uppercase" }}>
                    {lang === "hr" ? "Najpopularnije" : "Most popular"}
                  </div>
                </div>
                <div style={{ padding: "1.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                    <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 22, color: "#1c3a28", margin: 0 }}>{tx.super.name}</h3>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#888", background: "#f0f0f0", padding: "0.2rem 0.6rem", borderRadius: 20, whiteSpace: "nowrap" }}>{lang === "hr" ? "Limitiran broj pretplata" : "Limited subscriptions"}</span>
                  </div>
                  <p style={{ fontSize: 26, fontWeight: 700, color: "#3a7a52", marginBottom: "0.75rem" }}>{tx.super.price}</p>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.9rem", flexWrap: "wrap" }}>
                    <span style={tagStyle}>{tx.super.weight}</span>
                    <span style={tagStyle}>{tx.super.cultures}</span>
                  </div>
                  <p style={{ color: "#5a7a62", fontSize: 14, lineHeight: 1.7, marginBottom: "1.5rem" }}>{tx.super.desc}</p>
                  <Link href="/kosarice" style={ctaGreen}>{tx.super.cta}</Link>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <Link href="/kosarice" style={{ color: "#3a7a52", fontWeight: 600, fontSize: 15, textDecoration: "underline" }}>
                {lang === "hr" ? "Usporedi košarice i naruči →" : "Compare baskets and order →"}
              </Link>
            </div>
          </div>
        </section>

        {/* ── FARMS ── */}
        <section style={{ background: "#faf7f0", padding: "6rem 1.5rem" }} id="farme">
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "#1c3a28", marginBottom: "0.75rem" }}>{tx.farmsTitle}</h2>
              <p style={{ color: "#5a7a62", fontSize: 16, maxWidth: 560, margin: "0 auto" }}>{tx.farmsSub}</p>
              <div style={{ width: 48, height: 3, background: "#3a7a52", margin: "1.5rem auto 0" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {tx.farms.map((farm, i) => (
                <div key={i} style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(28,58,40,0.08)" }}>
                  <div style={{ height: 200, position: "relative", background: "#e8f0e4" }}>
                    <Image src={farm.img} alt={farm.name} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 18, color: "#1c3a28", marginBottom: "0.25rem" }}>{farm.name}</h3>
                    <p style={{ color: "#3a7a52", fontSize: 13, fontWeight: 600, marginBottom: "0.75rem" }}>📍 {farm.loc}</p>
                    <p style={{ color: "#5a7a62", fontSize: 14, lineHeight: 1.7 }}>{farm.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section style={{ background: "#1c3a28", padding: "6rem 1.5rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "#faf7f0", marginBottom: "0.5rem" }}>{tx.reviewsTitle}</h2>
              <div style={{ width: 48, height: 3, background: "#c8963e", margin: "1rem auto 0" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.75rem" }}>
              {tx.reviews.map((r, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "2rem", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ color: "#c8963e", fontSize: 18, marginBottom: "1rem" }}>{"★".repeat(r.stars)}</div>
                  <p style={{ color: "#d4e8db", fontSize: 15, lineHeight: 1.75, marginBottom: "1.25rem", fontStyle: "italic" }}>"{r.text}"</p>
                  <p style={{ color: "#8ab09a", fontSize: 13, fontWeight: 600 }}>{r.name} · {r.city}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{ background: "#e8f0e4", padding: "6rem 1.5rem", textAlign: "center" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "#1c3a28", marginBottom: "1rem" }}>{tx.ctaTitle}</h2>
            <p style={{ color: "#5a7a62", fontSize: 17, lineHeight: 1.7, marginBottom: "2.5rem" }}>{tx.ctaSub}</p>
            <Link href="/kosarice" style={{
              display: "inline-block", background: "#3a7a52", color: "white",
              padding: "1rem 3rem", borderRadius: 50, fontSize: 17, fontWeight: 600,
              textDecoration: "none", boxShadow: "0 4px 20px rgba(58,122,82,0.3)"
            }}>
              {tx.ctaBtn} →
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

const tagStyle: React.CSSProperties = {
  background: "#e8f0e4", color: "#3a7a52", fontSize: 12, fontWeight: 600,
  padding: "0.3rem 0.75rem", borderRadius: 20, whiteSpace: "nowrap"
};
const ctaGreen: React.CSSProperties = {
  display: "block", textAlign: "center", background: "#3a7a52", color: "white",
  padding: "0.85rem 1.5rem", borderRadius: 50, fontSize: 15, fontWeight: 600, textDecoration: "none"
};
