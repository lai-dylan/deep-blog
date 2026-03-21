import { getAllTags } from '@/lib/articles'
import { ThemeToggle } from '@/components/ThemeToggle'
import Link from 'next/link'

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              ← 返回
            </Link>
            <span className="font-semibold">标签</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight mb-8">所有标签</h1>
        
        {tags.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[hsl(var(--border))] rounded-lg">
            <p className="text-[hsl(var(--muted-foreground))]">暂无标签</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map(tag => (
              <Link
                key={tag.name}
                href={`/tags/${encodeURIComponent(tag.name)}`}
                className="px-4 py-2 text-sm border border-[hsl(var(--border))] rounded-full hover:bg-[hsl(var(--muted))] transition-colors"
              >
                {tag.name} ({tag.count})
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
