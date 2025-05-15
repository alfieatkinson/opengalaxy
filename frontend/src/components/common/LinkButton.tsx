// src/components/common/LinkButton.tsx

'use client'

import { SquareArrowOutUpRight as LinkIcon } from 'lucide-react'

interface LinkButtonProps {
  href: string
}

const LinkButton = ({ href }: LinkButtonProps) => {
  return (
    <button className="btn btn-secondary ml-4" onClick={() => window.open(href, '_blank')}>
      View <LinkIcon size={20} strokeWidth={2.5} className="ml-1" />
    </button>
  )
}

export default LinkButton
