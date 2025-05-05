"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { FairFormData, AllSubCitiesResponse } from "@/api/types";

interface EditFairModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fairData: FairFormData) => Promise<void>;
  initialData: FairFormData;
  categories: AllSubCitiesResponse;
  categoriesLoading: boolean;
  categoriesError: string | null;
}

export default function EditFairModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  categoriesLoading,
  categoriesError,
}: EditFairModalProps) {
  const [formData, setFormData] = useState<FairFormData>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">박람회 수정</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                박람회명
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                주소
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시작일
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종료일
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                유형
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">선택하세요</option>
                <option value="웨딩">웨딩</option>
                <option value="스드메">스드메</option>
                <option value="허니문">허니문</option>
                <option value="예물">예물</option>
                <option value="한복">한복</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이미지 URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                대분류
              </label>
              {categoriesLoading ? (
                <div className="w-full px-3 py-2 border rounded-md bg-gray-50">
                  로딩중...
                </div>
              ) : categoriesError ? (
                <div className="w-full px-3 py-2 border rounded-md bg-red-50 text-red-600">
                  {categoriesError}
                </div>
              ) : (
                <select
                  value={formData.category1}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      category1: e.target.value,
                      category2: "",
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">선택하세요</option>
                  {Object.values(categories).map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                소분류
              </label>
              {categoriesLoading ? (
                <div className="w-full px-3 py-2 border rounded-md bg-gray-50">
                  로딩중...
                </div>
              ) : categoriesError ? (
                <div className="w-full px-3 py-2 border rounded-md bg-red-50 text-red-600">
                  {categoriesError}
                </div>
              ) : (
                <select
                  value={formData.category2}
                  onChange={(e) =>
                    setFormData({ ...formData, category2: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  required
                  disabled={!formData.category1}
                >
                  <option value="">선택하세요</option>
                  {Object.values(categories)
                    .find((category) => category.name === formData.category1)
                    ?.sub_categories?.map(
                      (subCity: { id: number; name: string }) => (
                        <option key={subCity.id} value={subCity.name}>
                          {subCity.name}
                        </option>
                      )
                    )}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                리다이렉트 URL
              </label>
              <input
                type="url"
                value={formData.redirect_url}
                onChange={(e) =>
                  setFormData({ ...formData, redirect_url: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                required
                rows={3}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                프로모션
              </label>
              <textarea
                value={formData.promotion}
                onChange={(e) =>
                  setFormData({ ...formData, promotion: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                required
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              수정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
