import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { getPublicMetaTags, getStructuredData } from '@/api/seoApi';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-kr',
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
      verification: {
        google: meta.google_verification || undefined,
        other: meta.naver_verification
          ? {
              'naver-site-verification': meta.naver_verification,
            }
          : undefined,
      },
    };
  } catch {
    return {
      title: 'THE WEDDING - 웨딩 박람회',
      description: '다양한 웨딩 박람회 정보를 만나보세요',
      keywords: '웨딩 박람회, 결혼 박람회, 서울 웨딩, 부산 웨딩',
    };
  }
}

// 구조화 데이터 가져오기
async function getJsonLd() {
  try {
    const { structured_data } = await getStructuredData('2');
    return structured_data;
  } catch (err) {
    console.error('구조화 데이터 로딩 중 오류:', err);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 구조화 데이터 가져오기
  const structuredData = await getJsonLd();

  return (
    <html lang="ko" className={notoSansKr.variable}>
      <head>
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        )}
      </head>
      <body
        className={`min-h-screen bg-white text-gray-900 ${notoSansKr.className}`}
      >
        {children}
      </body>
    </html>
  );
}
