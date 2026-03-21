export interface Article {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
  content: string
}

export interface TagInfo {
  name: string
  count: number
}
