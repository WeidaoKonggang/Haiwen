import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '海问 HQ — AI出海与ESG创新咨询',
  description: '中国人工智能企业出海与ESG创新的自助决策咨询平台',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  )
}
