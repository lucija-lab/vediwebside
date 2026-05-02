import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || "hr";
  return {
    locale,
    messages: (
      await (locale === "en"
        ? import("../messages/en.json")
        : import("../messages/hr.json"))
    ).default,
  };
});
