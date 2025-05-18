"use client";

import { useState, useEffect } from "react";
import { getSitesList, updateSitemapXml } from "@/api/adminApi";
import { getSitemapXml } from "@/api/seoApi";
import type { Site } from "@/api/types";

export default function SitemapViewer() {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [sitemapXml, setSitemapXml] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editXml, setEditXml] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchSites = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getSitesList();
        setSites(res.sites);
        if (res.sites.length > 0) {
          setSelectedSite(res.sites[0].id);
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
    if (!selectedSite) return;
    setSitemapXml("");
    setEditMode(false);
    setEditXml("");
    const fetchSitemap = async () => {
      try {
        const xml = await getSitemapXml(selectedSite);
        setSitemapXml(xml);
      } catch {
        setSitemapXml("");
        setError("사이트맵을 불러오지 못했습니다.");
      }
    };
    fetchSitemap();
  }, [selectedSite]);

  const handleEdit = () => {
    setEditXml(sitemapXml);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditXml("");
  };

  const handleSave = async () => {
    if (!selectedSite) return;
    setSaving(true);
    setError("");
    try {
      await updateSitemapXml(selectedSite, editXml);
      setSitemapXml(editXml);
      setEditMode(false);
      window.alert("사이트맵이 저장되었습니다.");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? "사이트맵 저장에 실패했습니다: " + err.message
          : "사이트맵 저장에 실패했습니다.";
      setError(msg);
      window.alert(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">사이트맵 미리보기</h1>
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

      {/* 사이트맵 XML 미리보기 및 수정 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사이트맵 XML {editMode ? '수정' : '미리보기'}
            </label>
            {editMode ? (
              <>
                <textarea
                  value={editXml}
                  onChange={(e) => setEditXml(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md font-mono"
                  rows={15}
                  placeholder="사이트맵 XML을 입력하세요."
                  disabled={saving}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? '저장 중...' : '저장'}
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    취소
                  </button>
                </div>
              </>
            ) : (
              <>
                <textarea
                  value={sitemapXml}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md font-mono"
                  rows={15}
                  placeholder="사이트맵 XML이 여기에 표시됩니다."
                />
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50"
                    onClick={handleEdit}
                    disabled={!selectedSite || loading}
                  >
                    수정
                  </button>
                </div>
              </>
            )}
            <p className="mt-1 text-sm text-gray-500">
              사이트맵은 DB에 저장된 XML을 그대로 보여주며, 직접 수정 및 저장이
              가능합니다. 수정일자를 생략하면 매일 2시로 설정됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
