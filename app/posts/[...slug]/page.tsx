import { notFound } from 'next/navigation'
import { getAllArticles, getArticleBySlug } from '@/lib/articles'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SearchBox } from '@/components/SearchBox'
import { TableOfContents } from '@/components/TableOfContents'
import { CodeBlock } from '@/components/CodeBlock'
import { BackButton } from '@/components/BackButton'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { Components } from 'react-markdown'

interface Props {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map(article => ({
    slug: article.slug.split('/'),
  }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const slugString = slug.join('/')
  const article = getArticleBySlug(slugString)
  if (!article) return { title: 'Not Found' }
  return { title: `${article.title} | Deep Blog` }
}

// Track IDs to handle duplicates
const idCounts: Record<string, number> = {}

function generateId(text: string): string {
  let id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
  
  if (idCounts[id]) {
    idCounts[id]++
    id = `${id}-${idCounts[id]}`
  } else {
    idCounts[id] = 1
  }
  
  return id
}

// Custom components for ReactMarkdown to add IDs to headings
const components: Components = {
  h2: ({ children, ...props }) => {
    const id = generateId(children?.toString() || '')
    return (
      <h2 id={id} {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ children, ...props }) => {
    const id = generateId(children?.toString() || '')
    return (
      <h3 id={id} {...props}>
        {children}
      </h3>
    )
  },
  code: ({ children, className }) => {
    const isInline = !className?.includes('language-')
    return (
      <CodeBlock className={className} inline={isInline}>
        {children}
      </CodeBlock>
    )
  },
  pre: ({ children }) => {
    return <>{children}</>
  },
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const slugString = slug.join('/')
  const article = getArticleBySlug(slugString)
  const articles = getAllArticles()

  if (!article) {
    notFound()
  }

  // Reset ID counters for each article render
  Object.keys(idCounts).forEach(key => delete idCounts[key])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <BackButton />
          <div className="flex items-center gap-4">
            <SearchBox articles={articles} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <TableOfContents content={article.content} />

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--muted-foreground))]">
            <time>{article.date}</time>
            {article.tags.length > 0 && (
              <>
                <span>·</span>
                <div className="flex gap-1.5">
                  {article.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/?tag=${encodeURIComponent(tag)}`}
                      className="hover:text-[hsl(var(--foreground))] transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{article.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}