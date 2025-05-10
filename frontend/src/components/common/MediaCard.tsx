// src/components/common/MediaCard.tsx

import Image from 'next/image'

interface MediaCardProps {
  title: string
  description?: string
  imageUrl?: string
}

const MediaCard = ({
  title,
  description,
  imageUrl
}: MediaCardProps) => {
  return (
    <div className='card card-compact bg-base-100 shadow hover:shadow-xl transition-shadow h-full'>
      {imageUrl && (
        <figure>
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={225}
            className='object-cover w-full h-56'
          />
        </figure>
      )}
      <div className='card-body'>
        <h2 className='card-title'>{title}</h2>
        {description && <p className='text-sm line-clamp-3'>{description}</p>}
      </div>
    </div>
  )
}

export default MediaCard
