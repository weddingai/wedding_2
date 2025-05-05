import { Suspense } from "react";
import DetailContent from "./DetailContent";

export default function DetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <DetailContent />
    </Suspense>
  );
}
