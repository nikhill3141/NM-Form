import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css"
import { GlobalProviders } from "~/providers/global";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Forms that grow, try your NM Form",
  description: "Immersive form experience platform for cinematic, shareable forms.",

  icons: {
    icon: [
      {
        url: "/forest form logo darkmode.png",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "/forest form logo darkmode.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/forest form logo darkmode.png",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
