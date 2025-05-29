// src/components/shared/IconButton.tsx

interface IconButtonProps {
  href: string
  children: React.ReactNode
}

const IconButton = ({ href, children }: IconButtonProps) => {
  return (
    <a
      href={href}
      target="_blank"
      className={`flex items-center justify-center p-2 rounded-full text-base-content hover:text-primary transition-colors w-fit h-fit`}
    >
      {children}
    </a>
  )
}

export default IconButton
