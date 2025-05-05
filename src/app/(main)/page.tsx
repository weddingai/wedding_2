"use client";

import { useEffect, useState } from "react";
import { City, getMainCities } from "@/api";
import Banner from "./_components/Banner";
import CityFairSection from "./_components/CityFairSection";

export default function Home() {
  const [mainCities, setMainCities] = useState<City[]>([]);

  useEffect(() => {
    const fetchMainCities = async () => {
      try {
        const citiesData = await getMainCities();
        setMainCities(citiesData);
      } catch (error) {
        console.error("Error fetching main cities:", error);
      }
    };

    fetchMainCities();
  }, []);

  return (
    <div>
      {/* 배너 슬라이더 섹션 */}
      <Banner />

      {/* 도시별 웨딩 박람회 섹션 */}
      {mainCities.map((city) => (
        <CityFairSection key={city.id} city={city} />
      ))}
    </div>
  );
}
