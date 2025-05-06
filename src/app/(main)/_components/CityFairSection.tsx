"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { City, Fair, getMainCategoryFairs } from "@/api";
import { FairCard } from "@/components";

interface CityFairSectionProps {
  city: City;
}

export default function CityFairSection({ city }: CityFairSectionProps) {
  const [fairs, setFairs] = useState<Fair[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastFairRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    const fetchFairs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const params = {
          main: city.name,
          sub: "",
          type: "",
          page: page.toString(),
          size: "9",
        };

        const data = await getMainCategoryFairs(params);

        if (page === 1) {
          setFairs(data.fairs);
        } else {
          setFairs((prev) => [...prev, ...data.fairs]);
        }

        setHasMore(data.fairs.length === 9);
      } catch (error) {
        console.error(`Error fetching fairs for ${city.name}:`, error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFairs();
  }, [city.name, page]);

  if (error) {
    return (
      <section id={`city-${city.id}`} className="py-16 bg-[#FAF7F2]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2 text-left">
            {city.name} 웨딩 박람회
          </h2>
          <div className="border-b-2 border-dotted border-[#CFC6B6] mb-10 w-full" />
          <div className="text-center py-8 text-gray-600">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id={`city-${city.id}`} className="py-16 bg-[#FFF8F2]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-medium mb-4 text-left text-[#493D32]">
          {city.name} 웨딩 박람회
        </h2>
        <div
          className="mb-10 w-full"
          style={{
            borderBottomWidth: 2,
            borderBottomStyle: "dashed",
            borderBottomColor: "#493D32",
            borderImage:
              "repeating-linear-gradient(to right, #493D32 0 6px, transparent 6px 12px) 100% 1",
          }}
        />
        {fairs.length === 0 && !isLoading ? (
          <div className="text-center py-10 text-[#493D32] bg-[#FFF8F2]">
            현재 예정된 웨딩 박람회가 없습니다.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fairs.map((fair, index) => (
                <div
                  key={fair.id}
                  ref={index === fairs.length - 1 ? lastFairRef : undefined}
                >
                  <FairCard fair={fair} />
                </div>
              ))}
            </div>
            {isLoading && <div className="text-center py-4">로딩 중...</div>}
          </>
        )}
      </div>
    </section>
  );
}
