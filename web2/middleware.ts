import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localePrefix: 'always',
})

export const config = {
  // 排除 API 路由、静态文件、Next.js 内部路径
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
