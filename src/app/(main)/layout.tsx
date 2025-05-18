"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { City, getMainCities, getAllSubCities } from '@/api';
import classNames from 'classnames';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mainCities, setMainCities] = useState<City[]>([]);
  const [subCities, setSubCities] = useState<{ [key: number]: City[] }>({});
  const [expandedCity, setExpandedCity] = useState<number | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('');

  // 페이지가 변경될 때마다 검색어 초기화
  useEffect(() => {
    setSearchQuery('');
  }, [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 메인 도시 가져오기
        const citiesData = await getMainCities();
        setMainCities(citiesData);

        // 한 번의 API 호출로 모든 서브 카테고리 데이터를 가져옵니다
        const allSubCitiesData = await getAllSubCities();

        // 메인 도시 배열 생성 (정렬을 위해)
        const mainCitiesArray: City[] = [];
        const subCitiesData: { [key: number]: City[] } = {};

        // 응답 데이터를 순회하며 필요한 형태로 변환
        for (const [cityIdStr, cityData] of Object.entries(allSubCitiesData)) {
          const cityId = parseInt(cityIdStr);

          // 메인 도시 배열에 추가
          mainCitiesArray.push({
            id: cityId,
            name: cityData.name,
          });

          // 서브 도시 데이터 설정
          subCitiesData[cityId] = cityData.sub_cities;
        }

        setMainCities(mainCitiesArray);
        setSubCities(subCitiesData);
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMouseEnter = (cityId: number) => {
    setActiveDropdown(cityId);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleCityClick = (cityId: number) => {
    // 모바일 메뉴가 열려있으면 닫기
    setIsMenuOpen(false);
    setActiveDropdown(null);

    // 약간의 지연을 두어 메뉴 닫힘 애니메이션이 완료되도록 함
    setTimeout(() => {
      const element = document.getElementById(`city-${cityId}`);
      if (element) {
        // 헤더 높이를 디바이스에 따라 조정
        const headerOffset = window.innerWidth < 768 ? 120 : 96;

        // 모바일에서는 window.pageYOffset 대신 window.scrollY 사용
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  const handleSubCityClick = (mainCityId: number, subCityId: number) => {
    // 활성 드롭다운 닫기
    setActiveDropdown(null);
    // 모바일
    setIsMenuOpen(false);
    setExpandedCity(null);

    // 필요한 데이터 찾기
    const mainCity = mainCities.find((city) => city.id === mainCityId);
    const subCity = subCities[mainCityId]?.find(
      (city) => city.id === subCityId
    );

    if (!mainCity || !subCity) {
      console.error('카테고리 정보를 찾을 수 없습니다.');
      return;
    }

    // 서브 카테고리 페이지로 이동
    router.push(
      `/detail?main=${mainCity.name}&sub=${subCity.name}&mainName=${mainCity.name}&subName=${subCity.name}`
    );
  };

  // 검색 처리 함수
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    setSearchQuery('');
    setIsMenuOpen(false);
    if (!searchQuery.trim()) return;

    // 검색 결과 페이지로 이동
    router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleMobileMenuClick = (cityId: number) => {
    setExpandedCity(expandedCity === cityId ? null : cityId);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 w-full bg-white shadow">
        <div className="container mx-auto px-4">
          {/* 로고 섹션 */}
          <div className="flex items-center justify-start py-4">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl md:text-3xl font-bold">THEWEDDING</h1>
            </Link>
          </div>

          {/* 메뉴 섹션 */}
          <div className="flex items-center justify-between h-16 border-b relative">
            {/* 데스크탑 네비게이션 */}
            <nav className="hidden md:flex h-full items-center space-x-1 flex-shrink-0">
              {mainCities.map((city) => (
                <div
                  key={city.id}
                  className="relative h-full"
                  onMouseEnter={() => handleMouseEnter(city.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => handleCityClick(city.id)}
                    className={classNames(
                      'h-full text-sm text-gray-700 px-2  whitespace-nowrap hover:text-black',
                      activeDropdown === city.id && 'border-b-4 border-black'
                    )}
                  >
                    {city.name}
                  </button>

                  {/* 드롭다운 메뉴 */}
                  {activeDropdown === city.id && (
                    <div className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-b-md py-2 z-10">
                      {isLoading ? (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          로딩 중...
                        </div>
                      ) : subCities[city.id] &&
                        subCities[city.id].length > 0 ? (
                        subCities[city.id].map((subCity) => (
                          <button
                            key={subCity.id}
                            onClick={() =>
                              handleSubCityClick(city.id, subCity.id)
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {subCity.name}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          현재 지역에서 열리는 박람회가 없습니다
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* 모바일 메뉴 버튼 */}
            <div className="flex items-center ml-2 flex-shrink-0">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 md:hidden rounded-full hover:bg-gray-100"
                aria-label="메뉴"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* 검색창 */}
            <div className="relative hidden md:flex items-center flex-grow ml-4 md:ml-8 max-w-sm">
              <form onSubmit={handleSearch} className="w-full flex">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="박람회 이름으로 검색"
                    className="w-full py-2 px-4 pr-10 border-b-2 border-gray-200 focus:border-gray-500 focus:outline-none placeholder:text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 px-3 text-gray-600"
                    aria-label="검색"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* 모바일 메뉴 */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 px-4 space-y-2 bg-white border-t">
              <div className="relative flex items-center flex-grow md:ml-8">
                <form onSubmit={handleSearch} className="w-full flex mb-4">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="박람회 이름으로 검색"
                      className="w-full py-2 px-4 pr-10 border-b-2 border-gray-200 focus:border-gray-500 focus:outline-none placeholder:text-sm"
                    />
                    <button
                      type="submit"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 px-3 text-gray-600"
                      aria-label="검색"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>
              {mainCities.map((city) => (
                <div
                  key={city.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <button
                    onClick={() => handleMobileMenuClick(city.id)}
                    className="flex items-center justify-between w-full py-3 px-2 text-gray-700 hover:text-black"
                  >
                    <span>{city.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        expandedCity === city.id ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedCity === city.id && subCities[city.id] && (
                    <div className="pl-4 py-2 bg-gray-50">
                      {subCities[city.id].map((subCity) => (
                        <button
                          key={subCity.id}
                          onClick={() =>
                            handleSubCityClick(city.id, subCity.id)
                          }
                          className="block w-full text-left py-2 px-2 text-gray-600 hover:text-black text-sm"
                        >
                          {subCity.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-grow">{children}</main>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">마이 웨딩</h2>
            <p className="text-gray-400 text-sm">우리 결혼해요! 마이웨딩</p>
          </div>

          <div className="flex flex-wrap justify-between border-t border-gray-700 pt-6 text-xs text-gray-400">
            <div className="space-x-4">
              <Link href="/privacy" className="hover:text-white">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="hover:text-white">
                이용약관
              </Link>
              <Link href="/location" className="hover:text-white">
                유의사항
              </Link>
            </div>
            <div>Copyright © 2025. My Wedding. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}