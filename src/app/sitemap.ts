// app/sitemap.ts
import { getSitemapXml } from "@/api/seoApi";
import { MetadataRoute } from "next";
import { parseStringPromise } from "xml2js";

type UrlEntry = {
  loc: [string];
  lastmod?: [string];
  changefreq?: [string];
  priority?: [string];
  'xhtml:link'?: Array<{
    $: {
      rel: string;
      hreflang: string;
      href: string;
    };
  }>;
};

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteId = '2';

  try {
    const xmlString = await getSitemapXml(siteId);

    const parsedXml = await parseStringPromise(xmlString);

    const urlset = parsedXml.urlset.url || [];

    const today = new Date();
    today.setUTCHours(2, 0, 0, 0);

    return urlset.map((urlEntry: UrlEntry) => {
      // 기본 사이트맵 항목 생성
      const sitemapEntry: MetadataRoute.Sitemap[0] = {
        url: urlEntry.loc[0],
        lastModified: urlEntry.lastmod ? new Date(urlEntry.lastmod[0]) : today,
        changeFrequency: urlEntry.changefreq
          ? (urlEntry
              .changefreq[0] as MetadataRoute.Sitemap[0]['changeFrequency'])
          : 'daily',
        priority: urlEntry.priority ? parseFloat(urlEntry.priority[0]) : 0.5,
      };

      // alternates 속성 처리
      if (urlEntry['xhtml:link'] && urlEntry['xhtml:link'].length > 0) {
        const languages: Record<string, string> = {};

        urlEntry['xhtml:link'].forEach((link) => {
          if (
            link.$ &&
            link.$.rel === 'alternate' &&
            link.$.hreflang &&
            link.$.href
          ) {
            languages[link.$.hreflang] = link.$.href;
          }
        });

        // languages 객체에 값이 있는 경우에만 alternates 추가
        if (Object.keys(languages).length > 0) {
          sitemapEntry.alternates = {
            languages,
          };
        }
      }

      return sitemapEntry;
    });
  } catch (error) {
    console.error('사이트맵 생성 오류:', error);
    return [
      {
        url: 'https://thewedding.com',
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
    ];
  }
}