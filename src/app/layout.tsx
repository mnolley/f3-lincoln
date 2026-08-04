import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "F3 Lincoln | Fitness, Fellowship, Faith",
    template: "%s | F3 Lincoln",
  },
  description:
    "Free, peer-led outdoor workouts for men in Lincoln, Nebraska. Find AOs, times, leadership, and backblasts.",
  metadataBase: new URL("https://f3lincoln.com"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gloom-deep text-ink">{children}</body>
    </html>
  );
}
