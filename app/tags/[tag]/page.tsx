import { notFound } from 'next/navigation'
import { getAllTags, getArticlesByTag } from '@/lib/articles'
import { ThemeToggle } from '@/components/ThemeToggle'
import Link from 'next/link'

interface Props {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map(tag => ({
    tag: encodeURIComponent(tag.name),
  }))
}

export async function generateMetadata({ params }: Props) {
  const { tag } = await params
  return { title: `标签: ${decodeURIComponent(tag)} | Deep Blog` }
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const articles = getArticlesByTag(decodedTag)

  if (articles.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/tags" 
              className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              ← 全部标签
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <span className="text-sm text-[hsl(var(--muted-foreground))]">标签</span>
          <h1 className="text-2xl font-bold tracking-tight mt-1">#{decodedTag}</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
            共 {articles.length} 篇文章
          </p>
        </div>

        <div className="space-y-8">
          {articles.map(article => (
            <article key={article.slug} className="group">
              <Link href={`/posts/${article.slug}`} className="block">
                <h2 className="text-xl font-semibold tracking-tight mb-2 group-hover:opacity-80 transition-opacity">
                  {article.title}
                </h2>
                <div className="flex items-center gap-3 text-sm text-[hsl(var(--muted-foreground))] mb-3">
                  <time>{article.date}</time>
                </div>
                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                  {article.summary}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
