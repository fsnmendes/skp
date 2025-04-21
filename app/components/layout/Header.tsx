import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex items-center justify-center py-8 mb-8">
      <Link href="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
        <Image
          src="/images/referee-logo.png"
          alt="SKP Referee Logo"
          width={48}
          height={48}
          className="w-12 h-12 rounded-lg"
          priority
        />
        <h1 className="text-2xl font-bold">SomeKnowledgeProof</h1>
      </Link>
    </header>
  )
} 