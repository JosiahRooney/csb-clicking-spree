import React, { useCallback, useEffect, useMemo, useState } from "react"

import { CountButton } from "./CountButton"
import { UpgradeButton } from "./UpgradeButton"

import { upgrades } from "./upgrades"
import { purchases } from "./purchases"

import "./styles.css"

type TPurchase = {
  id: string
  amount: number
  power: number
  label: string
}

const initialState = {
  count: 0,
  totalCount: 0,
  delta: 1,
  upgradesPurchased: [],
  purchasesPurchased: [],
}

export default function App() {
  const [totalCount, setTotalCount] = useState(initialState.totalCount)
  const [count, setCount] = useState(initialState.count)
  const [delta, setDelta] = useState(initialState.delta)
  const [upgradesPurchased, setUpgradesPurchased] = useState<string[]>(
    initialState.upgradesPurchased
  )
  const [purchasesPurchased, setPurchasesPurchased] = useState<TPurchase[]>(
    initialState.purchasesPurchased
  )

  const increaseCount = (delta: number) => {
    console.log({ delta, d: Math.round(delta * 100) / 100 })
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
    setPurchasesPurchased(initialState.purchasesPurchased)
  }

  const upgradeMarkup = upgrades.map((upgrade) => {
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

  const purchaseMarkup = useMemo(() => {
    return purchases.map((purchase) => {
      const purchased = purchasesPurchased.find(
        (item) => item.id === purchase.id
      )
      const purchasedArray = [
        ...purchasesPurchased.filter((item) => item.id !== purchase.id),
      ]
      const totalOwned = (purchased && purchased.amount) || 0

      const costIncrease = purchased
        ? Math.round(
            (purchase.cost * Math.pow(1.18, purchased.amount) * 100) / 100
          )
        : purchase.cost

      const callbackLogic = () => {
        if (purchased !== undefined) {
          purchasedArray.push({
            id: purchased.id,
            label: purchased.label,
            amount: purchased.amount + 1,
            power: purchased.power,
          })
          setPurchasesPurchased([...purchasedArray])
        } else {
          setPurchasesPurchased([
            {
              id: purchase.id,
              amount: 1,
              power: purchase.power,
              label: purchase.label,
            },
            ...purchasesPurchased,
          ])
        }
      }

      return totalCount > purchase.cost * 0.75 ? (
        <UpgradeButton
          key={purchase.id}
          callback={() => decreaseCount(costIncrease)}
          upgradeCallback={callbackLogic}
          disabled={count - costIncrease < 0}
          upgradeCost={costIncrease}
          text={`${purchase.label}: +${purchase.power} TP (${totalOwned}) `}
        />
      ) : null
    })
  }, [purchasesPurchased, count, totalCount, decreaseCount])

  const totalPower = useMemo(() => {
    return purchasesPurchased.reduce(
      (acc, cur) => acc + cur.amount * cur.power,
      0
    )
  }, [purchasesPurchased])

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
    purchasesPurchased.forEach(
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
  }, [upgradesPurchased, purchasesPurchased])

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
