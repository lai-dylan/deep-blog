'use client'

import { useRouter } from 'next/navigation'

export function BackButton() {
  const router = useRouter()
  
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }
  
  return (
    <button 
      onClick={handleBack}
      className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors cursor-pointer"
    >
      ← Back
    </button>
  )
}