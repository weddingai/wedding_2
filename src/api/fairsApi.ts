import apiClient from "./axios";
import { Fair, FairsParams, FairsResponse, SearchFairsParams } from "./types";

/**
 * 카테고리, 타입, 페이지에 따라 대도시 박람회 목록을 가져오는 함수
 */
export const getMainCategoryFairs = async (
  params: FairsParams
): Promise<FairsResponse> => {
  try {
    const response = await apiClient.post("/fairs/main", params);
    return response.data;
  } catch (error) {
    console.error(
      "대도시 박람회 정보를 가져오는 중 오류가 발생했습니다:",
      error
    );
    throw error;
  }
};

/**
 * 카테고리, 타입, 페이지에 따라 소도시 박람회 목록을 가져오는 함수
 */
export const getSubCategoryFairs = async (
  params: FairsParams
): Promise<FairsResponse> => {
  try {
    const response = await apiClient.post("/fairs/sub", params);
    return response.data;
  } catch (error) {
    console.error(
      "소도시 박람회 정보를 가져오는 중 오류가 발생했습니다:",
      error
    );
    throw error;
  }
};

/**
 * ID로 특정 박람회 정보를 가져오는 함수
 */
export const getFairById = async (id: string): Promise<Fair> => {
  try {
    const response = await apiClient.get(`/fairs/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `ID가 ${id}인 박람회 정보를 가져오는 중 오류가 발생했습니다:`,
      error
    );
    throw error;
  }
};

/**
 * 검색어, 타입, 페이지 정보를 기반으로 박람회를 검색하는 함수
 */
export const searchFairs = async (
  params: SearchFairsParams
): Promise<FairsResponse> => {
  try {
    const response = await apiClient.post("/fairs/search", params);
    return response.data;
  } catch (error) {
    console.error("박람회 검색 중 오류가 발생했습니다:", error);
    throw error;
  }
};