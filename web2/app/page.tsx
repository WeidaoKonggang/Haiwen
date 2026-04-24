import { redirect } from 'next/navigation'

// 根路径自动跳转到中文首页
export default function RootPage() {
  redirect('/zh')
}
