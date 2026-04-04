# SmallYoung 技术博客

<p align="center">
  <img src="./public/favicon.png" width="100" />
</p>

这是一个基于 **VitePress** 构建的现代化技术博客站点。主要涵盖 **AI 大模型**、**软件架构**、**智能体 (Agents)** 以及 **前沿技术** 的深度解析与实践分享。

## ✨ 项目特性

- 🚀 **极速体验**：基于 Vite 和 Vue 3，提供近乎瞬间的页面加载速度。
- 🎨 **精美 UI**：集成 Tailwind CSS，支持响应式布局与极简的交互设计。
- 🌓 **深色模式**：完美的深色/浅色模式切换支持。
- 📊 **图表支持**：内置 Mermaid 支持，可在 Markdown 中直接绘制流程图。
- 🔢 **公式渲染**：支持 MathJax3，轻松书写复杂的数学公式。
- 🔍 **本地搜索**：基于 VitePress 原生搜索功能，快速定位文章内容。
- 📈 **SEO 优化**：
  - 自动生成 Google Sitemap。
  - 完善的 Open Graph 与 Twitter Card 元数据。
  - 内置 JSON-LD 结构化数据映射（Article, Breadcrumb, WebSite）。
- 🛠️ **自动化维护**：脚本自动扫描 `docs` 目录生成侧边栏导航。
- 🖼️ **图片优化**：支持图片懒加载及 CDN 自动转换。

## 🛠️ 技术栈

- **Core**: [VitePress](https://vitepress.dev/)
- **Framework**: [Vue 3](https://vuejs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Diagrams**: [Mermaid](https://mermaid.js.org/)
- **Formula**: [MathJax3](https://www.mathjax.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 快速开始

### 前置要求

- Node.js 18+
- npm 或 pnpm

### 安装并启动

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd smallyoung_blog
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```
   启动后，访问 `http://localhost:5173` 即可预览站点。

## 📖 使用教程

### 1. 撰写文章

所有文章存放在 `docs` 目录下。只需按以下步骤操作：

1. 在 `docs` 目录新建一个 `.md` 文件（建议按分类放入子目录）。
2. 在文件头部添加 **Frontmatter**，例如：
   ```yaml
   ---
   title: 我的第一篇 AI 文章
   description: 这是一个关于 AI 的深度解析
   date: 2024-04-04
   tags: [AI, Agent]
   cover: /path/to/cover.jpg
   ---
   ```
3. 运行 `npm run dev`，脚本会自动更新侧边栏。

### 2. 管理侧边栏

侧边栏是根据 `docs` 目录结构自动生成的。运行 `npm run dev` 或 `npm run build` 时，会先执行 `scripts/generate-sidebar.js` 脚本刷新 `.vitepress/sidebar.generated.ts`。

### 3. 配置站点

全局配置位于 `.vitepress/config.ts`。你可以在此修改：
- 站点标题、描述。
- 顶部导航栏 (`nav`)。
- 搜索偏好。
- SEO 相关元数据。

## 🏗️ 部署方式

### 构建生产版本

执行以下命令生成生产环境静态文件：

```bash
npm run build
```

默认生成的静态文件位于目录：`../dist/blog` (可根据项目需求在 `outDir` 修改)。

### 预览构建产物

在部署前，可以使用以下命令预览构建出的静态页面：

```bash
npm run preview
```

## 📂 目录结构

```text
├── .vitepress/          # VitePress 配置、主题及缓存
│   ├── theme/           # 自定义主题组件
│   └── config.ts        # 站点核心配置文件
├── docs/                # 技术文档撰写目录（Markdown 源文件）
├── public/              # 公共静态资源（Favicon, 图片等）
├── scripts/             # 自动化工具脚本（侧边栏生成等）
├── index.md             # 站点首页
├── apps.md              # 应用/工具推荐页面
├── package.json         # 项目依赖与脚本配置
└── tsconfig.json        # TypeScript 配置
```

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 许可协议。

---
Created by **SmallYoung** 
站长地址: [www.smallyoung.cn](https://www.smallyoung.cn)
