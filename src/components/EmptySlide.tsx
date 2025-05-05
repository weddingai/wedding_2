import Image from "next/image";

export const EmptySlide = () => {
  return (
    <div className="relative aspect-[16/5] md:aspect-[16/5] overflow-hidden">
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <Image
          src="/images/MainBanner.jpeg"
          alt="main-banner"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};
