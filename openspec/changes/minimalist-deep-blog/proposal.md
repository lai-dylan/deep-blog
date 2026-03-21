## Why

现有的博客平台要么过于复杂，要么设计臃肿，干扰阅读体验。我需要专注于深度长文的输出，文章不在多而在精。一个极简的、像 opencode 那样清爽的阅读空间，能让读者沉浸在内容中。

## What Changes

构建一个基于 Next.js 的静态博客系统：

- **静态站点生成**：基于 Markdown 文件生成静态 HTML，无需后端
- **极简设计**：纯文字界面，微妙边框，深色/浅色主题切换
- **文章管理**：支持文章列表、文章详情、标签分类、全文搜索
- **代码高亮**：技术长文的代码块支持语法高亮
- **图片支持**：Markdown 中可引用图片，单独存放在 images/ 目录
- **自动化部署**：GitHub Actions 推送自动部署到 GitHub Pages

## Capabilities

### New Capabilities

- `content-management`: Markdown 内容解析、元数据提取、图片处理
- `article-listing`: 文章列表展示、分页、排序
- `article-detail`: 文章详情渲染、代码高亮、目录导航
- `tag-system`: 标签分类、标签云、标签筛选
- `search-functionality`: 全文搜索、搜索建议、搜索结果高亮
- `theme-system`: 深色/浅色主题切换、主题持久化
- `static-deployment`: 静态构建、GitHub Pages 部署

### Modified Capabilities

<!-- 无现有功能需要修改 -->

## Impact

- **技术栈**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **部署**: GitHub Pages (通过 GitHub Actions)
- **构建输出**: 纯静态 HTML/CSS/JS，无需服务器
- **内容格式**: Markdown + YAML frontmatter
- **依赖**: shiki (代码高亮), gray-matter (frontmatter), next-mdx-remote (MDX)
