'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Extract H2 and H3 headings from markdown content
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const matches: Heading[] = []
    let match

    const idCounts: Record<string, number> = {}
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      let id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      
      // Handle duplicate IDs
      if (idCounts[id]) {
        idCounts[id]++
        id = `${id}-${idCounts[id]}`
      } else {
        idCounts[id] = 1
      }
      
      matches.push({ id, text, level })
    }

    setHeadings(matches)
  }, [content])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -60% 0px' }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  const handleClick = (id: string) => {
    setIsOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="xl:hidden fixed bottom-6 right-6 z-50 p-3 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-full shadow-lg hover:bg-[hsl(var(--muted))] transition-colors"
        aria-label="Toggle table of contents"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="6" x2="20" y2="6"></line>
          <line x1="4" y1="12" x2="20" y2="12"></line>
          <line x1="4" y1="18" x2="20" y2="18"></line>
        </svg>
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="xl:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute bottom-20 right-6 w-72 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg shadow-xl p-4 max-h-[60vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold mb-3 text-[hsl(var(--muted-foreground))]">
              目录
            </h3>
            <nav className="space-y-1">
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => handleClick(heading.id)}
                  className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                    heading.level === 3 ? 'pl-4' : ''
                  } ${
                    activeId === heading.id
                      ? 'text-[hsl(var(--foreground))] bg-[hsl(var(--muted))]'
                      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
                  }`}
                >
                  {heading.text}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar - show on xl screens and up */}
      <aside className="hidden xl:block fixed right-[max(1rem,calc((100vw-48rem)/2-12rem))] top-24 w-44 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <div className="border-l border-[hsl(var(--border))] pl-4">
          <h3 className="text-xs font-semibold mb-3 text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
            目录
          </h3>
          <nav className="space-y-0.5">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => handleClick(heading.id)}
                className={`block w-full text-left text-sm py-0.5 px-2 rounded transition-colors ${
                  heading.level === 3 ? 'pl-4 text-xs' : ''
                } ${
                  activeId === heading.id
                    ? 'text-[hsl(var(--foreground))] bg-[hsl(var(--muted))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                }`}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}
