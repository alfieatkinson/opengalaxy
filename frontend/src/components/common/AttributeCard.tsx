// src/components/common/AttributeCard.tsx

'use client'

interface AttributeCardProps {
  title: string
  icon?: React.ReactNode
  text: string
}

const AttributeCard = ({ title, icon, text }: AttributeCardProps) => {
  return (
    <div className="card bg-base-300 shadow-lg w-50">
      <div className="card-body items-center justify-center">
        <h1 className="items-center">{icon}</h1>
        <h2 className="card-title text-md font-bold">{title}</h2>
        <p className="text-sm">{text}</p>
      </div>
    </div>
  )
}

export default AttributeCard
