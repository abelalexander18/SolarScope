import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { SiteHeader } from "@/components/solar/SiteHeader";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SolarScope — Solar Rooftop Potential & ROI",
  description:
    "Explore your rooftop's solar potential, estimated energy, savings, payback, and environmental impact.",
  openGraph: {
    title: "SolarScope — Know Your Roof's Solar Potential",
    description: "A beautiful solar rooftop potential and ROI planning experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
