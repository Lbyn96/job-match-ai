import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Job Match AI',
  description: '粘贴职位描述和你的背景，AI 分析匹配度并生成简历和申请邮件',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-[#08080f] text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
