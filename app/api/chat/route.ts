import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ Missing GEMINI_API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(apiKey || '');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // ป้องกันข้อความยาวเกินไป
    if (message.length > 5000) {
      return NextResponse.json({ error: 'ข้อความยาวเกินไป (จำกัด 5000 ตัวอักษร)' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-thinking-exp-01-21',
    });

    const result = await model.generateContent(message);

    // ดึงข้อความตอบกลับจาก Gemini
    const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || '❌ ไม่พบข้อความตอบกลับ';

    return NextResponse.json({ reply: text });

  } catch (err: any) {
    console.error("❌ Gemini API Error:", err.message || err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
