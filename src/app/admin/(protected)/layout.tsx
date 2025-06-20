"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Calendar, Search, LogOut } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// 관리자 메뉴 아이템
const adminMenuItems = [
  { title: '대시보드', href: '/admin/dashboard', icon: <LayoutDashboard /> },
  {
    title: 'SEO 관리',
    href: '/admin/seo/meta',
    icon: <Search />,
    subItems: [
      { title: '메타 태그', href: '/admin/seo/meta' },
      { title: '구조화 데이터', href: '/admin/seo/structured-data' },
      { title: '사이트맵', href: '/admin/seo/sitemap' },
      { title: '서치 콘솔', href: '/admin/search-console' },
    ],
  },
  { title: '박람회 관리', href: '/admin/fairs', icon: <Calendar /> },
];

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow flex-shrink-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin/dashboard" className="flex-shrink-0">
              <h1 className="text-xl font-bold">관리자 페이지</h1>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-8 flex min-h-0">
        <div className="flex gap-6 flex-1">
          <aside className="w-64 bg-white rounded-lg shadow flex flex-col flex-shrink-0">
            <nav className="flex flex-col flex-1 p-4 overflow-y-auto">
              <div className="flex-1 space-y-1">
                {adminMenuItems.map((item) => (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 rounded-md ${
                        (
                          item.title === "SEO 관리"
                            ? pathname.startsWith("/admin/seo")
                            : isActive(item.href)
                        )
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon}
                        {item.title}
                      </span>
                    </Link>
                    {item.subItems && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`block px-4 py-2 rounded-md text-sm ${
                              isActive(subItem.href) ||
                              (subItem.href === "/admin/seo/meta" &&
                                (pathname === "/admin/seo" ||
                                  pathname === "/admin/seo/meta"))
                                ? "bg-gray-900 text-white"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="pt-4 mt-4 border-t">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <LogOut className="w-5 h-5" />
                  <span>로그아웃</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* 메인 콘텐츠 - 스크롤 가능 */}
          <main className="flex-1 bg-white rounded-lg shadow flex flex-col min-h-0">
            <div className="flex-1 p-6 overflow-y-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
