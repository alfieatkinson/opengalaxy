// src/components/search/FilterDropdown.tsx

'use client'

import Dropdown from '@/components/shared/Dropdown'

interface Option {
  label: string
  value: string
}

interface FilterropdownProps {
  title: string
  options: Option[]
  selected?: string
  onSelect: (value: string) => void
}

const FilterDropdown = ({ title, options, selected, onSelect }: FilterropdownProps) => {
  const items = options.map((option) => ({
    label: option.label + (option.value === selected ? ' ✓' : '  '),
    onClick: () => onSelect(option.value),
  }))

  return (
    <Dropdown
      trigger={
        <button className="btn btn-outline btn-sm">
          {title}
          {selected ? `: ${selected}` : ''}
        </button>
      }
      items={items}
    />
  )
}

export default FilterDropdown
