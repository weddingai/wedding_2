"use client";

import { useState, useEffect } from "react";
import { getMetaTags, updateMetaTags } from "@/api/adminApi";
import type { MetaTags } from "@/api/types";

export default function SeoManagement() {
  const [meta, setMeta] = useState<MetaTags>({
    meta_title: "",
    meta_description: "",
    keywords: "",
    og_title: "",
    og_description: "",
    og_image: "",
    og_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchMeta = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getMetaTags(2);
        setMeta({
          meta_title: data.meta_title || "",
          meta_description: data.meta_description || "",
          keywords: data.keywords || "",
          og_title: data.og_title || "",
          og_description: data.og_description || "",
          og_image: data.og_image || "",
          og_url: data.og_url || "",
        });
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "메타태그 정보를 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMeta();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMeta((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateMetaTags(2, meta);
      window.alert("메타태그 정보가 저장되었습니다.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "저장에 실패했습니다.";
      setError(msg);
      window.alert(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SEO 관리</h1>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {loading ? (
            <div className="text-gray-500">로딩 중...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  메타 타이틀
                </label>
                <input
                  type="text"
                  name="meta_title"
                  value={meta.meta_title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="페이지 타이틀"
                  disabled={saving}
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
                  name="meta_description"
                  value={meta.meta_description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                  rows={3}
                  placeholder="페이지 설명"
                  disabled={saving}
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
                  name="keywords"
                  value={meta.keywords}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="키워드1, 키워드2, 키워드3"
                  disabled={saving}
                />
                <p className="mt-1 text-sm text-gray-500">
                  콤마(,)로 구분하여 입력 (최대 10개)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Open Graph 제목 (og:title)
                </label>
                <input
                  type="text"
                  name="og_title"
                  value={meta.og_title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="소셜 공유 시 표시될 제목"
                  disabled={saving}
                />
                <p className="mt-1 text-sm text-gray-500">
                  소셜 미디어에서 공유될 때 표시될 제목 (최대 60자)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Open Graph 설명 (og:description)
                </label>
                <textarea
                  name="og_description"
                  value={meta.og_description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                  rows={3}
                  placeholder="소셜 공유 시 표시될 설명"
                  disabled={saving}
                />
                <p className="mt-1 text-sm text-gray-500">
                  소셜 미디어에서 공유될 때 표시될 설명 (최대 100자)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Open Graph 이미지 URL (og:image)
                </label>
                <input
                  type="text"
                  name="og_image"
                  value={meta.og_image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="https://example.com/og-image.jpg"
                  disabled={saving}
                />
                <p className="mt-1 text-sm text-gray-500">
                  소셜 미디어에서 공유될 때 표시될 대표 이미지 URL
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Open Graph URL (og:url)
                </label>
                <input
                  type="text"
                  name="og_url"
                  value={meta.og_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="https://example.com/page-url"
                  disabled={saving}
                />
                <p className="mt-1 text-sm text-gray-500">
                  공유 시 연결될 실제 페이지 주소
                </p>
              </div>
              <div className="pt-6 border-t">
                <button
                  className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "저장 중..." : "저장하기"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
