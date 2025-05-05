"use client";

import { useEffect, useState } from "react";
import { getMainCategoryFairs, BannerInfo } from "@/api";
import { FairSlide, EmptySlide } from "@/components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "@/styles/slickStyle.css";

// 커스텀 화살표 컴포넌트 타입 정의
interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const PrevArrow = (props: ArrowProps) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <FiChevronLeft className="text-gray-800" />
    </div>
  );
};

const NextArrow = (props: ArrowProps) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <FiChevronRight className="text-gray-800" />
    </div>
  );
};

function Banner() {
  const [banners, setBanners] = useState<BannerInfo[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const params = {
          main: "서울",
          sub: "",
          type: "",
          page: "1",
          size: "3",
        };
        const data = await getMainCategoryFairs(params);
        const preBanners = data.fairs;

        if (preBanners && preBanners.length > 0) {
          // 랜덤 이미지 소스 생성
          const randomImageSources = Array.from(
            { length: 6 },
            (_, i) => `/images/Banner_${i + 1}.jpeg`
          ).sort(() => Math.random() - 0.5);

          // 페어 데이터의 첫 3개를 가져와서 이미지 소스만 랜덤으로 변경
          const bannerData: BannerInfo[] = preBanners
            .slice(0, 3)
            .map((fair, index) => ({
              ...fair,
              image_src: randomImageSources[index],
            }));

          setBanners(bannerData);
        }
      } catch (error) {
        console.error("Error fetching banner fairs:", error);
      }
    };

    fetchBanners();
  }, []);

  // 슬라이더 설정
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    adaptiveHeight: true,
  };

  return (
    <section className="relative overflow-hidden">
      <Slider {...sliderSettings}>
        {banners.length > 0 ? (
          banners.map((banner) => <FairSlide key={banner.id} banner={banner} />)
        ) : (
          <EmptySlide />
        )}
      </Slider>
    </section>
  );
}

export default Banner;
