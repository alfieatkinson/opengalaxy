// src/components/common/Dropdown.tsx

'use client'

import { ReactNode, useState, useRef, useEffect } from 'react'

interface DropdownProps {
  trigger: ReactNode
  items: Array<{
    label: string
    onClick: () => void
  }>
}

const Dropdown = ({ trigger, items }: DropdownProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)}>{trigger}</button>
      {open && (
        <ul className="menu bg-base-100 shadow-lg rounded-box w-48 absolute right-0 mt-2 z-50">
          {items.map((item, i) => (
            <li key={i}>
              <button
                onClick={() => {
                  item.onClick()
                  setOpen(false)
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
