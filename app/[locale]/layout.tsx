import { redirect } from "next/navigation";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale === "en" || locale === "hr") {
    redirect("/");
  }
  return <>{children}</>;
}
