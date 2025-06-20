'use client';

import { useState, useEffect } from 'react';
import {
  getSearchConsoleVerification,
  saveSearchConsoleVerification,
} from '@/api/seoApi';

export default function SearchConsole() {
  const [googleVerificationCode, setGoogleVerificationCode] = useState('');
  const [naverVerificationCode, setNaverVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    loadSearchConsoleData();
  }, []);

  const loadSearchConsoleData = async () => {
    try {
      const data = await getSearchConsoleVerification('2');
      setGoogleVerificationCode(data.google_verification || '');
      setNaverVerificationCode(data.naver_verification || '');
    } catch (error) {
      console.error('서치 콘솔 데이터 로딩 중 오류:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveSearchConsoleVerification('2', {
        google_verification: googleVerificationCode,
        naver_verification: naverVerificationCode,
      });

      alert('서치 콘솔 설정이 저장되었습니다.');
    } catch (error) {
      console.error('저장 중 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">서치 콘솔 등록</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* Google Search Console */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Google Search Console
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google 확인 코드
              </label>
              <input
                type="text"
                value={googleVerificationCode}
                onChange={(e) => setGoogleVerificationCode(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="google-site-verification 메타 태그의 content 값"
              />
              <p className="mt-1 text-sm text-gray-500">
                {
                  '예: <meta name="google-site-verification" content="abcdef123456..." />에서 abcdef123456... 부분만 입력'
                }
              </p>
            </div>
          </div>

          {/* Naver Search Advisor */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              네이버 서치어드바이저
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                네이버 확인 코드
              </label>
              <input
                type="text"
                value={naverVerificationCode}
                onChange={(e) => setNaverVerificationCode(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="naver-site-verification 메타 태그의 content 값"
              />
              <p className="mt-1 text-sm text-gray-500">
                {
                  '예: <meta name="naver-site-verification" content="abcdef123456..." />에서 abcdef123456... 부분만 입력'
                }
              </p>
            </div>
          </div>

          {/* 설명 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              서치 콘솔 등록 방법
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                1. Google Search Console 또는 네이버 서치어드바이저에 접속
              </li>
              <li>2. 사이트 등록 후 HTML 태그 확인 방법 선택</li>
              <li>3. 제공된 메타 태그에서 content 값만 복사하여 위에 입력</li>
              <li>4. 저장 후 해당 서비스에서 확인 버튼 클릭</li>
            </ul>
          </div>

          <div className="pt-6 border-t">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoading ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
