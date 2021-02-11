interface IUpgrade {
  cost: number
  id: string
  label: string
  clickPower?: number
  unitPower?: number
  building?: {
    buildingId: string
    buildingIncrease: number
  }
  speed?: number
}

export const upgrades: IUpgrade[] = [
  {
    cost: 25,
    id: "red_dot_sight",
    label: "Red Dot Sight: +10% AP ",
    clickPower: 0.1,
  },
  {
    cost: 139,
    id: "better_drill_instructors",
    label: "Better Drill Instructors: +5% TP ",
    unitPower: 0.05,
  },
  {
    cost: 275,
    id: "acog_scope",
    label: "ACOG Scope: +13% AP ",
    clickPower: 0.1,
  },
  {
    cost: 1,
    id: "faster_transports",
    label: "Faster Transports: 10% faster unit attack ",
    speed: 0.9,
  },
]
