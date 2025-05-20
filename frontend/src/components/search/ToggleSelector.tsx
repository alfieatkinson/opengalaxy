// src/components/search/ToggleSelector.tsx

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface ToggleSelectorProps {
  paramKey: string
  values: [string, string]
  icons?: [React.ReactNode, React.ReactNode]
  classNames?: [string, string]
  defaultIndex?: 0 | 1
  clearParams?: string[]
}

const ToggleSelector = ({
  paramKey,
  values: [offValue, onValue],
  icons: [offIcon, onIcon] = [<span>Off</span>, <span>On</span>],
  classNames: [offClassName, onClassName] = [
    'btn-outline',
    'btn-active text-primary border-primary hover:border-black',
  ],
  defaultIndex = 1,
  clearParams = [],
}: ToggleSelectorProps) => {
  const router = useRouter()
  const params = useSearchParams()

  const currentValue = params.get(paramKey) ?? (defaultIndex === 0 ? offValue : onValue)
  const isOn = currentValue === onValue

  const handleToggle = useCallback(() => {
    const qp = new URLSearchParams(params.toString())

    qp.set(paramKey, isOn ? offValue : onValue)

    // If clearParams is provided, remove those params from the URL
    clearParams.forEach((key) => {
      if (qp.has(key)) {
        qp.delete(key)
      }
    })

    // Reset the page to 1
    qp.set('page', '1')
    router.push(`/search?${qp.toString()}`)
  }, [isOn, params])

  return (
    <button
      onClick={handleToggle}
      className={`btn btn-sm px-2 flex items-center gap-1 ${isOn ? onClassName : offClassName} whitespace-nowrap`}
    >
      {isOn ? onIcon : offIcon}
    </button>
  )
}

export default ToggleSelector
