'use client'

import { useState, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
  inline?: boolean
}

export function CodeBlock({ children, className, inline }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial theme
    const theme = document.documentElement.getAttribute('data-theme')
    setIsDark(theme === 'dark')

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme')
          setIsDark(newTheme === 'dark')
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  if (inline) {
    return (
      <code className={className}>
        {children}
      </code>
    )
  }

  const handleCopy = async () => {
    const code = String(children).replace(/\n$/, '')
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Extract language from className (e.g., "language-typescript" -> "typescript")
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : 'text'

  const code = String(children).replace(/\n$/, '')

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 p-1.5 rounded bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[hsl(var(--foreground))]"
        aria-label="Copy code"
      >
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        )}
      </button>
      
      <div className="rounded-lg overflow-hidden bg-[hsl(var(--muted))]">
        <SyntaxHighlighter
          language={language}
          style={isDark ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            padding: '0.75rem',
            fontSize: '0.845rem',
            lineHeight: '1.5',
            background: 'transparent',
          }}
          codeTagProps={{
            style: {
              fontSize: '0.845rem',
              lineHeight: '1.5',
            }
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
