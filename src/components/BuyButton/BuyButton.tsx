import React from "react"

interface IProps {
  upgradeCost: number
  text: string
  callback: (delta: number) => void
  disabled?: boolean
  purchased?: boolean
  upgradeCallback: () => void
}

export const BuyButton: React.FC<IProps> = (props) => {
  const {
    upgradeCost,
    text,
    callback,
    upgradeCallback,
    disabled = false,
    purchased = false,
  } = props
  const buyText = purchased ? "Bought" : `-${upgradeCost}`

  return (
    <div>
      {text}
      <button
        disabled={disabled}
        onClick={() => {
          callback(upgradeCost)
          upgradeCallback()
        }}
      >
        {buyText}
      </button>
    </div>
  )
}
