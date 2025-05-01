'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import axios from 'axios'

export default function Home() {
  const [input, setInput] = useState('')
  const [chat, setChat] = useState<{ type: 'user' | 'bot', text: string }[]>([])
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  // เลื่อนลงล่างอัตโนมัติเมื่อมีข้อความใหม่
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat])

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    setInput('')
    setChat(prev => [...prev, { type: 'user', text: trimmed }])
    setLoading(true)

    try {
      const res = await axios.post('/api/chat', { message: trimmed })

      // แสดงข้อความที่ตอบกลับ
      if (res.data.reply) {
        setChat(prev => [...prev, { type: 'bot', text: res.data.reply }])
      } else {
        setChat(prev => [...prev, { type: 'bot', text: '❌ ไม่มีข้อความตอบกลับจากระบบ' }])
      }
    } catch (err: any) {
      console.error('❌ API Error:', err?.response?.data || err.message || err)
      const errorMsg = err?.response?.data?.error || '❌ ระบบเกิดข้อผิดพลาด'
      setChat(prev => [...prev, { type: 'bot', text: errorMsg }])
    } finally {
      setLoading(false)
    }
  }, [input, loading])

  return (
    <div className="min-h-screen bg-white text-black p-6 flex flex-col">
      <header className="text-3xl font-bold text-center mb-6">
        💬 Gemini AI Chatbot
      </header>

      <main className="flex-1 overflow-y-auto space-y-4 px-2 max-w-2xl mx-auto w-full">
        {chat.map((c, i) => (
          <div
            key={i}
            className={`rounded-xl px-4 py-2 max-w-[80%] whitespace-pre-wrap ${
              c.type === 'user'
                ? 'ml-auto bg-blue-600 text-white'
                : 'mr-auto bg-gray-100 text-black'
            }`}
          >
            {c.text}
          </div>
        ))}
        {loading && (
          <div className="mr-auto bg-gray-100 text-black px-4 py-2 rounded-xl max-w-[80%]">
            ⏳ กำลังประมวลผล...
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      <footer className="flex mt-4 max-w-2xl mx-auto w-full">
        <input
          type="text"
          placeholder="พิมพ์ข้อความ..."
          className="flex-1 border border-gray-300 rounded-l-xl p-3 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <button
          className={`px-6 py-3 rounded-r-xl transition text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? 'ส่ง...' : 'ส่ง'}
        </button>
      </footer>
    </div>
  )
}
