"use client";

import { useEffect, useState } from "react";
import { getActiveFairsCount, getExpiredFairsCount } from "@/api";

export default function AdminDashboard() {
  const [activeFairs, setActiveFairs] = useState(0);
  const [expiredFairs, setExpiredFairs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activeCount, expiredCount] = await Promise.all([
          getActiveFairsCount(),
          getExpiredFairsCount(),
        ]);

        setActiveFairs(parseInt(activeCount.active || "0"));
        setExpiredFairs(parseInt(expiredCount.expired || "0"));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              진행중인 박람회
            </h2>
            <p className="text-3xl font-bold">{activeFairs}개</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              종료된 박람회
            </h2>
            <p className="text-3xl font-bold">{expiredFairs}개</p>
          </div>
        </div>
      )}
    </div>
  );
}
