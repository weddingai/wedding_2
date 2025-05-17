"use client";

import { useState, useEffect } from "react";
import AddFairModal from "./AddFairModal";
import EditFairModal from "./EditFairModal";
import { FairFormData, AllSubCitiesResponse, Fair } from "@/api/types";
import {
  addFair,
  updateFair,
  getAllCategories,
  deleteFair,
  getAdminFairsList,
} from "@/api/adminApi";
import { X } from "lucide-react";

export default function FairsManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFair, setEditingFair] = useState<{
    id: string;
    data: FairFormData;
  } | null>(null);
  const [categories, setCategories] = useState<AllSubCitiesResponse>({});
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // 박람회 목록 상태 추가
  const [fairs, setFairs] = useState<Fair[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    search: "",
    status: "all",
    category1: "전체",
    page: "1",
    size: "10",
  });
  // 필터 입력값 상태 추가
  const [searchInput, setSearchInput] = useState("");
  const [statusInput, setStatusInput] = useState("all");
  const [categoryInput, setCategoryInput] = useState("전체");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
        setCategoriesError(null);
      } catch (err) {
        setCategoriesError("카테고리 정보를 불러오는데 실패했습니다.");
        console.error("카테고리 로딩 오류:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 박람회 목록 불러오기
  useEffect(() => {
    const fetchFairs = async () => {
      try {
        setIsLoading(true);
        const response = await getAdminFairsList(searchParams);
        setFairs(response.fairs);
        setTotalPages(parseInt(response.totalPages));
        setCurrentPage(parseInt(response.currentPage));
      } catch (error) {
        console.error("박람회 목록을 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFairs();
  }, [searchParams]);

  // 검색 파라미터 변경 핸들러
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleStatusInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusInput(e.target.value);
    setSearchParams((prev) => ({
      ...prev,
      status: e.target.value,
      page: "1",
    }));
  };

  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategoryInput(e.target.value);
    setSearchParams((prev) => ({
      ...prev,
      category1: e.target.value,
      page: "1",
    }));
  };

  const handleSearchSubmit = () => {
    setSearchParams((prev) => ({
      ...prev,
      search: searchInput,
      status: statusInput,
      category1: categoryInput,
      page: "1",
    }));
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => ({
      ...prev,
      page: newPage.toString(),
    }));
  };

  const handleAddFair = async (fairData: FairFormData) => {
    try {
      await addFair(fairData);
      // 성공 시 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error("박람회 등록 중 오류가 발생했습니다:", error);
      alert("박람회 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleEditFair = async (fairData: FairFormData) => {
    if (!editingFair) return;

    try {
      await updateFair(editingFair.id, fairData);
      window.location.reload();
    } catch (error) {
      console.error("박람회 수정 중 오류가 발생했습니다:", error);
      alert("박람회 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDeleteFair = async (fairId: string) => {
    if (!confirm("정말로 이 박람회를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteFair(fairId);
      window.location.reload();
    } catch (error) {
      console.error("박람회 삭제 중 오류가 발생했습니다:", error);
      alert("박람회 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleEditClick = (fair: { id: string; data: FairFormData }) => {
    setEditingFair(fair);
    setIsEditModalOpen(true);
  };

  // 검색 입력값 지우기 핸들러
  const handleClearSearch = () => {
    setSearchInput("");
    // 검색어를 지우고 바로 검색 실행
    setSearchParams((prev) => ({
      ...prev,
      search: "",
      page: "1",
    }));
  };

  // 엔터 키 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">박람회 관리</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          새 박람회 등록
        </button>
      </div>

      {/* 필터 섹션 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <select
              value={statusInput}
              onChange={handleStatusInputChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="all">전체</option>
              <option value="ongoing">진행중</option>
              <option value="upcoming">예정</option>
              <option value="ended">종료</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <select
              value={categoryInput}
              onChange={handleCategoryInputChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="전체">전체 지역</option>
              {Object.values(categories).map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-4">
            <div className="relative">
              <input
                type="text"
                placeholder="박람회 제목 검색"
                value={searchInput}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2 border rounded-md pr-10"
              />
              {searchInput && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="검색어 지우기"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleSearchSubmit}
              className="w-full bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              검색
            </button>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                박람회명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                지역
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                </td>
              </tr>
            ) : fairs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  등록된 박람회가 없습니다.
                </td>
              </tr>
            ) : (
              fairs.map((fair) => (
                <tr key={fair.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {fair.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {fair.category1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {fair.start_date.split('T')[0]} ~{' '}
                      {fair.end_date.split('T')[0]}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(
                        fair.start_date,
                        fair.end_date
                      )}`}
                    >
                      {getStatusText(fair.start_date, fair.end_date)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() =>
                        handleEditClick({
                          id: fair.id,
                          data: {
                            title: fair.title,
                            category1: fair.category1,
                            category2: fair.category2,
                            start_date: fair.start_date.split('T')[0],
                            end_date: fair.end_date.split('T')[0],
                            redirect_url: fair.redirect_url,
                            address: fair.address,
                            description: fair.description,
                            promotion: fair.promotion,
                            image_url: fair.image_url,
                            type: fair.type,
                          },
                        })
                      }
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteFair(fair.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {!isLoading && fairs.length > 0 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
            >
              이전
            </button>
            <span className="px-3 py-1">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
            >
              다음
            </button>
          </nav>
        </div>
      )}

      <AddFairModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddFair}
        categories={categories}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
      />

      {editingFair && (
        <EditFairModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingFair(null);
          }}
          onSubmit={handleEditFair}
          initialData={editingFair.data}
          categories={categories}
          categoriesLoading={categoriesLoading}
          categoriesError={categoriesError}
        />
      )}
    </div>
  );
}

// 박람회 상태 관련 유틸리티 함수
function getStatusText(startDate: string, endDate: string): string {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "예정";
  if (now > end) return "종료";
  return "진행중";
}

function getStatusStyle(startDate: string, endDate: string): string {
  const status = getStatusText(startDate, endDate);
  switch (status) {
    case "예정":
      return "bg-blue-100 text-blue-800";
    case "진행중":
      return "bg-green-100 text-green-800";
    case "종료":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
