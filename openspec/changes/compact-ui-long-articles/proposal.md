## Why

当前UI设计较为宽松，适合中等长度的文章。但考虑到博客定位是"深度长文"，文章篇幅较长，宽松的间距会导致：
- 一屏显示内容过少，需要频繁滚动
- 长文章阅读时视觉疲劳
- 信息密度低，阅读效率下降

需要将UI调整得更紧凑，提升长文阅读体验。

## What Changes

- **紧凑布局**：减少全局padding、margin，提升信息密度
- **文章列表优化**：减少列表项间距，增加每屏显示文章数
- **文章详情优化**：
  - 减小段落间距和行高
  - 紧凑的标题层级间距
  - 代码块更紧凑的padding
- **新增目录导航**：为长文章添加悬浮目录（TOC），方便快速跳转
- **字体大小微调**：在紧凑布局下保持可读性

## Capabilities

### New Capabilities

- `compact-layout`: 全局间距调整，提升信息密度
- `article-toc`: 文章目录导航组件，支持长文快速定位
- `responsive-density`: 根据文章长度自动调整密度（可选优化）

### Modified Capabilities

- `article-listing`: 调整列表项间距，从宽松改为紧凑
- `article-detail`: 调整排版样式，适配长文阅读
- `theme-system`: 保持紧凑布局下的主题一致性

## Impact

- **CSS 调整**: 修改 globals.css 中的 spacing、typography 变量
- **组件更新**: ArticleCard、文章详情页布局调整
- **新增组件**: TableOfContents 悬浮目录组件
- **无破坏性变更**: 纯UI优化，功能保持不变
