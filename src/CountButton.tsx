import React from "react"

interface IProps {
  delta: number
  callback: () => void
  disabled?: boolean
}

export const CountButton: React.FC<IProps> = ({
  delta,
  callback,
  disabled = false,
}) => {
  return (
    <button onClick={callback} disabled={disabled}>
      +{Math.round((delta + Number.EPSILON) * 100) / 100}
    </button>
  )
}
