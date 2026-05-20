'use client';

import { useState } from 'react';

export interface AnalysisResult {
  matchScore: number;
  matchSummary: string;
  strengths: string[];
  gaps: string[];
  resume: string;
  applicationEmail: string;
}

function ScoreRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 75 ? '#34d399' : score >= 50 ? '#fbbf24' : '#f87171';
  const label = score >= 75 ? '强匹配' : score >= 50 ? '中等匹配' : '差距较大';

  return (
    <div className="flex items-center gap-5">
      <div className="relative w-20 h-20 shrink-0">
        <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
          <circle
            cx="44"
            cy="44"
            r={r}
            fill="none"
            stroke="#1e1e2e"
            strokeWidth="8"
          />
          <circle
            cx="44"
            cy="44"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${fill} ${circ}`}
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white">{score}</span>
        </div>
      </div>
      <div>
        <div className="text-base font-semibold" style={{ color }}>
          {label}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">匹配分 / 100</p>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-400
                 px-2.5 py-1 rounded-lg border border-[#1e1e2e] hover:border-indigo-500/40
                 transition-all duration-150"
    >
      {copied ? '✓ 已复制' : '复制'}
    </button>
  );
}

type Tab = 'analysis' | 'resume' | 'email';

export default function ResultsPanel({ result }: { result: AnalysisResult }) {
  const [tab, setTab] = useState<Tab>('analysis');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'analysis', label: '匹配分析' },
    { id: 'resume', label: '完整简历' },
    { id: 'email', label: '申请邮件' },
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Score card */}
      <div className="card shrink-0">
        <ScoreRing score={result.matchScore} />
        <p className="text-sm text-gray-400 mt-4 leading-relaxed">
          {result.matchSummary}
        </p>
      </div>

      {/* Tabs */}
      <div className="shrink-0 flex gap-1 p-0.5 bg-[#111118] border border-[#1e1e2e] rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${
              tab === t.id
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {tab === 'analysis' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="card-flat">
              <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-3">
                优势
              </div>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-gray-300 leading-snug"
                  >
                    <span className="text-emerald-500 shrink-0 mt-0.5">›</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-flat">
              <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-3">
                差距
              </div>
              <ul className="space-y-2">
                {result.gaps.map((g, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-gray-300 leading-snug"
                  >
                    <span className="text-amber-500 shrink-0 mt-0.5">›</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === 'resume' && (
          <div className="card-flat">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                完整简历
              </span>
              <CopyButton text={result.resume} />
            </div>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">
              {result.resume}
            </pre>
          </div>
        )}

        {tab === 'email' && (
          <div className="card-flat">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                申请邮件
              </span>
              <CopyButton text={result.applicationEmail} />
            </div>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">
              {result.applicationEmail}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
