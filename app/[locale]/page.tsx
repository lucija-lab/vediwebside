import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";

function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const localePath = (p: string) => (locale === "hr" ? p : `/en${p}`);

  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#0f1a0e] overflow-hidden">
      {/* Background farm image */}
      <div className="absolute inset-0">
        <Image
          src="/images/farms/hero.jpg"
          alt="Verdi farma"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1a0e]/90 via-[#0f1a0e]/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-[#e8b84b]/10 border border-[#e8b84b]/30 text-[#e8b84b] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#e8b84b] rounded-full animate-pulse" />
            {t("badge")}
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            {t("title")}
          </h1>

          <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-xl">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={localePath("/kosarice")}
              className="inline-flex items-center justify-center gap-2 bg-[#e8b84b] hover:bg-[#d4a73a] text-[#0f1a0e] font-semibold px-8 py-4 rounded-full text-base transition-all duration-200 hover:shadow-lg hover:shadow-[#e8b84b]/20 hover:-translate-y-0.5"
            >
              {t("cta")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href={localePath("/o-nama")}
              className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 text-white font-medium px-8 py-4 rounded-full text-base transition-all duration-200"
            >
              {t("cta2")}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}

function WhySection() {
  const t = useTranslations("why");
  const items = [
    { icon: "🌱", titleKey: 0, descKey: 0 },
    { icon: "🤝", titleKey: 1, descKey: 1 },
    { icon: "🥦", titleKey: 2, descKey: 2 },
    { icon: "📅", titleKey: 3, descKey: 3 },
  ];

  return (
    <section className="verdi-section bg-[#f8f5ee]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1a0e] mb-4">
            {t("title")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-200 border border-[#e8e4d9]"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-[#0f1a0e] mb-2">
                {t(`items.${i}.title`)}
              </h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                {t(`items.${i}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsPreview() {
  const t = useTranslations("products");
  const locale = useLocale();
  const localePath = (p: string) => (locale === "hr" ? p : `/en${p}`);

  return (
    <section className="verdi-section bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1a0e] mb-4">
            {t("title")}
          </h2>
          <p className="text-[#6b7280] text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Taman */}
          <div className="relative rounded-3xl border-2 border-[#e8e4d9] p-8 hover:border-[#2d6a2d] transition-colors duration-300 group">
            <div className="absolute -top-3.5 left-6">
              <span className="bg-[#2d6a2d] text-white text-xs font-semibold px-3 py-1 rounded-full">
                {t("taman.tag")}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-2xl font-bold text-[#0f1a0e]">{t("taman.name")}</h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">Limitiran broj pretplata</span>
            </div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-[#2d6a2d]">{t("taman.price")}€</span>
              <span className="text-[#6b7280]">{t("taman.period")}</span>
            </div>
            <ul className="space-y-2.5 mb-8">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-[#374151]">
                  <svg className="w-4 h-4 text-[#2d6a2d] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t(`taman.features.${i}`)}
                </li>
              ))}
            </ul>
            <Link
              href={localePath("/kosarice")}
              className="block w-full text-center bg-[#2d6a2d] hover:bg-[#3d8b3d] text-white font-semibold py-3.5 rounded-full transition-colors duration-200"
            >
              {t("taman.cta")}
            </Link>
          </div>

          {/* Super */}
          <div className="relative rounded-3xl border-2 border-[#e8b84b] p-8 bg-[#0f1a0e] group">
            <div className="absolute -top-3.5 left-6">
              <span className="bg-[#e8b84b] text-[#0f1a0e] text-xs font-semibold px-3 py-1 rounded-full">
                {t("super.tag")}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-2xl font-bold text-white">{t("super.name")}</h3>
              <span className="text-xs font-semibold text-gray-400 bg-white/10 px-2 py-0.5 rounded-full whitespace-nowrap">Limitiran broj pretplata</span>
            </div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-[#e8b84b]">{t("super.price")}€</span>
              <span className="text-white/50">{t("super.period")}</span>
            </div>
            <ul className="space-y-2.5 mb-8">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-white/80">
                  <svg className="w-4 h-4 text-[#e8b84b] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t(`super.features.${i}`)}
                </li>
              ))}
            </ul>
            <Link
              href={localePath("/kosarice")}
              className="block w-full text-center bg-[#e8b84b] hover:bg-[#d4a73a] text-[#0f1a0e] font-semibold py-3.5 rounded-full transition-colors duration-200"
            >
              {t("super.cta")}
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-[#6b7280] mt-6">{t("vat")} · {t("delivery")}</p>
      </div>
    </section>
  );
}

function FarmPhotosSection() {
  return (
    <section className="verdi-section bg-[#0f1a0e] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className={`relative rounded-2xl overflow-hidden ${i === 1 || i === 5 ? "md:col-span-2 aspect-[4/3]" : "aspect-square"}`}
            >
              <Image
                src={`/images/farms/farm-${i}.jpg`}
                alt={`Verdi farma ${i}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SeasonTeaser() {
  const t = useTranslations("seasons");
  const locale = useLocale();
  const localePath = (p: string) => (locale === "hr" ? p : `/en${p}`);

  const seasons = [
    { key: "spring", color: "bg-green-100 text-green-800", dot: "bg-green-500" },
    { key: "summer", color: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-500" },
    { key: "autumn", color: "bg-orange-100 text-orange-800", dot: "bg-orange-500" },
    { key: "winter", color: "bg-blue-100 text-blue-800", dot: "bg-blue-500" },
  ] as const;

  return (
    <section className="verdi-section bg-[#f8f5ee]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1a0e] mb-4">
            {t("title")}
          </h2>
          <p className="text-[#6b7280] text-lg max-w-xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {seasons.map(({ key, color, dot }) => (
            <div key={key} className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8e4d9]">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                <span className="font-semibold text-[#0f1a0e] text-sm">{t(`${key}.name`)}</span>
              </div>
              <p className="text-xs text-[#6b7280] mb-3">{t(`${key}.months`)}</p>
              <div className="flex flex-wrap gap-1">
                {(t.raw(`${key}.items`) as string[]).slice(0, 4).map((item: string) => (
                  <span key={item} className={`text-xs px-2 py-0.5 rounded-full ${color}`}>
                    {item}
                  </span>
                ))}
                <span className="text-xs text-[#6b7280]">+{(t.raw(`${key}.items`) as string[]).length - 4}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href={localePath("/sezonalnost")}
            className="inline-flex items-center gap-2 text-[#2d6a2d] font-semibold hover:underline"
          >
            Pogledaj puni kalendar
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhySection />
      <ProductsPreview />
      <FarmPhotosSection />
      <SeasonTeaser />
    </>
  );
}
