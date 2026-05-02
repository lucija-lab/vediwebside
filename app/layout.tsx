import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Verdi – Svježe košarice od lokalnih OPG-ova",
  description: "Verdi dostavlja košarice pune svježeg, sezonskog povrća direktno od OPG-ova – svaka 2 tjedna, cijele godine.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
