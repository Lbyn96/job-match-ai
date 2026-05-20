'use client';

import { useState } from 'react';
import ResultsPanel, { AnalysisResult } from '@/components/ResultsPanel';

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [background, setBackground] = useState('');
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!jobDescription.trim() || !background.trim()) {
      setError('请填写职位描述和个人背景');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, background, language }),
      });
      if (!res.ok) throw new Error('分析失败，请重试');
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col px-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between py-4 shrink-0 border-b border-[#1a1a28]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-sm">
            🎯
          </div>
          <span className="font-semibold text-white tracking-tight">
            Job Match AI
          </span>
        </div>
        <div className="flex gap-1 p-0.5 bg-[#111118] border border-[#1e1e2e] rounded-lg">
          {(['zh', 'en'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-150 ${
                language === lang
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {lang === 'zh' ? '中文' : 'English'}
            </button>
          ))}
        </div>
      </header>

      {/* Two-panel layout */}
      <div className="grid grid-cols-2 gap-5 flex-1 min-h-0 py-5">
        {/* Left — Input */}
        <div className="flex flex-col gap-4 h-full overflow-y-auto">
          <div className="card flex-1 flex flex-col gap-3 min-h-0">
            <label className="label">职位描述</label>
            <textarea
              className="textarea-base flex-1"
              placeholder="粘贴完整的职位描述..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="card flex-1 flex flex-col gap-3 min-h-0">
            <label className="label">你的背景 / 简历</label>
            <textarea
              className="textarea-base flex-1"
              placeholder="简述你的工作经历、技术栈、项目经验..."
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-xs px-1">{error}</p>}

          <button
            className="btn-primary w-full shrink-0"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                分析中...
              </span>
            ) : (
              '开始分析 →'
            )}
          </button>
        </div>

        {/* Right — Results */}
        <div className="h-full overflow-y-auto">
          {result ? (
            <ResultsPanel result={result} />
          ) : (
            <div className="card h-full flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#1a1a28] flex items-center justify-center text-2xl">
                ✨
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">等待分析</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  填写左侧内容后点击开始分析
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
