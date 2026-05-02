"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";

const t = {
  hr: {
    title: "Politika privatnosti",
    updated: "Zadnje ažuriranje: travanj 2025.",
    sections: [
      { heading: "1. Uvod", body: `LMB 1759 Export d.o.o. (Verdi) poštuje vašu privatnost i posvećena je zaštiti vaših osobnih podataka u skladu s Općom uredbom o zaštiti podataka (GDPR, Uredba EU 2016/679) i primjenjivim zakonodavstvom Republike Hrvatske.\n\nOva Politika privatnosti opisuje kako prikupljamo, koristimo i štitimo vaše osobne podatke kada koristite naše usluge.` },
      { heading: "2. Voditelj obrade podataka", body: `LMB 1759 Export d.o.o.\nZagreb, Hrvatska\nE-mail: lucija@verdihrvatska.com\nTelefon: 099 821 6219` },
      { heading: "3. Koje podatke prikupljamo", body: `Prikupljamo sljedeće osobne podatke:\n\n• Ime i prezime\n• E-mail adresa\n• Broj telefona\n• Adresa dostave\n• Podaci o plaćanju (obrađuju se isključivo putem Stripe platforme – mi nemamo pristup podacima vaše kartice)\n• Povijest narudžbi\n• Datum registracije\n\nNe prikupljamo osjetljive osobne podatke (kao što su zdravstveni podaci, politička uvjerenja i sl.).` },
      { heading: "4. Svrha i pravna osnova obrade", body: `Vaše osobne podatke obrađujemo za sljedeće svrhe:\n\n• Izvršenje ugovora – dostava košarice na vašu adresu, upravljanje pretplatom i komunikacija o narudžbama (pravna osnova: čl. 6. st. 1. t. b) GDPR)\n• Ispunjenje pravnih obveza – vođenje poslovnih knjiga i poreznih evidencija (pravna osnova: čl. 6. st. 1. t. c) GDPR)\n• Legitimni interes – poboljšanje naše usluge i sprečavanje prijevara (pravna osnova: čl. 6. st. 1. t. f) GDPR)\n• Marketing – slanje newslettera i obavijesti o ponudama, isključivo uz vaš pristanak (pravna osnova: čl. 6. st. 1. t. a) GDPR)` },
      { heading: "5. Dijeljenje podataka s trećim stranama", body: `Vaše osobne podatke dijelimo samo u sljedećim slučajevima:\n\n• Stripe Inc. – platna platforma koja obrađuje plaćanja u naše ime. Stripe ima vlastitu Politiku privatnosti dostupnu na stripe.com/privacy.\n• Partnerski OPG-ovi – isključivo u mjeri neophodnoj za organizaciju dostave (ime, adresa).\n• Tijela javne vlasti – kada to zahtijeva zakon.\n\nNe prodajemo i ne iznajmljujemo vaše osobne podatke trećim stranama u komercijalne svrhe.` },
      { heading: "6. Pohrana i sigurnost podataka", body: `Vaše podatke čuvamo onoliko dugo koliko je potrebno za ispunjenje svrhe za koju su prikupljeni, ili kako to zahtijeva zakon (npr. računovodstveni podaci 11 godina).\n\nPodatke o pretplatnicima čuvamo dok je pretplata aktivna i 2 godine nakon prestanka pretplate.\n\nPrimjenjujemo odgovarajuće tehničke i organizacijske mjere zaštite podataka, uključujući enkripciju, kontrolu pristupa i redovite sigurnosne provjere.` },
      { heading: "7. Vaša prava", body: `U skladu s GDPR-om imate sljedeća prava:\n\n• Pravo na pristup – možete zatražiti kopiju svojih osobnih podataka\n• Pravo na ispravak – možete zatražiti ispravak netočnih podataka\n• Pravo na brisanje – možete zatražiti brisanje svojih podataka ("pravo na zaborav")\n• Pravo na ograničenje obrade – možete zatražiti privremenu obustavu obrade\n• Pravo na prenosivost podataka – možete zatražiti prijenos podataka drugom voditelju\n• Pravo na prigovor – možete se usprotiviti obradi temeljnoj na legitimnom interesu\n• Pravo na povlačenje pristanka – u bilo koje vrijeme, bez utjecaja na zakonitost prethodne obrade\n\nZahtjeve šaljite na: lucija@verdihrvatska.com\n\nTakođer imate pravo podnijeti pritužbu nadzornom tijelu – Agenciji za zaštitu osobnih podataka (AZOP): www.azop.hr` },
      { heading: "8. Kolačići (Cookies)", body: `Naša web stranica koristi isključivo tehničke kolačiće neophodne za funkcioniranje stranice (sesijski kolačić za prijavu). Ne koristimo kolačiće za praćenje ili marketing bez vašeg izričitog pristanka.` },
      { heading: "9. Izmjene politike privatnosti", body: `Zadržavamo pravo izmjene ove Politike privatnosti. O bitnim izmjenama bit ćete obaviješteni e-mailom. Datum zadnjeg ažuriranja uvijek je vidljiv na vrhu stranice.` },
      { heading: "10. Kontakt", body: `Za sva pitanja vezana uz zaštitu osobnih podataka:\n\nLMB 1759 Export d.o.o.\nE-mail: lucija@verdihrvatska.com\nTelefon: 099 821 6219` },
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: April 2025.",
    sections: [
      { heading: "1. Introduction", body: `LMB 1759 Export d.o.o. (Verdi) respects your privacy and is committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR, EU Regulation 2016/679) and applicable Croatian legislation.\n\nThis Privacy Policy describes how we collect, use and protect your personal data when you use our services.` },
      { heading: "2. Data controller", body: `LMB 1759 Export d.o.o.\nZagreb, Croatia\nEmail: lucija@verdihrvatska.com\nPhone: 099 821 6219` },
      { heading: "3. What data we collect", body: `We collect the following personal data:\n\n• First and last name\n• Email address\n• Phone number\n• Delivery address\n• Payment data (processed exclusively via Stripe – we have no access to your card details)\n• Order history\n• Registration date\n\nWe do not collect sensitive personal data (such as health data, political beliefs, etc.).` },
      { heading: "4. Purpose and legal basis for processing", body: `We process your personal data for the following purposes:\n\n• Contract performance – delivering your basket, managing your subscription and communicating about orders (legal basis: Art. 6(1)(b) GDPR)\n• Legal obligations – maintaining business and tax records (legal basis: Art. 6(1)(c) GDPR)\n• Legitimate interest – improving our service and preventing fraud (legal basis: Art. 6(1)(f) GDPR)\n• Marketing – sending newsletters and promotional notifications, only with your consent (legal basis: Art. 6(1)(a) GDPR)` },
      { heading: "5. Sharing with third parties", body: `We share your personal data only in the following cases:\n\n• Stripe Inc. – payment platform processing payments on our behalf. Stripe has its own Privacy Policy available at stripe.com/privacy.\n• Partner farms – only to the extent necessary for delivery logistics (name, address).\n• Public authorities – when required by law.\n\nWe do not sell or rent your personal data to third parties for commercial purposes.` },
      { heading: "6. Data storage and security", body: `We retain your data for as long as necessary to fulfill the purpose for which it was collected, or as required by law (e.g. accounting records for 11 years).\n\nSubscriber data is retained while the subscription is active and for 2 years after the subscription ends.\n\nWe apply appropriate technical and organisational data protection measures, including encryption, access controls and regular security reviews.` },
      { heading: "7. Your rights", body: `Under GDPR you have the following rights:\n\n• Right of access – you may request a copy of your personal data\n• Right to rectification – you may request correction of inaccurate data\n• Right to erasure – you may request deletion of your data ("right to be forgotten")\n• Right to restriction – you may request temporary suspension of processing\n• Right to data portability – you may request transfer of data to another controller\n• Right to object – you may object to processing based on legitimate interest\n• Right to withdraw consent – at any time, without affecting the lawfulness of prior processing\n\nSend requests to: lucija@verdihrvatska.com\n\nYou also have the right to lodge a complaint with a supervisory authority.` },
      { heading: "8. Cookies", body: `Our website uses only technical cookies necessary for the website to function (session cookie for login). We do not use tracking or marketing cookies without your explicit consent.` },
      { heading: "9. Changes to this policy", body: `We reserve the right to amend this Privacy Policy. You will be notified of material changes by email. The date of last update is always visible at the top of this page.` },
      { heading: "10. Contact", body: `For all questions relating to personal data protection:\n\nLMB 1759 Export d.o.o.\nEmail: lucija@verdihrvatska.com\nPhone: 099 821 6219` },
    ],
  },
};

export default function PrivatnostPage() {
  const { lang } = useLang();
  const tx = t[lang];
  return (
    <>
      <Header />
      <main style={{ paddingTop: 68, background: "#faf7f0", minHeight: "100vh" }}>
        <section style={{ background: "linear-gradient(135deg, #1c3a28, #3a7a52)", padding: "4rem 1.5rem", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#faf7f0", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{tx.title}</h1>
          <p style={{ color: "rgba(250,247,240,0.7)", marginTop: "0.75rem", fontSize: 14 }}>{tx.updated}</p>
        </section>
        <section style={{ maxWidth: 780, margin: "0 auto", padding: "4rem 1.5rem" }}>
          {tx.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: "2.5rem" }}>
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 20, color: "#1c3a28", marginBottom: "0.75rem" }}>{s.heading}</h2>
              <p style={{ color: "#4a6a52", fontSize: 15, lineHeight: 1.85, whiteSpace: "pre-line" }}>{s.body}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
