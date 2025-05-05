"use client";

import { useState } from "react";

export default function SeoManagement() {
  const [selectedPage, setSelectedPage] = useState("home");

  const pages = [
    { id: "home", name: "메인 페이지" },
    { id: "fairs", name: "박람회 목록" },
    { id: "about", name: "소개 페이지" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SEO 관리</h1>
      </div>

      {/* 페이지 선택 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          페이지 선택
        </label>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        >
          {pages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.name}
            </option>
          ))}
        </select>
      </div>

      {/* SEO 설정 폼 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              메타 타이틀
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md"
              placeholder="페이지 타이틀"
            />
            <p className="mt-1 text-sm text-gray-500">
              검색 결과에 표시될 페이지 제목 (최대 60자)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              메타 설명
            </label>
            <textarea
              className="w-full px-4 py-2 border rounded-md"
              rows={3}
              placeholder="페이지 설명"
            />
            <p className="mt-1 text-sm text-gray-500">
              검색 결과에 표시될 페이지 설명 (최대 160자)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              키워드
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md"
              placeholder="키워드1, 키워드2, 키워드3"
            />
            <p className="mt-1 text-sm text-gray-500">
              콤마(,)로 구분하여 입력 (최대 10개)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open Graph 이미지
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">이미지 없음</span>
              </div>
              <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
                이미지 업로드
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              SNS 공유 시 표시될 이미지 (권장 크기: 1200x630)
            </p>
          </div>

          <div className="pt-6 border-t">
            <button className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800">
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
