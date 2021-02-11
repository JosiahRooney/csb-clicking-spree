import React, { useCallback, useEffect, useMemo, useState } from "react"

import { CountButton } from "./components/CountButton/CountButton"
import { BuyButton } from "./components/BuyButton/BuyButton"

import { upgrades } from "./upgrades"
import { units } from "./units"
import { buildings } from "./buildings"

import { TUnit } from "./types/Unit.type"
import { TBuilding } from "./types/Building.type"

import "./styles.scss"

const initialState = {
  count: 0,
  totalCount: 0,
  delta: 1,
  speed: 1000,
  upgradesPurchased: [],
  unitsPurchased: [],
  buildingsPurchased: [],
}

export default function App() {
  const [totalCount, setTotalCount] = useState(initialState.totalCount)
  const [count, setCount] = useState(initialState.count)
  const [delta, setDelta] = useState(initialState.delta)
  const [speed, setSpeed] = useState(initialState.speed)
  const [upgradesPurchased, setUpgradesPurchased] = useState<string[]>(
    initialState.upgradesPurchased
  )
  const [unitsPurchased, setUnitsPurchased] = useState<TUnit[]>(
    initialState.unitsPurchased
  )
  const [buildingsPurchased, setBuildingsPurchased] = useState<TBuilding[]>(
    initialState.buildingsPurchased
  )
  const [confirmReset, setConfirmReset] = useState(false)

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
    if (!confirmReset) {
      setConfirmReset(true)
    } else {
      setCount(initialState.count)
      setTotalCount(initialState.totalCount)
      setDelta(initialState.delta)
      setUpgradesPurchased(initialState.upgradesPurchased)
      setUnitsPurchased(initialState.unitsPurchased)
      setBuildingsPurchased(initialState.buildingsPurchased)
      setConfirmReset(false)
    }
  }

  const buyUnit = useCallback(
    (cost: number, unit: TUnit) => {
      const foundUnit = unitsPurchased.find((_unit) => _unit.id === unit.id)
      const unitArray = unitsPurchased.filter((_unit) => _unit.id !== unit.id)

      if (foundUnit) {
        if (cost === 0) {
          setUnitsPurchased([
            {
              id: foundUnit.id,
              label: foundUnit.label,
              cost: foundUnit.cost,
              amount: foundUnit.amount,
              amount_free: foundUnit.amount_free + 1,
              power: foundUnit.power,
            },
            ...unitArray,
          ])
        } else {
          setUnitsPurchased([
            {
              id: foundUnit.id,
              label: foundUnit.label,
              cost: foundUnit.cost,
              amount: foundUnit.amount + 1,
              amount_free: foundUnit.amount_free,
              power: foundUnit.power,
            },
            ...unitArray,
          ])
        }
      } else {
        if (cost === 0) {
          setUnitsPurchased([
            {
              id: unit.id,
              cost: unit.cost,
              label: unit.label,
              power: unit.power,
              amount: unit.amount,
              amount_free: unit.amount_free + 1,
            },
            ...unitsPurchased,
          ])
        } else {
          setUnitsPurchased([
            {
              id: unit.id,
              cost: unit.cost,
              label: unit.label,
              power: unit.power,
              amount: unit.amount + 1,
              amount_free: unit.amount_free,
            },
            ...unitsPurchased,
          ])
        }
      }
    },
    [unitsPurchased]
  )

  const upgradeMarkup = useMemo(() => {
    return upgrades.map((upgrade) => {
      const purchased = upgradesPurchased.includes(upgrade.id)

      return (
        <BuyButton
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

  const unitMarkup = useMemo(() => {
    return units.map((unit) => {
      const unitPurchased = unitsPurchased.find((item) => item.id === unit.id)

      const totalOwned =
        (unitPurchased && unitPurchased.amount + unitPurchased.amount_free) || 0

      const costIncrease = unitPurchased
        ? Math.round(
            (unit.cost * Math.pow(1.18, unitPurchased.amount) * 100) / 100
          )
        : unit.cost

      return totalCount > unit.cost * 0.75 || unit.id === "soldier" ? (
        <BuyButton
          key={unit.id}
          callback={() => decreaseCount(costIncrease)}
          upgradeCallback={() => buyUnit(costIncrease, unit)}
          disabled={count - costIncrease < 0}
          upgradeCost={costIncrease}
          text={`${unit.label}: +${unit.power} TP (${totalOwned}) `}
        />
      ) : null
    })
  }, [unitsPurchased, count, totalCount, decreaseCount, buyUnit])

  const buildingMarkup = useMemo(() => {
    return buildings.map((building) => {
      const buildingPurchased = buildingsPurchased.find(
        (item) => item.id === building.id
      )
      const buildingPurchasedArray = [
        ...buildingsPurchased.filter((item) => item.id !== building.id),
      ]
      const totalOwned = (buildingPurchased && buildingPurchased.amount) || 0

      const costIncrease = buildingPurchased
        ? Math.round(
            (building.cost * Math.pow(1.18, buildingPurchased.amount) * 100) /
              100
          )
        : building.cost

      const callbackLogic = () => {
        if (buildingPurchased !== undefined) {
          buildingPurchasedArray.push({
            id: buildingPurchased.id,
            label: buildingPurchased.label,
            amount: buildingPurchased.amount + 1,
            unit: buildingPurchased.unit,
            cost: buildingPurchased.cost,
          })
          setBuildingsPurchased([...buildingPurchasedArray])
        } else {
          setBuildingsPurchased([
            {
              id: building.id,
              amount: 1,
              unit: building.unit,
              label: building.label,
              cost: building.cost,
            },
            ...buildingsPurchased,
          ])
        }
      }

      return totalCount > building.cost * 0.75 || building.id === "barracks" ? (
        <BuyButton
          key={building.id}
          callback={() => decreaseCount(costIncrease)}
          upgradeCallback={callbackLogic}
          disabled={count - costIncrease < 0}
          upgradeCost={costIncrease}
          text={`${building.label}: recruits 1 ${building.unit} per second (${totalOwned}) `}
        />
      ) : null
    })
  }, [buildingsPurchased, count, totalCount, decreaseCount])

  const totalPower = useMemo(() => {
    const totalPower = unitsPurchased.reduce(
      (acc, cur) => acc + (cur.amount + cur.amount_free) * cur.power,
      0
    )

    return (totalPower * 1000) / speed
  }, [unitsPurchased, speed])

  useEffect(() => {
    // Click loop
    let _delta = 1
    upgrades.forEach((upgrade) => {
      if (upgradesPurchased.includes(upgrade.id) && upgrade.clickPower) {
        _delta += _delta * upgrade.clickPower
      }
    })
    setDelta(_delta)
  }, [upgradesPurchased])

  useEffect(() => {
    upgrades.forEach((upgrade) => {
      if (upgradesPurchased.indexOf(upgrade.id) !== -1) {
        // upgrade is purchased
        if (upgrade.speed) {
          setSpeed((speed) => speed * upgrade.speed!)
        }
      }
    })
  }, [upgradesPurchased])

  useEffect(() => {
    // Units loop
    let delta = 0
    unitsPurchased.forEach(
      (unit) => (delta += (unit.amount + unit.amount_free) * unit.power)
    )
    upgrades.forEach((upgrade) => {
      if (upgradesPurchased.indexOf(upgrade.id) !== -1) {
        // upgrade is purchased
        if (upgrade.unitPower) {
          delta += delta * upgrade.unitPower
        }
      }
    })

    const interval = setInterval(() => {
      setTotalCount((totalCount) => totalCount + delta)
      setCount((count) => count + delta)
    }, speed)
    return () => {
      clearInterval(interval)
    }
  }, [upgradesPurchased, unitsPurchased, speed])

  useEffect(() => {
    // Buildings loop
    let unitArray = buildingsPurchased.map((building) => {
      const unitId = building.unit
      return units.find((_unit) => _unit.id === unitId)
    })
    const interval = setInterval(() => {
      if (unitArray.length > 0) {
        unitArray.forEach((unit) => {
          buyUnit(0, unit!)
        })
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [buildingsPurchased, buyUnit])

  return (
    <div className="App">
      <div className="action-row">
        {confirmReset && (
          <>
            <button onClick={reset}>Are you sure?</button>{" "}
            <button onClick={() => setConfirmReset(false)}>Cancel</button>
          </>
        )}
        {!confirmReset && <button onClick={reset}>Reset</button>}
      </div>

      <div className="kills-row">
        <CountButton delta={delta} callback={() => increaseCount(delta)} />
        <div className="count">Kills: {Math.round(count * 100) / 100}</div>
        <div>+{Math.round(delta * 100) / 100} K/click</div>
        <div>+{Math.round(totalPower * 100) / 100} K/sec</div>
        <div>Total: {Math.round(totalCount * 100) / 100}</div>
      </div>

      <div>
        <h2>Units</h2>
        {unitMarkup}
      </div>
      <div>
        <h2>Buildings</h2>
        {buildingMarkup}
      </div>
      <div>
        <h2>Upgrades</h2>
        {upgradeMarkup}
      </div>
    </div>
  )
}
