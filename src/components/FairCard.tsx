import { Fair } from "@/api";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";

interface FairCardProps {
  fair: Fair;
}

function formatMMDD(dateStr: string) {
  const date = new Date(dateStr);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}-${dd}`;
}

export const FairCard = ({ fair }: FairCardProps) => {
  const imgWidth = 640;
  const imgHeight = 274;

  return (
    <a
      href={fair.redirect_url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ filter: "drop-shadow(3px 3px 4px #BBBBBB)" }}
      className="block h-full"
    >
      <div
        className="bg-[#FFFEF8] border p-6 md:p-7 min-h-[420px] flex flex-col"
        style={{
          clipPath:
            "polygon(24px 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 24px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 24px), 0 24px)",
        }}
      >
        <div className="overflow-hidden mb-4">
          <div
            className="w-full bg-gray-50 overflow-hidden"
            style={{ aspectRatio: `${imgWidth}/${imgHeight}` }}
          >
            <Image
              src={fair.image_url}
              alt={fair.title}
              width={imgWidth}
              height={imgHeight}
              className="w-full h-full object-cover rounded-lg transition-transform duration-300"
            />
          </div>
        </div>
        <div className="text-xs text-[#A89B87] mb-5">
          {fair.category1} &gt; {fair.category2}
        </div>
        <div className="mb-2">
          <span className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-700">
            {fair.type || "전시"}
          </span>
        </div>
        <h3 className="text-base font-semibold mb-3 text-[#493D32] line-clamp-1">
          {fair.title}
        </h3>
        <div className="flex items-center mb-3 text-sm text-[#493D32] font-normal">
          <Calendar className="w-4 h-4 mr-1 text-[#A89B87]" />
          {formatMMDD(fair.start_date)} ~ {formatMMDD(fair.end_date)}
        </div>
        <div className="flex items-start mb-5 min-h-[2.5rem]">
          <MapPin className="w-4 h-4 mt-1 mr-1 flex-shrink-0 text-[#A89B87]" />
          <span className="text-sm text-[#493D32] font-normal line-clamp-2 overflow-hidden">
            {fair.address}
          </span>
        </div>
        <div className="border-b border-dashed border-black mb-5" />
        <div className="bg-[#F7EEE6] text-[#493D32] text-sm px-4 py-3 rounded-lg h-[4rem] line-clamp-2">
          {fair.promotion || fair.description}
        </div>
      </div>
    </a>
  );
};
