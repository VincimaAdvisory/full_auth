import createMiddleware from "next-intl/middleware";
import { routing, MODE } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

// 1. Create next-intl middleware handler
const intlMiddleware = createMiddleware(routing);


// export default createMiddleware(routing);
 
export default function middleware(req: Request) {
  // const url = new URL(req.url);
  const nextReq = req as NextRequest;

  // console.log('[Middleware] URL hit:', nextReq.nextUrl.pathname);
  // console.log('Mode:', MODE);

  if (MODE==='cookie')
    return NextResponse.next();

  // Skip non-page requests
  if (nextReq.nextUrl.pathname.startsWith('/_next') || nextReq.nextUrl.pathname.includes('.')) {
    return NextResponse.next();   // allow request to pass through 
  }

  // 2. Run next-intl middleware first: resolve locale (path → default)
  const response = intlMiddleware(nextReq);

  let resolvedLocale = response.headers.get('x-next-intl-locale') ?? routing.defaultLocale;

  // 3. if no locale was found in pathname, try cookie
  if (!resolvedLocale || !routing.locales.includes(resolvedLocale as any)) {
    const cookieLocale = nextReq.cookies.get('NEXT_LOCALE')?.value;

    if (cookieLocale && routing.locales.includes(cookieLocale as any)) {
      resolvedLocale = cookieLocale;
    }
  }

  // 4. If still no valid locale is found, try Accept-language header
  if (!resolvedLocale || !routing.locales.includes(resolvedLocale as any)) {
    const acceptLang = nextReq.headers.get('accept-language')?.split(',')[0]?.split('-')[0];

    if (acceptLang && routing.locales.includes(acceptLang as any)) {
      resolvedLocale = acceptLang;
    }
  }

  // 5. Persist locale to cookie, When using pathname mode -> Always sync locale into cookie
  if (MODE === 'pathname') {
    response.cookies.set('NEXT_LOCALE', resolvedLocale, {path: '/'});
  }

  return response;
}

// const localeRegex = routing.locales.join('|');

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: [
    '/',  // root
    // `/${`(${localeRegex})`}/:path*`,  // explicit locale path
    '/((?!api|auth|trpc|_next|_vercel|.*\\..*).*)'    // everything else except static/internal paths
  ]
};