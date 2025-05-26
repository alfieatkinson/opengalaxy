// src/components/shared/HighlightedText.tsx

const HighlightedText = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
      {children}
    </span>
  )
}

export default HighlightedText
