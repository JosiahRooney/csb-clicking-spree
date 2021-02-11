interface IUpgrade {
  cost: number
  id: string
  label: string
  clickPower?: number
  unitPower?: number
}

export const upgrades: IUpgrade[] = [
  {
    cost: 25,
    id: "red_dot_sight",
    label: "Red Dot Sight: +10% AP",
    clickPower: 0.1,
  },
  {
    cost: 139,
    id: "grenade_launcher",
    label: "Grenade Launcher: +5% TP",
    unitPower: 0.05,
  },
]
