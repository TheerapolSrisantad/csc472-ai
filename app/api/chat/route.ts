import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-thinking-exp-01-21',
      });


    const result = await model.generateContent(message);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("❌ API Error:", err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
