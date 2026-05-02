"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export default function KontaktPage() {
  const t = useTranslations("contact");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f5ee]">
      {/* Header */}
      <div className="bg-[#0f1a0e] pt-12 pb-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("title")}</h1>
        <p className="text-white/60 text-lg">{t("subtitle")}</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Info */}
          <div className="md:col-span-2 bg-[#0f1a0e] rounded-3xl p-8 text-white">
            <h2 className="text-xl font-bold mb-8">Informacije</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#e8b84b]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📞</span>
                </div>
                <div>
                  <p className="text-white/50 text-xs mb-1">{t("phone")}</p>
                  <a href="tel:0998216219" className="text-white font-medium hover:text-[#e8b84b] transition-colors">
                    099 821 6219
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#e8b84b]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">✉️</span>
                </div>
                <div>
                  <p className="text-white/50 text-xs mb-1">{t("email")}</p>
                  <a href="mailto:lucija@verdihrvatska.com" className="text-white font-medium hover:text-[#e8b84b] transition-colors break-all">
                    lucija@verdihrvatska.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#e8b84b]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <p className="text-white/50 text-xs mb-1">{t("address")}</p>
                  <p className="text-white font-medium">{t("addressValue")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3 bg-white rounded-3xl p-8 shadow-sm border border-[#e8e4d9]">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                <div className="w-16 h-16 bg-[#2d6a2d]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#2d6a2d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[#0f1a0e] font-semibold text-lg">{t("formSuccess")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">
                    {t("formName")}
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full border border-[#e8e4d9] rounded-xl px-4 py-3 text-[#0f1a0e] focus:outline-none focus:ring-2 focus:ring-[#2d6a2d] focus:border-transparent transition"
                    placeholder="Ime Prezime"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">
                    {t("formEmail")}
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full border border-[#e8e4d9] rounded-xl px-4 py-3 text-[#0f1a0e] focus:outline-none focus:ring-2 focus:ring-[#2d6a2d] focus:border-transparent transition"
                    placeholder="vas@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">
                    {t("formMessage")}
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full border border-[#e8e4d9] rounded-xl px-4 py-3 text-[#0f1a0e] focus:outline-none focus:ring-2 focus:ring-[#2d6a2d] focus:border-transparent transition resize-none"
                    placeholder="Vaša poruka..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2d6a2d] hover:bg-[#3d8b3d] text-white font-semibold py-4 rounded-full transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : null}
                  {t("formSend")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
