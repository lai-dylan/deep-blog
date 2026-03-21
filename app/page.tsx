import { getAllArticles, getAllTags } from '@/lib/articles'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SearchBox } from '@/components/SearchBox'
import Link from 'next/link'

export default function Home() {
  const articles = getAllArticles()
  const tags = getAllTags()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity">
            Deep Blog
          </Link>
          <div className="flex items-center gap-4">
            <SearchBox articles={articles} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Intro */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            深度长文
          </h1>
          <p className="text-[hsl(var(--muted-foreground))] text-lg">
            文章不在多，而在精。专注深度思考与长期价值。
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/tags"
                className="px-3 py-1 text-sm border border-[hsl(var(--border))] rounded-full hover:bg-[hsl(var(--muted))] transition-colors"
              >
                全部标签
              </Link>
              {tags.slice(0, 8).map(tag => (
                <Link
                  key={tag.name}
                  href={`/tags/${encodeURIComponent(tag.name)}`}
                  className="px-3 py-1 text-sm border border-[hsl(var(--border))] rounded-full hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  {tag.name} ({tag.count})
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Articles List */}
        <div className="space-y-8">
          {articles.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[hsl(var(--border))] rounded-lg">
              <p className="text-[hsl(var(--muted-foreground))]">暂无文章</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
                在 content/ 目录添加 Markdown 文件开始写作
              </p>
            </div>
          ) : (
            articles.map(article => (
              <article key={article.slug} className="group">
                <Link href={`/posts/${article.slug}`} className="block">
                  <h2 className="text-xl font-semibold tracking-tight mb-2 group-hover:opacity-80 transition-opacity">
                    {article.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-[hsl(var(--muted-foreground))] mb-3">
                    <time>{article.date}</time>
                    {article.tags.length > 0 && (
                      <>
                        <span>·</span>
                        <div className="flex gap-2">
                          {article.tags.map(tag => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                    {article.summary}
                  </p>
                </Link>
              </article>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))] mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-sm text-[hsl(var(--muted-foreground))] text-center">
            © 2024 Deep Blog. Built with Next.js & Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  )
}
