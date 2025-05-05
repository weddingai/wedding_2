import { Fair } from "@/api";
import Image from "next/image";

interface FairCardProps {
  fair: Fair;
}

export const FairCard = ({ fair }: FairCardProps) => {
  const imgWidth = 640;
  const imgHeight = 274;

  return (
    <div className="group">
      <a
        href={`${fair.redirect_url}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="my-7 overflow-hidden rounded-lg">
          <div
            className="w-full bg-gray-50 rounded-lg overflow-hidden"
            style={{ aspectRatio: `${imgWidth}/${imgHeight}` }}
          >
            <Image
              src={fair.image_url}
              alt={fair.title}
              width={imgWidth}
              height={imgHeight}
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <div className="text-sm text-gray-500 mb-1">
          {fair.category1} &gt; {fair.category2}
        </div>
        <h3 className="text-xl font-bold mb-2">{fair.title}</h3>
        <div className="mb-2">
          {fair.start_date.split("T")[0]} ~ {fair.end_date.split("T")[0]}
        </div>
        <p className="text-sm text-gray-700 mb-3 min-h-[2.5rem] line-clamp-2 overflow-hidden">
          {fair.address}
        </p>
        <div className="bg-amber-50 text-amber-800 text-sm px-4 py-2 rounded-md">
          {fair.promotion || fair.description}
        </div>
      </a>
    </div>
  );
};
