import ChatInterface from '@/components/ChatInterface'

export default async function AiChatPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <div style={{ height: 'calc(100vh - 64px)' }}>
      <ChatInterface locale={locale} />
    </div>
  )
}
