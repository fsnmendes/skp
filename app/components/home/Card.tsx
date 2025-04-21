interface CardProps {
  title: string
  children: React.ReactNode
  hoverEffect?: boolean
}

export function Card({ title, children, hoverEffect = false }: CardProps) {
  return (
    <div className={`p-8 border rounded-lg bg-white shadow-sm ${hoverEffect ? 'hover:shadow-md transition-shadow' : ''}`}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {children}
    </div>
  )
} 