// src/components/search/FilterSelector.tsx

'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

type FlatOptions = Record<string, string>
type NestedOptions = Record<string, FlatOptions>

interface FilterSelectorProps {
  filterKey: string
  options: FlatOptions | NestedOptions
  label?: string
}

const isNested = (options: FlatOptions | NestedOptions): options is NestedOptions => {
  return Object.values(options).every((opt) => typeof opt === 'object')
}

const FilterSelector = ({ filterKey, options, label }: FilterSelectorProps) => {
  const params = useSearchParams()
  const router = useRouter()

  const initialValues = (params.get(filterKey) ?? '').split(',').filter(Boolean)
  const [selected, setSelected] = useState<string[]>(initialValues)

  useEffect(() => {
    const qp = new URLSearchParams(params.toString())

    if (selected.length === 0) {
      qp.delete(filterKey)
    } else {
      qp.set(filterKey, selected.join(','))
    }

    qp.set('page', '1')
    router.push(`/search?${qp.toString()}`)
  }, [selected])

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((opt) => opt !== option) : [...prev, option],
    )
  }

  return (
    <div className="dropdown dropdown-hover">
      <div tabIndex={0} role="button" className="btn btn-outline btn-sm whitespace-nowrap">
        {label ?? filterKey[0].toUpperCase() + filterKey.slice(1)}
        {selected.length > 0 && ` [${selected.length}]`}
      </div>

      <div
        tabIndex={0}
        className="flex flex-wrap dropdown-content z-[1] p-4 shadow bg-base-200 rounded-box max-h-80 min-w-60 max-w-120 overflow-y-auto"
      >
        {isNested(options) ? (
          /* Nested groups, e.g. image vs audio extensions */
          Object.entries(options).map(([group, filters]) => (
            <div key={group} className="mb-4 w-full">
              <div className="text-xs uppercase opacity-70 mb-1">
                {group === 'image' ? 'Image types' : 'Audio types'}
              </div>
              <div className="divider my-1" />
              <div className="flex flex-wrap w-full gap-1">
                {Object.entries(filters).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => toggleOption(label)}
                    className={`btn btn-outline btn-xs whitespace-nowrap ${
                      selected.includes(value) ? 'btn-active text-primary border-primary' : ''
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          /* Flat options, e.g. license or source */
          <div className="flex flex-wrap w-full gap-1">
            {Object.entries(options as FlatOptions).map(([value, label]) => (
              <button
                key={value}
                onClick={() => toggleOption(value)}
                className={`btn btn-outline btn-xs whitespace-nowrap ${
                  selected.includes(value) ? 'btn-active text-primary border-primary' : ''
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterSelector
