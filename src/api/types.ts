// Fair 타입 정의
export interface Fair {
  id: string;
  title: string;
  category1: string;
  category2: string;
  region: string;
  start_date: string;
  end_date: string;
  redirect_url: string;
  address: string;
  description: string;
  promotion: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  hash: string;
  type: string;
}

export interface BannerInfo extends Fair {
  image_src: string;
  title: string;
}

// API 응답 타입 정의
export interface FairsResponse {
  fairs: Fair[];
  totalPages: string;
  currentPage: string;
}

export interface City {
  id: number;
  name: string;
}

export type CityResponse = City[];

export interface SubCityResponse {
  sub_cities: City[];
}

export interface AllSubCitiesResponse {
  [key: number]: {
    id: number;
    name: string;
    sub_cities: City[];
  };
}

// 요청 파라미터 타입 정의
export interface FairsParams {
  main?: string;
  sub?: string;
  type?: string;
  page?: string;
  size?: string;
}

export interface AdminFairsResponse {
  active?: string;
  expired?: string;
}

// 관리자 박람회 목록 요청 파라미터
export interface AdminFairsListParams {
  search?: string; // 검색어 (선택)
  status?: string; // 상태 필터 (선택, 기본값: "all")
  category1?: string; // 메인 카테고리 (선택, 기본값: "전체")
  page?: string; // 페이지 번호 (선택, 기본값: "1")
  size?: string; // 페이지 크기 (선택, 기본값: "10")
}

// 박람회 검색 요청 파라미터
export interface SearchFairsParams {
  search: string;
  type?: string;
  page?: string;
  size?: string;
}

// 박람회 응답 데이터
export interface FairsResponse {
  fairs: Fair[];
  totalPages: string;
  currentPage: string;
  totalCount: number;
}

// 박람회 추가 폼 데이터 타입
export interface FairFormData {
  title: string;
  category1: string;
  category2: string;
  start_date: string;
  end_date: string;
  redirect_url: string;
  address: string;
  description: string;
  promotion: string;
  image_url: string;
  type: string;
}

// tb_sites 사이트 타입 정의
export interface Site {
  id: string;
  site_name: string;
  site_url: string;
  sitemap_xml: string | null;
  structured_data: string | null;
  created_at: string;
  updated_at: string;
}

export interface SitesResponse {
  sites: Site[];
}

export type StructuredData = {
  "@context": string;
  "@type": string;
  name?: string;
  description?: string;
  url?: string;
  [key: string]: string | number | boolean | null | undefined;
};

// SEO 관련 타입
export interface SeoResponse {
  structured_data: string;
}

// 메타태그 타입 정의
export interface MetaTags {
  id?: number;
  site_id?: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  og_url: string;
  google_verification?: string;
  naver_verification?: string;
  created_at?: string;
  updated_at?: string;
}

// 서치 콘솔 확인 코드 타입
export interface SearchConsoleVerification {
  id?: number;
  site_id?: string;
  google_verification?: string;
  naver_verification?: string;
  created_at?: string;
  updated_at?: string;
}
