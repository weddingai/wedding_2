import { BannerInfo } from "@/api";
import Image from "next/image";

interface BannerSlideProps {
  banner: BannerInfo;
}

export const FairSlide = ({ banner }: BannerSlideProps) => {
  const handleClick = () => {
    if (banner.redirect_url) {
      window.open(banner.redirect_url, "_blank");
    }
  };

  return (
    <a
      href={banner.redirect_url || "#"}
      className="relative cursor-pointer block"
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="relative aspect-[16/5] md:aspect-[16/5] overflow-hidden">
        <Image
          src={banner.image_src}
          alt={banner.title}
          fill
          className="object-cover w-full"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold">{banner.title}</h2>
          <p className="text-lg md:text-xl mt-2">
            {banner.start_date.split("T")[0]} ~ {banner.end_date.split("T")[0]}
          </p>
          <p className="text-sm md:text-lg">{banner.address}</p>
        </div>
      </div>
    </a>
  );
};
