// src/components/common/AttributeCard.tsx

'use client'

interface AttributeCardProps {
  title: string
  icon?: React.ReactNode
  text: string
  href?: string | null
}

const AttributeCard = ({ title, icon, text, href }: AttributeCardProps) => {
  if (!href) href = undefined

  return (
    <div className="card bg-base-300 shadow-lg w-50 h-32">
      <div className="card-body items-center justify-center">
        <h1 className="items-center">{icon}</h1>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex flex-col items-center ${href ? 'hover:underline hover:text-primary' : ''}`}
        >
          <h2 className="card-title text-md text-center font-bold">{title}</h2>
          <p className="text-xs text-center overflow-ellipsis">{text}</p>
        </a>
      </div>
    </div>
  )
}

export default AttributeCard
