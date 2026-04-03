import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Article } from './types'

const contentDirectory = path.join(process.cwd(), 'content')

function getAllMdFiles(dir: string): string[] {
  const results: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...getAllMdFiles(fullPath))
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath)
    }
  }
  return results
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  const files = getAllMdFiles(contentDirectory)
  const articles: Article[] = []

  for (const filePath of files) {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    const slug = data.slug 
      || filePath.replace(contentDirectory + '/', '').replace(/\.md$/, '')
    
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
