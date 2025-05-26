// src/components/media/MediaTag.tsx

interface MediaTagProps {
  tag: string
  onClick?: (tag: string) => void
}

const MediaTag = ({ tag, onClick }: MediaTagProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(tag)
    }
  }

  return (
    <span
      className="cursor-pointer text-sm bg-primary hover:opacity-60 hover:underline px-2 py-1 rounded-sm"
      onClick={handleClick}
    >
      {tag}
    </span>
  )
}

export default MediaTag
