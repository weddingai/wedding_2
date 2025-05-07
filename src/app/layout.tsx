import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { getPublicMetaTags } from "@/api/seoApi";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
});

// 동적 메타데이터 생성
export async function generateMetadata(): Promise<Metadata> {
  try {
    const meta = await getPublicMetaTags(2);
    return {
      title: meta.meta_title,
      description: meta.meta_description,
      keywords: meta.keywords,
      openGraph: {
        title: meta.og_title,
        description: meta.og_description,
        images: meta.og_image ? [meta.og_image] : [],
        url: meta.og_url,
      },
    };
  } catch {
    return {
      title: "THE WEDDING - 웨딩 박람회",
      description: "다양한 웨딩 박람회 정보를 만나보세요",
      keywords: "웨딩 박람회, 결혼 박람회, 서울 웨딩, 부산 웨딩",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body
        className={`min-h-screen bg-white text-gray-900 ${notoSansKr.className}`}
      >
        {children}
      </body>
    </html>
  );
}