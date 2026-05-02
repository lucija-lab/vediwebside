import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; cancelled?: string }>;
}) {
  return <CheckoutResult searchParams={searchParams} />;
}

function CheckoutResult({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; cancelled?: string }>;
}) {
  const t = useTranslations("checkout");
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-[#f8f5ee] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center border border-[#e8e4d9]">
        <div className="w-20 h-20 bg-[#2d6a2d]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-[#2d6a2d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#0f1a0e] mb-3">{t("success_title")}</h1>
        <p className="text-[#6b7280] mb-8">{t("success_text")}</p>
        <Link
          href={locale === "hr" ? "/" : "/en/"}
          className="inline-block bg-[#2d6a2d] hover:bg-[#3d8b3d] text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
        >
          {t("back")}
        </Link>
      </div>
    </div>
  );
}
