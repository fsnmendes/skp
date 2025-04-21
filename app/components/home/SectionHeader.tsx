interface SectionHeaderProps {
  title: string
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-1 flex-1 bg-gray-200"></div>
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      <div className="h-1 flex-1 bg-gray-200"></div>
    </div>
  )
} 