import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: Parameters<typeof intlMiddleware>[0]) {
  const response = intlMiddleware(request);
  const match = request.nextUrl.pathname.match(/^\/(en|ko|mn)(?=\/|$)/);
  const locale = match ? match[1] : routing.defaultLocale;
  if (response) {
    response.headers.set('x-locale', locale);
  }
  return response;
}

export const config = {
  matcher: ['/((?!api|studio|_next|_vercel|.*\\..*).*)'],
};
