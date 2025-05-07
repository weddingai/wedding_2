"use client";

import { useState, useEffect } from "react";
import { getSitesList, updateStructuredData } from "@/api/adminApi";
import type { Site } from "@/api/types";

export default function StructuredDataManagement() {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [jsonData, setJsonData] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSites = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getSitesList();
        setSites(res.sites);
        if (res.sites.length > 0) {
          setSelectedSite(res.sites[0].id.toString());
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError("사이트 목록을 불러오지 못했습니다: " + err.message);
        } else {
          setError("사이트 목록을 불러오지 못했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSites();
  }, []);

  useEffect(() => {
    const fetchStructuredData = async () => {
      if (!selectedSite || sites.length === 0) return;

      setLoading(true);
      setError("");
      try {
        const res = await getSitesList();
        const site = res.sites.find((s) => s.id.toString() === selectedSite);
        if (site) {
          try {
            // structured_data가 문자열이면 파싱하고, 객체면 그대로 사용
            const data =
              typeof site.structured_data === "string"
                ? JSON.parse(site.structured_data)
                : site.structured_data;
            // null이나 undefined가 아닌 경우에만 JSON.stringify 실행
            setJsonData(data ? JSON.stringify(data, null, 1) : "");
          } catch (err) {
            // 파싱 에러가 발생하면 원본 데이터를 그대로 표시
            setJsonData(site.structured_data || "");
            console.error("구조화 데이터 파싱 중 오류:", err);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError("구조화 데이터를 불러오지 못했습니다: " + err.message);
        } else {
          setError("구조화 데이터를 불러오지 못했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStructuredData();
  }, [selectedSite]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(e.target.value);
  };

  const validateJson = () => {
    try {
      JSON.parse(jsonData);
      alert("유효한 JSON 형식입니다.");
    } catch {
      alert("유효하지 않은 JSON 형식입니다. 다시 확인해주세요.");
    }
  };

  const handleSave = async () => {
    if (!selectedSite) return;
    setIsSaving(true);
    try {
      // JSON 유효성 검사
      const parsedData = JSON.parse(jsonData);
      await updateStructuredData(selectedSite, parsedData);
      alert("구조화 데이터가 저장되었습니다.");
    } catch (err) {
      if (err instanceof SyntaxError) {
        alert(
          "유효하지 않은 JSON 형식입니다. 저장하기 전에 JSON 유효성을 확인해주세요."
        );
      } else if (err instanceof Error) {
        alert("구조화 데이터 저장 중 오류가 발생했습니다: " + err.message);
      } else {
        alert("구조화 데이터 저장 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">구조화 데이터 관리</h1>
      </div>

      {/* 사이트 선택 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          사이트 선택
        </label>
        {loading ? (
          <div className="text-gray-500 text-sm">로딩 중...</div>
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : (
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.site_name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 구조화 데이터 설정 폼 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              구조화 데이터 (JSON-LD)
            </label>
            <textarea
              value={jsonData}
              onChange={handleJsonChange}
              className="w-full px-4 py-2 border rounded-md font-mono"
              rows={10}
              placeholder='{
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "THEWEDDING",
                "url": "https://example.com"
              }'
            />
            <p className="mt-1 text-sm text-gray-500">
              JSON-LD 형식의 구조화 데이터를 입력하세요
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={validateJson}
              disabled={isSaving}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              JSON 유효성 검사
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !selectedSite}
              className="flex-1 bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {isSaving ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
