'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  locale: string
}

export default function ChatInterface({ locale }: Props) {
  const t = useTranslations('chat')

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const suggestions = [
    t('suggestion1'),
    t('suggestion2'),
    t('suggestion3'),
    t('suggestion4'),
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 自动调整输入框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px'
    }
  }, [input])

  const sendMessage = async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed || isLoading) return

    setShowWelcome(false)
    setInput('')

    const userMsg: Message = { role: 'user', content: trimmed }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setIsLoading(true)

    // 先添加一个空的 assistant 消息用于流式填充
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, locale }),
      })

      if (!response.ok) {
        const err = await response.json()
        const errorMsg =
          err.error === 'API_KEY_NOT_CONFIGURED' ? t('noKey') : t('error')
        setMessages((prev) => {
          const msgs = [...prev]
          msgs[msgs.length - 1] = { role: 'assistant', content: errorMsg }
          return msgs
        })
        return
      }

      // 读取 SSE 流
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine || trimmedLine === 'data: [DONE]') continue
          if (trimmedLine.startsWith('data: ')) {
            try {
              const json = JSON.parse(trimmedLine.slice(6))
              const delta = json.choices?.[0]?.delta?.content
              if (delta) {
                setMessages((prev) => {
                  const msgs = [...prev]
                  msgs[msgs.length - 1] = {
                    role: 'assistant',
                    content: msgs[msgs.length - 1].content + delta,
                  }
                  return msgs
                })
              }
            } catch {
              // 忽略解析错误
            }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const msgs = [...prev]
        msgs[msgs.length - 1] = { role: 'assistant', content: t('error') }
        return msgs
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setShowWelcome(true)
    setInput('')
  }

  return (
    <div className="flex h-full">
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-100 bg-gray-50 p-4">
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('newChat')}
        </button>

        <div className="text-xs text-gray-400 font-medium mb-3 px-1">{t('history')}</div>

        {messages.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-600 truncate cursor-pointer hover:bg-gray-50">
            {messages[0]?.content?.slice(0, 30)}...
          </div>
        )}

        {messages.length === 0 && (
          <div className="text-xs text-gray-300 text-center mt-8">
            {locale === 'zh' ? '暂无历史对话' : 'No history yet'}
          </div>
        )}
      </aside>

      {/* ── Main chat area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Welcome screen */}
            {showWelcome && (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">HQ</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('welcome')}</h2>
                <p className="text-gray-500 text-sm whitespace-pre-line leading-relaxed max-w-md mx-auto mb-8">
                  {t('welcomeDesc')}
                </p>

                {/* Suggestion chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s)}
                      className="text-left text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message list */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">HQ</span>
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-gray-100 text-gray-800 rounded-tl-sm prose-chat'
                  }`}
                >
                  {msg.content || (
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── Input area ── */}
        <div className="border-t border-gray-100 bg-white px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('placeholder')}
                rows={1}
                disabled={isLoading}
                className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 placeholder:text-gray-400 min-h-[24px] max-h-40"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="shrink-0 w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
              {locale === 'zh'
                ? 'Enter 发送 · Shift+Enter 换行 · 内容由AI生成，仅供参考'
                : 'Enter to send · Shift+Enter for new line · AI-generated content for reference only'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
