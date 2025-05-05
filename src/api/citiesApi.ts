import apiClient from "./axios";
import { AllSubCitiesResponse, CityResponse, SubCityResponse } from "./types";

/**
 * 메인 카테고리(대도시) 목록을 가져오는 함수
 */
export const getMainCities = async (): Promise<CityResponse> => {
  try {
    const response = await apiClient.get("/cities/main");
    return response.data;
  } catch (error) {
    console.error(
      "메인 카테고리 목록을 가져오는 중 오류가 발생했습니다:",
      error
    );
    throw error;
  }
};

/**
 * 메인 카테고리 ID에 해당하는 서브 카테고리(소도시) 목록을 가져오는 함수
 */
export const getSubCities = async (
  mainId: string
): Promise<SubCityResponse> => {
  try {
    const response = await apiClient.get(`/cities/sub/${mainId}`);
    return response.data;
  } catch (error) {
    console.error(
      `메인 카테고리 ID가 ${mainId}인 서브 카테고리 목록을 가져오는 중 오류가 발생했습니다:`,
      error
    );
    throw error;
  }
};

/**
 * 모든 메인 카테고리와 그에 속한 서브 카테고리 목록을 한 번에 가져오는 함수
 */
export const getAllSubCities = async (): Promise<AllSubCitiesResponse> => {
  try {
    const response = await apiClient.get("/cities/sub/all");
    return response.data;
  } catch (error) {
    console.error(
      "모든 서브 카테고리 목록을 가져오는 중 오류가 발생했습니다:",
      error
    );
    throw error;
  }
};