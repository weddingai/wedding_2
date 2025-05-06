"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchFairs, Fair } from "@/api";
import { FairCard } from "@/components";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const type = searchParams.get("type") || "";

  const [searchResults, setSearchResults] = useState<Fair[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query && !type) {
        setIsLoading(false);
        setSearchResults([]);
        setTotalCount(0);
        setTotalPages(1);
        return;
      }

      try {
        setIsLoading(true);
        const result = await searchFairs({
          search: query,
          type: type || undefined,
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
  }, [query, type, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">검색 결과</h1>
      <p className="text-gray-600 mb-6">
        {query
          ? `"${query}"에 대한 검색 결과 ${totalCount}건`
          : type
          ? `${type} 타입의 박람회 ${totalCount}건`
          : "검색 결과가 없습니다."}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((fair) => (
              <div key={fair.id}>
                <FairCard fair={fair} />
              </div>
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
