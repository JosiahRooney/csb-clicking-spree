import React from "react"

import "./CountButton.scss"

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
    <button className="CountButton" onClick={callback} disabled={disabled}>
      +{Math.round((delta + Number.EPSILON) * 100) / 100} Kill
    </button>
  )
}
