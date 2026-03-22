'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Article } from '@/lib/types'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SearchBox } from '@/components/SearchBox'
import Link from 'next/link'

interface HomeProps {
  articles: Article[]
  tags: { name: string; count: number }[]
}

export function HomeClient({ articles, tags }: HomeProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tagFromUrl = searchParams.get('tag')
  const [selectedTag, setSelectedTag] = useState<string | null>(tagFromUrl)

  useEffect(() => {
    const tag = searchParams.get('tag')
    setSelectedTag(tag)
  }, [searchParams])

  const handleTagClick = (tag: string | null) => {
    const url = tag ? `/?tag=${encodeURIComponent(tag)}` : '/'
    window.history.replaceState(null, '', url)
    setSelectedTag(tag)
  }

  const filteredArticles = selectedTag
    ? articles.filter(article => article.tags.includes(selectedTag))
    : articles

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg font-medium tracking-tight hover:opacity-70 transition-opacity">
            DEEP BLOG
          </Link>
          <div className="flex items-center gap-4">
            <SearchBox articles={articles} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTagClick(null)}
                className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                  selectedTag === null
                    ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))] border-[hsl(var(--foreground))]'
                    : 'border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]'
                }`}
              >
                全部 ({articles.length})
              </button>
              {tags.map(tag => (
                <button
                  key={tag.name}
                  onClick={() => handleTagClick(tag.name)}
                  className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                    selectedTag === tag.name
                      ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))] border-[hsl(var(--foreground))]'
                      : 'border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]'
                  }`}
                >
                  {tag.name} ({tag.count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Articles List */}
        <div className="divide-y divide-[hsl(var(--border))]">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[hsl(var(--muted-foreground))]">暂无文章</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
                在 content/ 目录添加 Markdown 文件开始写作
              </p>
            </div>
          ) : (
            filteredArticles.map(article => (
              <article key={article.slug} className="py-3 first:pt-0">
                <h2 className="text-lg font-medium tracking-tight mb-2">
                  <Link 
                    href={`/posts/${article.slug}`} 
                    className="hover:underline underline-offset-4 transition-all cursor-pointer"
                  >
                    {article.title}
                  </Link>
                </h2>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">
                  <time className="tabular-nums">{article.date}</time>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
