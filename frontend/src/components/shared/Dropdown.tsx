// src/components/layout/Dropdown.tsx

'use client'

import { ReactNode, useState, useRef, useEffect } from 'react'

interface DropdownProps {
  dataCy?: string
  trigger: ReactNode
  items: Array<{
    dataCy?: string
    label: string
    onClick: () => void
  }>
}

const Dropdown = ({ dataCy, trigger, items }: DropdownProps) => {
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
    <div data-cy={dataCy ?? ''} className="relative max-h-120 max-w-screen" ref={ref}>
      <button onClick={() => setOpen((o) => !o)}>{trigger}</button>
      {open && (
        <ul className="menu bg-base-100 shadow-lg rounded-box min-w-30 max-w-200 absolute right-0 mt-2 z-50 max-h-120 overflow-y-scroll mx-auto">
          {items.map((item, i) => (
            <li key={i}>
              <button
                data-cy={item.dataCy ?? `dropdown-item-${i}`}
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
