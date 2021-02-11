import { EUnit } from "./types/Unit.type"
import { TBuilding } from "./types/Building.type"

export const buildings: TBuilding[] = [
  {
    id: "barracks",
    label: "Barracks",
    cost: 500,
    amount: 0,
    unit: EUnit.soldier,
  },
  {
    id: "hunter_lodge",
    label: "Hunter Lodge",
    cost: 1500,
    amount: 0,
    unit: EUnit.hunter,
  },
]
