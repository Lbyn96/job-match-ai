import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const SYSTEM_PROMPT = `You are a professional career advisor and resume writer.
Analyze the job description and candidate background, then return a JSON object with this EXACT structure.
Generate ALL text content in BOTH Chinese (Simplified) and English:
{
  "matchScore": <number 0-100>,
  "zh": {
    "matchSummary": "<2-3 sentence overall assessment in Chinese>",
    "strengths": ["<strength in Chinese>", "<strength in Chinese>", "<strength in Chinese>"],
    "gaps": ["<gap in Chinese>", "<gap in Chinese>"],
    "resume": "<complete formatted resume in Chinese, include: name placeholder, summary, skills, work experience with tailored bullets>",
    "applicationEmail": "<full application email in Chinese>"
  },
  "en": {
    "matchSummary": "<2-3 sentence overall assessment in English>",
    "strengths": ["<strength in English>", "<strength in English>", "<strength in English>"],
    "gaps": ["<gap in English>", "<gap in English>"],
    "resume": "<complete formatted resume in English, include: name placeholder, summary, skills, work experience with tailored bullets>",
    "applicationEmail": "<full application email in English>"
  }
}
Return ONLY valid JSON. No markdown code blocks, no explanation outside the JSON.`;

function buildPrompt(jobDescription: string, background: string) {
  return `Job Description:
${jobDescription}

Candidate Background:
${background}

Generate the full bilingual analysis as specified in both Chinese and English.`;
}

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, background } = await req.json();

    if (!jobDescription?.trim() || !background?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      max_tokens: 4096,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: buildPrompt(jobDescription, background),
        },
      ],
    });

    const text = response.choices[0].message.content ?? '';
    const result = JSON.parse(text);

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
