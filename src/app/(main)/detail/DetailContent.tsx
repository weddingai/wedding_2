"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Fair, getSubCategoryFairs } from "@/api";
import { FairCard } from "@/components";

export default function DetailContent() {
  const searchParams = useSearchParams();
  const main = searchParams.get("main") || "";
  const sub = searchParams.get("sub") || "";
  const mainName = searchParams.get("mainName") || "";
  const subName = searchParams.get("subName") || "";

  const [fairs, setFairs] = useState<Fair[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!main || !sub) {
      setError("필요한 카테고리 정보가 없습니다.");
      setIsLoading(false);
      return;
    }

    const fetchFairs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = {
          main,
          sub,
          type: "",
          page: currentPage.toString(),
          size: "9",
        };

        const data = await getSubCategoryFairs(params);
        setFairs(data.fairs);
        setTotalPages(parseInt(data.totalPages) || 1);
      } catch (error) {
        console.error("페어 데이터 로딩 중 오류 발생:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFairs();
  }, [main, sub, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 페이지네이션 렌더링 함수
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 이전 페이지 버튼
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md border disabled:opacity-50"
      >
        이전
      </button>
    );

    // 페이지 번호 버튼
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? "bg-gray-900 text-white"
              : "border hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }

    // 다음 페이지 버튼
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md border disabled:opacity-50"
      >
        다음
      </button>
    );

    return <div className="flex justify-center space-x-2 my-8">{pages}</div>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {mainName} &gt; {subName} 웨딩 박람회
      </h1>
      <p className="text-gray-600 mb-6">
        {mainName}의 {subName} 지역에서 열리는 웨딩 박람회 정보입니다.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      ) : fairs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          해당 지역에서 열리는 박람회가 없습니다.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fairs.map((fair) => (
              <FairCard key={fair.id} fair={fair} />
            ))}
          </div>

          {totalPages > 1 && renderPagination()}
        </>
      )}
    </div>
  );
}
