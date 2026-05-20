# Job Match AI

AI 驱动的求职助手：粘贴职位描述和个人背景，自动分析匹配度、生成定制简历和申请邮件。

## 功能

- **匹配分析** — 可视化匹配分数（0-100），列出优势与差距
- **简历生成** — 根据岗位需求生成完整简历，可直接复制使用
- **申请邮件** — 自动生成求职邮件草稿
- **双语支持** — 中文 / English 切换

## 技术栈

- **Next.js 16** (App Router) + TypeScript
- **DeepSeek API** (`deepseek-chat` 模型，OpenAI 兼容接口)
- **TailwindCSS 3**

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local，填入你的 DeepSeek API Key

# 3. 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 环境变量

| 变量名             | 说明              | 获取地址                                               |
| ------------------ | ----------------- | ------------------------------------------------------ |
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | [platform.deepseek.com](https://platform.deepseek.com) |

## 使用方式

1. 左侧粘贴**职位描述**（JD）
2. 左侧填写**个人背景**（工作经历、技能等）
3. 点击「分析匹配」
4. 右侧查看分析结果，切换 Tab 获取简历和邮件
