import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Article } from './types'

const contentDirectory = path.join(process.cwd(), 'content')

export function getAllArticles(): Article[] {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  const files = fs.readdirSync(contentDirectory)
  const articles: Article[] = []

  for (const file of files) {
    if (!file.endsWith('.md')) continue

    const filePath = path.join(contentDirectory, file)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    const slug = data.slug || file.replace(/\.md$/, '')
    
    // Ensure date is always a string
    let dateStr: string
    if (data.date) {
      if (data.date instanceof Date) {
        dateStr = data.date.toISOString().split('T')[0]
      } else {
        dateStr = String(data.date)
      }
    } else {
      dateStr = new Date().toISOString().split('T')[0]
    }
    
    articles.push({
      slug,
      title: data.title || slug,
      date: dateStr,
      tags: data.tags || [],
      summary: data.summary || content.slice(0, 200).replace(/[#*\[\]`]/g, '') + '...',
      content,
    })
  }

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getArticleBySlug(slug: string): Article | null {
  const articles = getAllArticles()
  return articles.find(article => article.slug === slug) || null
}

export function getAllTags(): { name: string; count: number }[] {
  const articles = getAllArticles()
  const tagCounts: Record<string, number> = {}

  for (const article of articles) {
    for (const tag of article.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    }
  }

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getArticlesByTag(tag: string): Article[] {
  const articles = getAllArticles()
  return articles.filter(article => article.tags.includes(tag))
}
