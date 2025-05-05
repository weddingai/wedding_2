"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { searchFairs, Fair } from "@/api";
import { Calendar, MapPin } from "lucide-react";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [searchResults, setSearchResults] = useState<Fair[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await searchFairs({
          search: query,
          page: currentPage.toString(),
          size: "12",
        });

        setSearchResults(result.fairs);
        setTotalCount(result.totalCount);
        setTotalPages(parseInt(result.totalPages));
      } catch (error) {
        console.error("검색 결과를 가져오는 중 오류가 발생했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">검색 결과</h1>
      <p className="text-gray-600 mb-6">
        &ldquo;{query}&rdquo;에 대한 검색 결과 {totalCount}건
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">검색 결과가 없습니다.</p>
          <p className="text-gray-500">다른 검색어로 다시 시도해 보세요.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((fair) => (
              <Link href={`/fair/${fair.id}`} key={fair.id}>
                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    {fair.image_url ? (
                      <Image
                        src={fair.image_url}
                        alt={fair.title}
                        className="w-full h-full object-cover"
                        width={500}
                        height={300}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        이미지 없음
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="font-bold text-lg mb-2">{fair.title}</h2>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{fair.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {fair.start_date} ~ {fair.end_date}
                      </span>
                    </div>
                    <div className="mt-3 text-sm">
                      <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-gray-700">
                        {fair.type || "전시"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <nav className="inline-flex">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 border-t border-b border-gray-300 ${
                        currentPage === page
                          ? "bg-gray-800 text-white"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
