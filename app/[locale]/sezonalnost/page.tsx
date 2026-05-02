import { useTranslations } from "next-intl";

const seasonConfig = [
  {
    key: "spring",
    color: "bg-emerald-50 border-emerald-200",
    headerBg: "bg-emerald-600",
    tagColor: "bg-emerald-100 text-emerald-800",
    icon: "🌸",
  },
  {
    key: "summer",
    color: "bg-amber-50 border-amber-200",
    headerBg: "bg-amber-500",
    tagColor: "bg-amber-100 text-amber-800",
    icon: "☀️",
  },
  {
    key: "autumn",
    color: "bg-orange-50 border-orange-200",
    headerBg: "bg-orange-600",
    tagColor: "bg-orange-100 text-orange-800",
    icon: "🍂",
  },
  {
    key: "winter",
    color: "bg-blue-50 border-blue-200",
    headerBg: "bg-blue-700",
    tagColor: "bg-blue-100 text-blue-800",
    icon: "❄️",
  },
] as const;

export default function SezonalnostPage() {
  const t = useTranslations("seasons");

  return (
    <div className="min-h-screen bg-[#f8f5ee]">
      {/* Header */}
      <div className="bg-[#0f1a0e] pt-12 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("title")}</h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">{t("subtitle")}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seasonConfig.map(({ key, color, headerBg, tagColor, icon }) => (
            <div
              key={key}
              className={`rounded-3xl border-2 overflow-hidden shadow-sm ${color}`}
            >
              <div className={`${headerBg} px-7 py-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl mb-1">{icon}</div>
                    <h2 className="text-2xl font-bold">{t(`${key}.name`)}</h2>
                    <p className="text-white/70 text-sm mt-1">{t(`${key}.months`)}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white/60 text-sm">
                      {(t.raw(`${key}.items`) as string[]).length} vrsta
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-7">
                <div className="flex flex-wrap gap-2">
                  {(t.raw(`${key}.items`) as string[]).map((item: string) => (
                    <span
                      key={item}
                      className={`text-sm px-3 py-1 rounded-full font-medium ${tagColor}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-10 bg-white rounded-2xl p-7 shadow-sm border border-[#e8e4d9] text-center">
          <p className="text-[#6b7280] text-sm leading-relaxed">
            Točan sadržaj svake košarice varira ovisno o godišnjem dobu, dostupnosti i svježini namirnica.
            Svaka košarica sadrži minimum 6 različitih kultura povrća, svježe ubranih za dostavu.
          </p>
        </div>
      </div>
    </div>
  );
}
