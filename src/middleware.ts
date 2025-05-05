import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // admin 경로에 대한 처리
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // 로그인 페이지가 아닌 admin 페이지에 접근할 때
    if (request.nextUrl.pathname !== "/admin") {
      // 세션이 없으면 로그인 페이지로 리다이렉트
      if (!session) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    // 로그인 페이지에 접근할 때
    else if (request.nextUrl.pathname === "/admin") {
      // 이미 로그인되어 있으면 대시보드로 리다이렉트
      if (session) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
  }

  return res;
}

// admin으로 시작하는 모든 경로에 대해 미들웨어 적용
export const config = {
  matcher: "/admin/:path*",
};
