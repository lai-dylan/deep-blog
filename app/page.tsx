import { getAllArticles, getAllTags } from '@/lib/articles'
import { HomeClient } from '@/components/HomeClient'

export default function Home() {
  const articles = getAllArticles()
  const tags = getAllTags()

  return <HomeClient articles={articles} tags={tags} />
}
