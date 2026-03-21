## Context

这是一个从零开始的静态博客项目。目标是为深度长文打造一个极简、无干扰的阅读环境，风格参考 opencode 的纯文字界面。整个系统基于 Markdown 文件，构建后生成纯静态站点，部署到 GitHub Pages。

## Goals / Non-Goals

**Goals:**
- 极简的纯文字界面设计，减少视觉干扰
- 完全静态化输出，支持 GitHub Pages 部署
- 支持 Markdown 写作，包含 frontmatter 元数据
- 完整的文章生命周期：列表、详情、标签、搜索
- 代码语法高亮和深色/浅色主题切换

**Non-Goals:**
- 动态内容、用户评论系统
- 后端数据库或 API
- 复杂的 CMS 管理界面
- 实时协作或 WebSocket 功能
- 多用户支持

## Decisions

### 1. 使用 Next.js + Static Export

**Decision**: 采用 Next.js 15 的 App Router + `output: 'export'` 静态导出模式

**Rationale**:
- Next.js 支持 React 18+ 特性（Server Components、Suspense）
- Static Export 生成纯静态 HTML，完美适配 GitHub Pages
- App Router 的文件夹结构清晰，适合内容驱动型站点
- 支持 ISR（增量静态再生）为未来扩展留空间

**Alternative Considered**:
- Astro: 更快的构建速度，但 Next.js 生态更成熟，TypeScript 支持更好
- VitePress: 更适合文档站点，博客场景灵活性不足

### 2. 静态站点搜索方案

**Decision**: 构建时生成搜索索引 JSON，前端使用 Fuse.js 进行模糊搜索

**Rationale**:
- 纯静态站点无法使用传统后端搜索
- 构建时提取所有文章内容生成搜索索引
- Fuse.js 轻量（<10KB）、支持模糊匹配、客户端即时响应
- 搜索索引随构建更新，无需额外服务

**Implementation**:
```
构建流程:
1. 扫描 content/ 目录所有 .md 文件
2. 提取 title, summary, tags, content 前500字符
3. 生成 public/search-index.json
4. 页面加载后异步获取索引
5. Fuse.js 在客户端执行搜索
```

### 3. 主题系统设计

**Decision**: CSS 变量 + localStorage + 系统偏好检测

**Rationale**:
- Tailwind CSS 的 dark: 变体配合 data-theme 属性
- localStorage 持久化用户选择
- prefers-color-scheme 媒体查询检测系统主题
- 无闪烁的 SSR 方案：通过 inline script 在页面渲染前设置主题

**Implementation**:
```typescript
// 防止闪烁的关键：在 <head> 中内联执行
const themeScript = `
  (function() {
    const theme = localStorage.getItem('theme') || 'system';
    const isDark = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  })();
`;
```

### 4. 代码高亮方案

**Decision**: Shiki（构建时高亮）

**Rationale**:
- Shiki 使用 VS Code 的语法引擎，准确性最高
- 构建时高亮，减少客户端 JS 体积
- 支持 100+ 语言和丰富的主题
- 生成的 HTML 是纯静态的，无需客户端运行时

**Implementation**:
- 使用 @shikijs/rehype 插件在 MDX 编译时处理代码块
- 主题：GitHub Light / GitHub Dark 匹配博客主题

### 5. 文章数据结构

**Decision**: 文件系统作为数据库，YAML frontmatter 存储元数据

**Schema**:
```yaml
---
title: 文章标题
date: 2024-01-15
tags: [技术, 前端, React]
summary: 文章摘要，用于列表页展示
slug: optional-custom-url-slug  # 可选，默认为文件名
---
```

**Implementation**:
- content/ 目录存放所有文章
- 文件名格式：`YYYY-MM-DD-title.md` 或自定义 slug
- 构建时通过 gray-matter 解析 frontmatter
- 图片放在 public/images/ 目录，Markdown 中通过相对路径引用

### 6. 路由结构设计

**URL 结构**:
```
/                    # 首页 - 文章列表（按时间倒序）
/posts/[slug]        # 文章详情页
/tags                # 标签云页面
/tags/[tag]          # 特定标签的文章列表
/search              # 搜索结果页（前端路由，无实际页面）
```

**Rationale**:
- 扁平化 URL，易于记忆和分享
- 标签系统支持内容发现
- 搜索为客户端路由，不生成独立页面

### 7. 部署流程

**Decision**: GitHub Actions 自动部署到 GitHub Pages

**流程**:
1. Push 到 main 分支触发 workflow
2. 安装依赖：`npm ci`
3. 构建：`next build`
4. 部署：`actions/deploy-pages` 推送 dist/ 到 gh-pages 分支

**Configuration**:
- next.config.js 设置 `basePath` 匹配仓库名（如 `/deep-blog`）
- GitHub Pages 设置为从 gh-pages 分支部署

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| 文章数量增多后构建时间变长 | 增量构建（未来），目前内容量少无影响 |
| 搜索索引文件过大 | 只索引必要字段（title, summary, tags），内容截断前500字符 |
| 无服务器端分析统计 | 使用 Google Analytics 或 Umami 等第三方统计 |
| GitHub Pages 自定义域名 HTTPS | 支持，配置 CNAME 文件即可 |
| 图片存储在仓库导致体积膨胀 | 使用外部图床（如 Cloudinary）或 Git LFS |

## Migration Plan

本项目为新项目，无需迁移。部署步骤：

1. 初始化 GitHub 仓库
2. 配置 GitHub Pages 从 Actions 部署
3. 推送代码触发自动部署
4. 可选：绑定自定义域名

## Open Questions

1. 是否需要 RSS/Atom feed？（建议后期添加）
2. 是否支持文章系列（Series）功能？（建议后期添加）
3. 404 页面设计风格？（保持极简，纯文字提示）
