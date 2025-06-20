import apiClient from "./axios";
import { SeoResponse, MetaTags, SearchConsoleVerification } from './types';

/**
 * 구조화 데이터를 가져오는 함수
 */
export const getStructuredData = async (
  siteId: string
): Promise<SeoResponse> => {
  try {
    const response = await apiClient.get(`/seo/structured-data/${siteId}`);
    return response.data;
  } catch (error) {
    console.error('구조화 데이터를 가져오는 중 오류가 발생했습니다:', error);
    throw error;
  }
};

/**
 * 사이트맵(XML)을 string으로 받아오는 함수
 */
export const getSitemapXml = async (siteId: string): Promise<string> => {
  const response = await apiClient.get(`/seo/sitemap/${siteId}`, {
    responseType: 'text',
    headers: { Accept: 'application/xml' },
  });
  return response.data;
};

/**
 * 공개용 메타태그 조회 함수
 */
export const getPublicMetaTags = async (id: number): Promise<MetaTags> => {
  const res = await apiClient.get(`/seo/meta-tags/${id}`);
  console.log('Public Meta Tags Response:', res.data);
  if (res.data?.meta) return res.data.meta;
  throw new Error(res.data?.error || '메타태그 정보를 불러오지 못했습니다.');
};

/**
 * 서치 콘솔 확인 코드를 가져오는 함수
 */
export const getSearchConsoleVerification = async (
  siteId: string
): Promise<SearchConsoleVerification> => {
  try {
    const response = await apiClient.get(`/seo/search-console/${siteId}`);
    return response.data;
  } catch (error) {
    console.error(
      '서치 콘솔 확인 코드를 가져오는 중 오류가 발생했습니다:',
      error
    );
    throw error;
  }
};

/**
 * 서치 콘솔 확인 코드를 저장하는 함수
 */
export const saveSearchConsoleVerification = async (
  siteId: string,
  data: { google_verification?: string; naver_verification?: string }
): Promise<SearchConsoleVerification> => {
  try {
    const response = await apiClient.post(
      `/seo/search-console/${siteId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(
      '서치 콘솔 확인 코드를 저장하는 중 오류가 발생했습니다:',
      error
    );
    throw error;
  }
};
