"use client";

import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  // 인기 서비스 데이터
  const services = [
    {
      label: "서울시 박람회",
      img: "/images/service1.png",
      link: "/detail?main=서울&sub=서울시&mainName=서울&subName=서울시",
    },
    {
      label: "웨딩 박람회",
      img: "/images/service2.png",
      link: "/search?type=웨딩",
    },
    {
      label: "허니문 박람회",
      img: "/images/service3.png",
      link: "/search?type=허니문",
    },
    {
      label: "스드메 박람회",
      img: "/images/service4.png",
      link: "/search?type=스드메",
    },
    {
      label: "웨딩홀 박람회",
      img: "/images/service5.png",
      link: "/search?type=웨딩홀",
    },
  ];

  return (
    <section className="py-12 bg-[#FFF8F2]">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-normal text-center text-[#493D32] mb-7">
          인기 서비스
        </h2>
        <p className="text-center text-[#493D32] mb-12">
          다른 신랑, 신부님들이 많이 찾아보신 서비스
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {services.map((service) => (
            <div key={service.label} className="flex flex-col items-center">
              <Link href={service.link} legacyBehavior>
                <a className="flex flex-col items-center group">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-3 bg-gray-100 flex items-center justify-center group-hover:ring-2 group-hover:ring-[#e5ded6] transition">
                    <Image
                      src={service.img}
                      alt={service.label}
                      className="object-cover w-full h-full"
                      width={256}
                      height={256}
                    />
                  </div>
                  <div className="mb-2 mt-2 font-normal text-sm text-[#493D32] group-hover:text-[#9E856F] transition">
                    {service.label}
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
