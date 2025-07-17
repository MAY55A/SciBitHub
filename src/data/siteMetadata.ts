import type { Metadata } from "next";

export const siteMetadata: Metadata = {
  title: "SciBitHub",
  description: "A collaborative platform for research and discussions.",
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "VKAQGan9q_6iEKNQLdrPNHMacZ2_0LzQBs2hB5i88v0",
  },
  openGraph: {
    title: "SciBitHub",
    description: "Explore and contribute to research projects.",
    url: "https://sci-bit-hub.vercel.app",
    siteName: "SciBitHub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SciBitHub Banner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SciBitHub",
    description: "Collaborative research made simple.",
    images: ["/og-image.png"],
  },
};
