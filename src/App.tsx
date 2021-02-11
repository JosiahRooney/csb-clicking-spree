import React, { useCallback, useEffect, useMemo, useState } from "react"

import { CountButton } from "./CountButton"
import { UpgradeButton } from "./UpgradeButton"

import { upgrades } from "./upgrades"
import { units } from "./units"

import { TUnit } from "./types/Unit.type"

import "./styles.css"

const initialState = {
  count: 0,
  totalCount: 0,
  delta: 1,
  upgradesPurchased: [],
  unitsPurchased: [],
}

export default function App() {
  const [totalCount, setTotalCount] = useState(initialState.totalCount)
  const [count, setCount] = useState(initialState.count)
  const [delta, setDelta] = useState(initialState.delta)
  const [upgradesPurchased, setUpgradesPurchased] = useState<string[]>(
    initialState.upgradesPurchased
  )
  const [unitsPurchased, setUnitsPurchased] = useState<TUnit[]>(
    initialState.unitsPurchased
  )

  const increaseCount = (delta: number) => {
    setTotalCount(totalCount + Math.round(delta * 100) / 100)
    setCount(count + Math.round(delta * 100) / 100)
  }

  const decreaseCount = useCallback(
    (delta: number) => {
      setCount(count - delta)
    },
    [count]
  )

  const reset = () => {
    setCount(initialState.count)
    setTotalCount(initialState.totalCount)
    setDelta(initialState.delta)
    setUpgradesPurchased(initialState.upgradesPurchased)
    setUnitsPurchased(initialState.unitsPurchased)
  }

  const upgradeMarkup = useMemo(() => {
    return upgrades.map((upgrade) => {
      const purchased = upgradesPurchased.includes(upgrade.id)

      return (
        <UpgradeButton
          key={upgrade.id}
          callback={() => decreaseCount(upgrade.cost)}
          upgradeCallback={() =>
            setUpgradesPurchased([upgrade.id, ...upgradesPurchased])
          }
          disabled={purchased || upgrade.cost > count}
          purchased={purchased}
          upgradeCost={upgrade.cost}
          text={upgrade.label}
        />
      )
    })
  }, [count, decreaseCount, upgradesPurchased])

  const purchaseMarkup = useMemo(() => {
    return units.map((unit) => {
      const unitPurchased = unitsPurchased.find((item) => item.id === unit.id)
      const unitPurchasedArray = [
        ...unitsPurchased.filter((item) => item.id !== unit.id),
      ]
      const totalOwned = (unitPurchased && unitPurchased.amount) || 0

      const costIncrease = unitPurchased
        ? Math.round(
            (unit.cost * Math.pow(1.18, unitPurchased.amount) * 100) / 100
          )
        : unit.cost

      const callbackLogic = () => {
        if (unitPurchased !== undefined) {
          unitPurchasedArray.push({
            id: unitPurchased.id,
            label: unitPurchased.label,
            amount: unitPurchased.amount + 1,
            power: unitPurchased.power,
            cost: unitPurchased.cost,
          })
          setUnitsPurchased([...unitPurchasedArray])
        } else {
          setUnitsPurchased([
            {
              id: unit.id,
              amount: 1,
              power: unit.power,
              label: unit.label,
              cost: unit.cost,
            },
            ...unitsPurchased,
          ])
        }
      }

      return totalCount > unit.cost * 0.75 ? (
        <UpgradeButton
          key={unit.id}
          callback={() => decreaseCount(costIncrease)}
          upgradeCallback={callbackLogic}
          disabled={count - costIncrease < 0}
          upgradeCost={costIncrease}
          text={`${unit.label}: +${unit.power} TP (${totalOwned}) `}
        />
      ) : null
    })
  }, [unitsPurchased, count, totalCount, decreaseCount])

  const totalPower = useMemo(() => {
    return unitsPurchased.reduce((acc, cur) => acc + cur.amount * cur.power, 0)
  }, [unitsPurchased])

  useEffect(() => {
    setDelta((delta) => {
      let _delta = delta
      upgrades.forEach((upgrade) => {
        if (upgradesPurchased.includes(upgrade.id) && upgrade.clickPower) {
          _delta += upgrade.clickPower
        }
      })
      return _delta
    })
  }, [upgradesPurchased])

  useEffect(() => {
    let delta = 0
    unitsPurchased.forEach(
      (purchase) => (delta += purchase.amount * purchase.power)
    )
    upgrades.forEach((upgrade) => {
      if (upgradesPurchased.indexOf(upgrade.id) !== -1 && upgrade.unitPower) {
        delta += delta * upgrade.unitPower
      }
    })

    const interval = setInterval(() => {
      setTotalCount((totalCount) => totalCount + delta)
      setCount((count) => count + delta)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [upgradesPurchased, unitsPurchased])

  return (
    <div className="App">
      <div>
        <button onClick={reset}>Reset</button>
      </div>

      <div>total kills: {Math.round(totalCount * 100) / 100}</div>
      <div className="count">Kills: {Math.round(count * 100) / 100}</div>

      <CountButton delta={delta} callback={() => increaseCount(delta)} />

      <div>+{Math.round(delta * 100) / 100} AP/click</div>
      <div>+{Math.round(totalPower * 100) / 100} TP/sec</div>

      {purchaseMarkup}
      {upgradeMarkup}
    </div>
  )
}
