'use client'

import { useRouter, usePathname } from 'next/navigation'

interface Props {
  locale: string
}

export default function LanguageSwitcher({ locale }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const switchTo = (newLocale: string) => {
    // 把 URL 中的 locale 前缀替换掉
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
      <button
        onClick={() => switchTo('zh')}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
          locale === 'zh'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        中文
      </button>
      <button
        onClick={() => switchTo('en')}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
          locale === 'en'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        EN
      </button>
    </div>
  )
}
