type TPurchase = {
  cost: number
  id: string
  label: string
  power: number
}

export const purchases: TPurchase[] = [
  {
    id: "soldier",
    cost: 15,
    label: "Soldier",
    power: 1,
  },
  {
    id: "hunter",
    cost: 76,
    label: "Hunter",
    power: 3,
  },
]
