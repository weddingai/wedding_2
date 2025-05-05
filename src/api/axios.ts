import axios from "axios";

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
  },
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  (config) => {
    // 요청 보내기 전 작업 수행
    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
apiClient.interceptors.response.use(
  (response) => {
    // 응답 데이터 처리
    return response;
  },
  (error) => {
    // 응답 에러 처리
    return Promise.reject(error);
  }
);

export default apiClient;
