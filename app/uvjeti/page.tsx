"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LanguageContext";

const t = {
  hr: {
    title: "Opći uvjeti korištenja",
    updated: "Zadnje ažuriranje: travanj 2025.",
    sections: [
      { heading: "1. Opće odredbe", body: `Ovi Opći uvjeti korištenja (dalje: Uvjeti) uređuju prava i obveze između tvrtke LMB 1759 Export d.o.o. (dalje: Verdi) i korisnika koji naručuju uslugu dostave košarica s povrćem putem web stranice verdihrvatska.com.\n\nKorištenjem web stranice i naručivanjem naših proizvoda suglasni ste s ovim Uvjetima u cijelosti. Ako se ne slažete s bilo kojim dijelom ovih Uvjeta, molimo vas da ne koristite našu uslugu.` },
      { heading: "2. Opis usluge", body: `Verdi pruža uslugu pretplatničke dostave košarica s lokalnim, sezonskim povrćem i voćem, ubrana direktno od partnerskih OPG-ova iz Zagreba i okolice. Dostava se vrši svaka dva (2) tjedna, dvanaest (12) mjeseci u godini.\n\nNude se dvije vrste košarica:\n• Košara "Taman" – minimalno 7 kg povrća, 6+ kultura, cijena 59 € mesečno\n• Košara "Super" – minimalno 10,5 kg povrća, 7+ kultura, cijena 71 € mesečno\n\nSastav košarice mijenja se sezonski i nije moguće unaprijed garantirati točan sadržaj svake pojedine dostave.` },
      { heading: "3. Naručivanje i plaćanje", body: `Narudžba se vrši putem web stranice odabirom željene košarice i završetkom procesa plaćanja. Plaćanje se obrađuje putem sigurne platforme Stripe. Prihvaćamo sve glavne kreditne i debitne kartice.\n\nCijena pretplate naplaćuje se unaprijed za svaki mjesec. Verdi zadržava pravo izmjene cijena uz prethodno obavještavanje pretplatnika od najmanje 14 dana.\n\nIznos pretplate može biti sufinanciran od strane poslodavca kao employee benefit. Za više informacija kontaktirajte nas na lucija@verdihrvatska.com.` },
      { heading: "4. Dostava", body: `Dostava se vrši svaka 2 tjedna na adresu koju je korisnik naveo pri registraciji. Korisnik može promijeniti adresu dostave ili preskočiti isporuku uz obavijest najmanje 3 dana prije planiranog termina dostave.\n\nVerdi nije odgovoran za kašnjenja uzrokovana višom silom, vremenskim neprilikama ili okolnostima izvan naše kontrole. U slučaju neuspjele dostave, korisnik će biti kontaktiran radi dogovora o ponovnoj dostavi ili kompenzaciji.` },
      { heading: "5. Otkaz pretplate", body: `Pretplatu možete otkazati u bilo koje vrijeme. Otkaz stupa na snagu po isteku tekućeg naplatnog perioda. Za otkaz pošaljite e-mail na lucija@verdihrvatska.com ili kontaktirajte nas telefonski.\n\nNema ugovornih obveza – ne tražimo minimalni period pretplate. Ne naplaćujemo naknade za raskid ugovora.` },
      { heading: "6. Reklamacije i povrati", body: `Ukoliko niste zadovoljni kvalitetom isporučene košarice, molimo vas da nas kontaktirate unutar 24 sata od dostave na lucija@verdihrvatska.com ili na broj 099 821 6219. Opisat ćete problem i prema mogućnosti priložiti fotografiju.\n\nVerdi se obvezuje riješiti svaku reklamaciju u razumnom roku, bilo putem zamjene, popusta na sljedeću dostavu ili povrata sredstava, prema dogovoru s korisnikom.` },
      { heading: "7. Zaštita osobnih podataka", body: `Prikupljanje i obrada osobnih podataka uređena je našom Politikom privatnosti koja je sastavni dio ovih Uvjeta. Vaše podatke koristimo isključivo za izvršenje usluge dostave i komunikaciju s vama.\n\nVaši podaci neće biti dijeljeni s trećim stranama osim u mjeri neophodnoj za izvršenje narudžbe (npr. platna platforma Stripe).` },
      { heading: "8. Izmjene uvjeta", body: `Verdi zadržava pravo izmjene ovih Uvjeta. O svim bitnim izmjenama korisnici će biti obaviješteni e-mailom najmanje 14 dana unaprijed. Nastavak korištenja usluge nakon stupanja na snagu izmjena smatrat će se prihvaćanjem novih Uvjeta.` },
      { heading: "9. Mjerodavno pravo", body: `Na ove Uvjete primjenjuje se pravo Republike Hrvatske. Svi sporovi koji bi mogli nastati iz ili u svezi s ovim Uvjetima rješavat će se pred nadležnim sudom u Zagrebu.` },
      { heading: "10. Kontakt", body: `Za sva pitanja vezana uz ove Uvjete možete nas kontaktirati:\n\nLMB 1759 Export d.o.o.\nE-mail: lucija@verdihrvatska.com\nTelefon: 099 821 6219` },
    ],
  },
  en: {
    title: "General Terms and Conditions",
    updated: "Last updated: April 2025.",
    sections: [
      { heading: "1. General provisions", body: `These General Terms and Conditions (hereinafter: Terms) govern the rights and obligations between LMB 1759 Export d.o.o. (hereinafter: Verdi) and users who order vegetable basket delivery services through the website verdihrvatska.com.\n\nBy using the website and ordering our products, you agree to these Terms in full. If you do not agree with any part of these Terms, please do not use our service.` },
      { heading: "2. Service description", body: `Verdi provides a subscription delivery service for baskets of local, seasonal vegetables and fruit, harvested directly from partner farms in and around Zagreb. Delivery takes place every two (2) weeks, twelve (12) months a year.\n\nTwo types of baskets are available:\n• "Taman" Basket – minimum 7 kg of produce, 6+ varieties, price €59/month\n• "Super" Basket – minimum 10.5 kg of produce, 7+ varieties, price €71/month\n\nThe basket contents change seasonally and the exact content of each individual delivery cannot be guaranteed in advance.` },
      { heading: "3. Ordering and payment", body: `Orders are placed via the website by selecting the desired basket and completing the payment process. Payments are processed through the secure Stripe platform. We accept all major credit and debit cards.\n\nThe subscription price is charged in advance for each month. Verdi reserves the right to change prices with at least 14 days' prior notice to subscribers.\n\nThe subscription amount may be co-funded by an employer as an employee benefit. For more information, contact us at lucija@verdihrvatska.com.` },
      { heading: "4. Delivery", body: `Delivery takes place every 2 weeks to the address provided by the user during registration. Users can change their delivery address or skip a delivery with at least 3 days' notice before the scheduled delivery date.\n\nVerdi is not responsible for delays caused by force majeure, weather conditions or circumstances beyond our control. In case of failed delivery, the user will be contacted to arrange re-delivery or compensation.` },
      { heading: "5. Cancellation", body: `You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. To cancel, send an email to lucija@verdihrvatska.com or contact us by phone.\n\nThere are no contractual obligations – we do not require a minimum subscription period. We do not charge cancellation fees.` },
      { heading: "6. Complaints and returns", body: `If you are not satisfied with the quality of a delivered basket, please contact us within 24 hours of delivery at lucija@verdihrvatska.com or on 099 821 6219. Describe the issue and where possible attach a photo.\n\nVerdi commits to resolving every complaint within a reasonable time, either through replacement, a discount on the next delivery, or a refund, as agreed with the user.` },
      { heading: "7. Personal data protection", body: `The collection and processing of personal data is governed by our Privacy Policy, which forms an integral part of these Terms. We use your data solely to fulfill the delivery service and communicate with you.\n\nYour data will not be shared with third parties except to the extent necessary to fulfill your order (e.g. the Stripe payment platform).` },
      { heading: "8. Changes to terms", body: `Verdi reserves the right to amend these Terms. Users will be notified of any material changes by email at least 14 days in advance. Continued use of the service after the changes take effect will be deemed acceptance of the new Terms.` },
      { heading: "9. Governing law", body: `These Terms are governed by the law of the Republic of Croatia. All disputes arising from or in connection with these Terms shall be resolved before the competent court in Zagreb.` },
      { heading: "10. Contact", body: `For any questions relating to these Terms, you can contact us:\n\nLMB 1759 Export d.o.o.\nEmail: lucija@verdihrvatska.com\nPhone: 099 821 6219` },
    ],
  },
};

export default function UvjetiPage() {
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
