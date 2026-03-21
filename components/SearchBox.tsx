'use client'

import { useState, useEffect } from 'react'
import { Article } from '@/lib/types'

interface SearchBoxProps {
  articles: Article[]
}

export function SearchBox({ articles }: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Article[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const lowerQuery = query.toLowerCase()
    const filtered = articles.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) ||
      article.summary.toLowerCase().includes(lowerQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
    setResults(filtered.slice(0, 5))
  }, [query, articles])

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="搜索文章..."
          className="w-64 pl-9 pr-4 py-2 bg-transparent border border-[hsl(var(--border))] rounded-md text-sm placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--foreground))]"
        />
        <svg 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      </div>
      
      {isOpen && (query.length >= 2 || results.length > 0) && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-md shadow-lg z-50">
            {results.length > 0 ? (
              results.map(article => (
                <a
                  key={article.slug}
                  href={`/posts/${article.slug}`}
                  className="block px-4 py-2 hover:bg-[hsl(var(--muted))] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="font-medium text-sm">{article.title}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1 line-clamp-1">
                    {article.summary}
                  </div>
                </a>
              ))
            ) : query.length >= 2 ? (
              <div className="px-4 py-2 text-sm text-[hsl(var(--muted-foreground))]">
                未找到相关文章
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}
