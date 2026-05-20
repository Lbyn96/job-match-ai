import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const SYSTEM_PROMPT = `You are a professional career advisor and resume writer. 
Analyze the job description and candidate background, then return a JSON object with this exact structure:
{
  "matchScore": <number 0-100>,
  "matchSummary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>"],
  "resume": "<complete formatted resume as plain text, include: name placeholder, summary, skills, work experience with tailored bullets, ready to copy-paste>",
  "applicationEmail": "<full application email text>"
}
Return ONLY valid JSON. No markdown code blocks, no explanation outside the JSON.`;

function buildPrompt(
  jobDescription: string,
  background: string,
  language: string,
) {
  const lang = language === 'zh' ? 'Chinese (Simplified)' : 'English';
  return `Job Description:
${jobDescription}

Candidate Background:
${background}

Output language: ${lang}

Analyze the match and generate all materials in ${lang}.`;
}

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, background, language = 'zh' } = await req.json();

    if (!jobDescription?.trim() || !background?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      max_tokens: 2048,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: buildPrompt(jobDescription, background, language),
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
