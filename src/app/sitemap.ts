// app/sitemap.ts
import { getSitemapXml } from "@/api/seoApi";
import { MetadataRoute } from "next";
import { parseStringPromise } from "xml2js";

type UrlEntry = {
  loc: [string];
  lastmod?: [string];
  changefreq?: [string];
  priority?: [string];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteId = "2";

  try {
    const xmlString = await getSitemapXml(siteId);

    const parsedXml = await parseStringPromise(xmlString);
    const urlset = parsedXml.urlset.url || [];

    return urlset.map((urlEntry: UrlEntry) => ({
      url: urlEntry.loc[0],
      lastModified: urlEntry.lastmod
        ? new Date(urlEntry.lastmod[0])
        : new Date(),
      changeFrequency: urlEntry.changefreq ? urlEntry.changefreq[0] : "daily",
      priority: urlEntry.priority ? parseFloat(urlEntry.priority[0]) : 0.5,
    }));
  } catch (error) {
    console.error("사이트맵 생성 오류:", error);
    return [
      {
        url: "https://thewedding.com",
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
    ];
  }
}
