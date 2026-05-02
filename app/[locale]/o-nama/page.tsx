import { useTranslations } from "next-intl";
import Image from "next/image";

const farmKeys = [
  "betic",
  "cabrajec",
  "lackovic",
  "milicevic",
  "novak",
  "draganicki",
] as const;

export default function ONamaPage() {
  const t = useTranslations("about");
  const tF = useTranslations("farms");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-[#0f1a0e] py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/farms/farm-3.jpg"
            alt="Verdi farma"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1a0e]/80 to-[#0f1a0e]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">{t("title")}</h1>
          <p className="text-white/60 text-lg">{t("subtitle")}</p>
        </div>
      </section>

      {/* Story */}
      <section className="verdi-section bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0f1a0e] mb-6">Naša priča</h2>
              <p className="text-[#374151] leading-relaxed text-lg mb-8">{t("story")}</p>
              <div className="bg-[#f8f5ee] rounded-2xl p-6 border-l-4 border-[#2d6a2d]">
                <p className="font-semibold text-[#2d6a2d] text-sm uppercase tracking-wide mb-2">
                  {t("mission")}
                </p>
                <p className="text-[#374151] leading-relaxed italic">"{t("missionText")}"</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src={`/images/farms/farm-${i + 4}.jpg`}
                    alt={`Farma ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#2d6a2d] py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "6", label: "OPG partnera" },
            { value: "14+", label: "Vrsta povrća" },
            { value: "12", label: "Mjeseci dostave" },
            { value: "100%", label: "Lokalno" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-4xl font-extrabold text-[#e8b84b] mb-1">{value}</div>
              <div className="text-white/70 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Farm partners */}
      <section className="verdi-section bg-[#f8f5ee]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f1a0e] mb-4">
              {t("partners")}
            </h2>
            <p className="text-[#6b7280] text-lg">{t("partnersSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmKeys.map((key, i) => (
              <div
                key={key}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e8e4d9] hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-[#2d6a2d]/10">
                  <Image
                    src={`/images/farms/farm-${(i % 8) + 1}.jpg`}
                    alt={tF(`${key}.name`)}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a0e]/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs text-white/80 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {tF(`${key}.location`)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#0f1a0e] mb-2">{tF(`${key}.name`)}</h3>
                  <p className="text-[#6b7280] text-sm leading-relaxed">{tF(`${key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
