import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity">
            Deep Blog
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">404</h1>
          <p className="text-[hsl(var(--muted-foreground))] mb-6">页面未找到</p>
          <Link 
            href="/"
            className="text-sm border border-[hsl(var(--border))] px-4 py-2 rounded-md hover:bg-[hsl(var(--muted))] transition-colors"
          >
            返回首页
          </Link>
        </div>
      </main>
    </div>
  )
}
