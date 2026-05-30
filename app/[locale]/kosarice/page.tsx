import { useTranslations } from "next-intl";
import CheckoutButton from "@/components/CheckoutButton";

const PRICE_TAMAN = process.env.STRIPE_PRICE_TAMAN!;
const PRICE_SUPER = process.env.STRIPE_PRICE_SUPER!;

function FeatureCheck({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <li className={`flex items-start gap-3 text-sm ${dark ? "text-white/80" : "text-[#374151]"}`}>
      <svg
        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${dark ? "text-[#e8b84b]" : "text-[#2d6a2d]"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      {text}
    </li>
  );
}

export default function KosariceePage() {
  const t = useTranslations("products");

  const tamanFeatures = Array.from({ length: 7 }, (_, i) =>
    t(`taman.features.${i}`)
  );
  const superFeatures = Array.from({ length: 7 }, (_, i) =>
    t(`super.features.${i}`)
  );

  return (
    <div className="min-h-screen bg-[#f8f5ee]">
      {/* Header */}
      <div className="bg-[#0f1a0e] pt-12 pb-20 px-4 text-center">
        <span className="inline-block bg-[#e8b84b]/10 border border-[#e8b84b]/30 text-[#e8b84b] text-sm px-4 py-1 rounded-full mb-4">
          {t("delivery")}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t("title")}
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Taman */}
          <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-[#e8e4d9]">
            <div className="absolute top-6 left-6">
              <span className="bg-[#2d6a2d] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                {t("taman.tag")}
              </span>
            </div>
            <div className="h-3 bg-[#2d6a2d]" />
            <div className="p-8 pt-14">
              <h2 className="text-2xl font-bold text-[#0f1a0e] mb-2">{t("taman.name")}</h2>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-extrabold text-[#2d6a2d]">{t("taman.price")}€</span>
                <span className="text-[#6b7280] text-lg">{t("taman.period")}</span>
              </div>
              <p className="text-xs text-[#6b7280] mb-8">{t("vat")}</p>

              <ul className="space-y-3 mb-10">
                {tamanFeatures.map((f) => (
                  <FeatureCheck key={f} text={f} />
                ))}
              </ul>

              <CheckoutButton
                priceId={PRICE_TAMAN}
                label={t("taman.cta")}
                className="w-full bg-[#2d6a2d] hover:bg-[#3d8b3d] text-white font-semibold py-4 rounded-full text-base transition-colors duration-200 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Super */}
          <div className="relative bg-[#0f1a0e] rounded-3xl shadow-xl overflow-hidden">
            <div className="absolute top-6 left-6">
              <span className="bg-[#e8b84b] text-[#0f1a0e] text-xs font-semibold px-3 py-1.5 rounded-full">
                {t("super.tag")}
              </span>
            </div>
            <div className="h-3 bg-[#e8b84b]" />
            <div className="p-8 pt-14">
              <h2 className="text-2xl font-bold text-white mb-2">{t("super.name")}</h2>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-extrabold text-[#e8b84b]">{t("super.price")}€</span>
                <span className="text-white/50 text-lg">{t("super.period")}</span>
              </div>
              <p className="text-xs text-white/40 mb-8">{t("vat")}</p>

              <ul className="space-y-3 mb-10">
                {superFeatures.map((f) => (
                  <FeatureCheck key={f} text={f} dark />
                ))}
              </ul>

              <CheckoutButton
                priceId={PRICE_SUPER}
                label={t("super.cta")}
                className="w-full bg-[#e8b84b] hover:bg-[#d4a73a] text-[#0f1a0e] font-semibold py-4 rounded-full text-base transition-colors duration-200 disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* FAQ / Trust section */}
        <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm border border-[#e8e4d9]">
          <h3 className="text-xl font-bold text-[#0f1a0e] mb-6">Često postavljana pitanja</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "Kako se vrši dostava?",
                a: "Dostavljamo na kućnu adresu ili adresu tvrtke, po Vašem izboru.",
              },
              {
                q: "Mogu li otkazati pretplatu?",
                a: "Da, pretplatu možete otkazati u bilo kojem trenutku bez naknada.",
              },
              {
                q: "Što ako nisam zadovoljan/na?",
                a: "Javite nam se i riješit ćemo svaki problem. Vaše zadovoljstvo nam je prioritet.",
              },
              {
                q: "Plaćanje je sigurno?",
                a: "Plaćanje se vrši putem Stripea, jednog od najsigurnijih sustava za online plaćanje.",
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <p className="font-semibold text-[#0f1a0e] text-sm mb-1">{q}</p>
                <p className="text-[#6b7280] text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

