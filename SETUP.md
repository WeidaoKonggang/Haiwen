# 海问 HQ — 完整部署文档

> 适用于：零开发经验的操作者
> 预计完成时间：30–60 分钟

---

## 目录

1. [本地开发环境搭建](#1-本地开发环境搭建)
2. [Supabase 配置（注册登录）](#2-supabase-配置注册登录)
3. [DeepSeek API 配置（AI问答）](#3-deepseek-api-配置ai问答)
4. [本地运行测试](#4-本地运行测试)
5. [GitHub 上传代码](#5-github-上传代码)
6. [Vercel 部署上线](#6-vercel-部署上线)
7. [上线后配置](#7-上线后配置)
8. [常见问题排查](#8-常见问题排查)

---

## 1. 本地开发环境搭建

### 1.1 确认 Node.js 已安装

打开命令行（Windows：按 `Win+R`，输入 `cmd`，回车），运行：

```bash
node -v
npm -v
```

两行都输出版本号（如 `v20.x.x`）即为正常。

### 1.2 进入项目目录并安装依赖

```bash
cd D:\keyboard\XJTLU\Y3S2\ENT208TC\web2
npm install
```

等待安装完成（约 1–3 分钟，会下载 node_modules 文件夹）。

### 1.3 创建环境变量文件

```bash
copy .env.local.example .env.local
```

然后用任意文本编辑器打开 `.env.local` 文件（记事本即可），按下面步骤填入真实值。

---

## 2. Supabase 配置（注册登录）

### 2.1 创建 Supabase 项目

1. 访问 https://supabase.com，点击 **Start your project**
2. 用 GitHub 账号登录
3. 点击 **New project**，填写：
   - **Project name**：hq-haiwhen（或任意名称）
   - **Database Password**：设置一个强密码并记住
   - **Region**：选 **Southeast Asia (Singapore)**（距离中国最近）
4. 点击 **Create new project**，等待约 2 分钟初始化完成

### 2.2 获取 API Keys

项目创建完成后：
1. 点击左侧菜单 **Settings（设置图标）**
2. 点击 **API**
3. 复制以下两个值，填入 `.env.local`：

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co        ← Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...    ← anon / public key
```

### 2.3 配置邮件验证回调 URL（重要）

1. 在 Supabase 控制台，点击左侧 **Authentication**
2. 点击 **URL Configuration**
3. 在 **Site URL** 填入：`http://localhost:3000`
4. 在 **Redirect URLs** 添加：
   - `http://localhost:3000/api/auth/callback`
   - （部署后再添加）`https://你的域名.vercel.app/api/auth/callback`

### 2.4 （可选）关闭邮件验证，方便测试

测试阶段可以关闭邮件验证要求：
1. **Authentication** → **Providers** → **Email**
2. 关闭 **Confirm email** 开关
3. 这样注册后无需验证邮件即可登录

---

## 3. DeepSeek API 配置（AI问答）

### 3.1 注册 DeepSeek 开发者账号

1. 访问 https://platform.deepseek.com
2. 注册账号（支持国内手机号）
3. 完成实名认证

### 3.2 获取 API Key

1. 登录后，点击左侧 **API Keys**
2. 点击 **Create new API key**
3. 复制生成的 Key（格式：`sk-xxxxxxxx`）
4. 填入 `.env.local`：

```
DEEPSEEK_API_KEY=sk-你的密钥
```

### 3.3 充值说明

- DeepSeek 新用户有免费额度（约 500万 tokens）
- 正式使用建议充值 ¥10–20（deepseek-chat 约 ¥1/百万tokens，非常便宜）
- 课程演示期间免费额度完全够用

---

## 4. 本地运行测试

填好 `.env.local` 后，在项目目录运行：

```bash
npm run dev
```

看到以下输出表示启动成功：

```
▲ Next.js 14.2.5
- Local:  http://localhost:3000
✓ Ready in 2.1s
```

打开浏览器访问 http://localhost:3000，应该能看到海问 HQ 首页。

### 测试清单

- [ ] 首页正常显示，中英文切换有效
- [ ] 注册新账号（会收到验证邮件或直接登录）
- [ ] 登录后能进入智能问答页
- [ ] 发送问题，AI 正常流式回复
- [ ] 案例库能搜索和筛选
- [ ] 手机端访问布局正常

---

## 5. GitHub 上传代码

Vercel 需要通过 GitHub 部署，所以先要把代码上传到 GitHub。

### 5.1 安装 Git

下载安装：https://git-scm.com/download/win
安装时所有选项保持默认即可。

### 5.2 在 GitHub 创建仓库

1. 访问 https://github.com，登录
2. 点击右上角 **+** → **New repository**
3. **Repository name**：`hq-haiwhen`（或任意名称）
4. 选择 **Private**（私有，保护 API Key 安全）
5. **不要**勾选 Initialize with README
6. 点击 **Create repository**
7. 复制页面显示的仓库地址（格式：`https://github.com/你的用户名/hq-haiwhen.git`）

### 5.3 上传代码

在项目目录（D:\keyboard\XJTLU\Y3S2\ENT208TC\web2）的命令行中运行：

```bash
git init
git add .
git commit -m "Initial commit: HQ HaiWen website"
git branch -M main
git remote add origin https://github.com/你的用户名/hq-haiwhen.git
git push -u origin main
```

输入 GitHub 用户名和密码（或 Token）后，代码上传完成。

> **注意**：`.env.local` 文件已在 `.gitignore` 中，不会被上传，API Key 安全。

---

## 6. Vercel 部署上线

### 6.1 连接 GitHub

1. 访问 https://vercel.com，点击 **Sign Up**
2. 选择 **Continue with GitHub**，授权登录
3. 点击 **New Project**

### 6.2 导入项目

1. 在项目列表中找到 `hq-haiwhen`，点击 **Import**
2. Framework 会自动识别为 **Next.js**
3. **不要**直接点 Deploy，先配置环境变量

### 6.3 配置环境变量（关键步骤）

点击 **Environment Variables**，逐一添加以下三个变量：

| 变量名 | 值 |
|--------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase Anon Key |
| `DEEPSEEK_API_KEY` | 你的 DeepSeek API Key |

### 6.4 部署

点击 **Deploy**，等待 2–5 分钟。

部署成功后，Vercel 会给你一个域名，格式：`https://hq-haiwhen-xxx.vercel.app`

### 6.5 更新 Supabase 回调 URL

部署完成后，回到 Supabase：
1. **Authentication** → **URL Configuration**
2. **Site URL** 改为：`https://hq-haiwhen-xxx.vercel.app`
3. **Redirect URLs** 添加：`https://hq-haiwhen-xxx.vercel.app/api/auth/callback`

---

## 7. 上线后配置

### 7.1 后续代码更新

本地修改代码后，运行：

```bash
git add .
git commit -m "更新说明"
git push
```

Vercel 会自动检测到 GitHub 更新并重新部署（约 1–2 分钟）。

### 7.2 更新环境变量

在 Vercel 控制台：**Settings** → **Environment Variables**，可随时修改（修改后需重新部署生效）。

### 7.3 添加更多案例

编辑 `lib/cases-data.ts` 文件，按现有格式添加新的案例对象，然后推送到 GitHub 即可。

---

## 8. 常见问题排查

### Q: `npm install` 报错
**解决**：确认 Node.js 已安装（`node -v` 有输出），且在正确的目录下执行命令。

### Q: 首页打开报错 "supabase not configured"
**解决**：检查 `.env.local` 文件是否存在，变量名是否拼写正确，没有多余空格。

### Q: AI 问答显示"API服务暂未配置"
**解决**：检查 `DEEPSEEK_API_KEY` 是否已正确填写，以 `sk-` 开头。

### Q: 注册后无法登录 / 验证邮件收不到
**解决**：在 Supabase → Authentication → Email Providers，关闭 **Confirm email**，或检查垃圾邮件箱。

### Q: Vercel 部署失败
**解决**：查看 Vercel 的 Build Logs，常见原因是环境变量未配置或代码有语法错误。

### Q: 中英文切换后页面报错
**解决**：清除浏览器缓存（Ctrl+Shift+R），或检查 `messages/` 目录下的 JSON 文件格式。

---

## API 技术文档（供开发参考）

### AI 问答 API

**端点**：`POST /api/chat`

**请求体**：
```json
{
  "messages": [
    { "role": "user", "content": "用户的问题" }
  ],
  "locale": "zh"
}
```

**响应**：Server-Sent Events (SSE) 流式文本，格式与 OpenAI 兼容：
```
data: {"choices":[{"delta":{"content":"回答片段"}}]}
data: [DONE]
```

**错误码**：
- `503 API_KEY_NOT_CONFIGURED`：DeepSeek API Key 未配置
- `500 INTERNAL_ERROR`：服务器内部错误
- `upstream status`：DeepSeek API 返回错误

### 替换 AI 模型

如需替换为其他模型，编辑 `app/api/chat/route.ts`：

```typescript
// 替换为 OpenAI
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
  body: JSON.stringify({ model: 'gpt-4o', ... })
})

// 替换为阿里云通义千问
const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
  headers: { Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}` },
  body: JSON.stringify({ model: 'qwen-plus', ... })
})
```

任何兼容 OpenAI API 格式（`/chat/completions` + SSE）的模型均可直接替换。

---

*文档版本：v1.0 | 适用：ENT208TC 课程项目 | 海问 HQ*
