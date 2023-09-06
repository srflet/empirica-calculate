import {
  usePlayer,
  useGame,
  usePlayers,
  useRound,
} from "@empirica/core/player/classic/react"
import { Loading } from "@empirica/core/player/react"
import React, { useState, useEffect } from "react"

export function Stage() {
  const player = usePlayer()
  const game = useGame()
  const round = useRound()
  const [disabled, setDisabled] = useState(false)
  const [scoreSheetDict, setScoreSheetDict] = useState({})
  const [selectValues, setSelectValues] = useState({})
  const [score, setScore] = useState(undefined)

  useEffect(() => {
    if (!game || !player) {
      return
    }

    const { scoreSheet } = game.get("treatment")
    console.log(scoreSheet)
    const scoreSheetObject = JSON.parse(scoreSheet.slice(1, -1))
    console.log(scoreSheetObject)
    setScoreSheetDict(scoreSheetObject)
  }, [])

  const handleChange = ({ target: { value: val, name } }) => {
    setSelectValues({ ...selectValues, [name]: val })
  }

  function handleCalculate() {
    const keys = Object.keys(scoreSheetDict)

    const hasAllKeys = keys.every((item) => selectValues.hasOwnProperty(item))
    const allAnswered = !Object.values(selectValues).includes("")
    console.log(`all changed: ${hasAllKeys} | no "": ${allAnswered}`)
    if (!hasAllKeys || !allAnswered) {
      alert("Please enter select an answer for EACH option")
      return
    }

    setDisabled(true)

    const sum = Object.values(selectValues).reduce((acc, value) => {
      return acc + parseInt(value)
    }, 0)

    setScore(sum)
    let selectionHistory = game.get("selectionHistory") || []
    selectionHistory = [...selectionHistory, selectValues]
    game.set("selectionHistory", selectionHistory)

    game.set("currentScore", sum)
  }

  function handleReset() {
    setSelectValues({})
    setScore(undefined)
    game.set("currentScore", "")
    setDisabled(false)
  }

  if (!player || !game) {
    return <Loading />
  }

  return (
    <div>
      <div className="flex flex-col space-y-2 m-4">
        <h1 className="text-4xl" onClick={(e) => console.log(selectValues)}>
          Check your proposal!
        </h1>
        <h3 className="text-2xl">
          Select the option for each issue then click "calculate"
        </h3>
      </div>

      <div className="flex 1/2">
        <div className="flex min-w-400px flex-col space-y-2  pl-10px">
          {Object.keys(scoreSheetDict).map((_key, index) => {
            return (
              <>
                <p>{_key}</p>
                <select
                  className={`border-2 border-black rounded text-center ${
                    disabled && "bg-gray-400"
                  }`}
                  name={`${_key}`}
                  value={selectValues[`${_key}`] || ""}
                  onChange={handleChange}
                  key={index}
                  id=""
                  disabled={disabled}
                >
                  <option value="">-- select an option ---</option>
                  {Object.entries(scoreSheetDict[`${_key}`]).map(
                    ([_subkey, value], subindex) => {
                      return (
                        <option
                          key={subindex}
                          value={value[player.get("characterIndex")]}
                          onClick={(e) =>
                            console.log(
                              `${value} ${_key} value is: ${e.currentTarget.value}`
                            )
                          }
                        >
                          {_subkey}
                        </option>
                      )
                    }
                  )}
                </select>
              </>
            )
          })}
        </div>
        <div className="flex w-500px flex-col pt-50px items-center">
          <button
            className={`${
              disabled ? "bg-gray-400" : "bg-green-500"
            } w-200px m-4px py-2 px-4 ${
              !disabled && "hover:bg-green-400"
            } rounded border-2 border-black rounded-lg shadow-sm font-medium text-white text-xl`}
            value="agree"
            onClick={handleCalculate}
          >
            Calculate
          </button>
          <button
            className="bg-red-500 w-200px m-4px py-2 px-4 hover:bg-red-400 rounded-lg border-2 border-black rounded shadow-sm font-medium text-white text-xl"
            value="agree"
            onClick={handleReset}
          >
            Reset
          </button>
          <div className="w-200px h-200px mt-50px flex flex-col space-y-2 bg-blue-500 border-3 border-black rounded-xl shadow-sm">
            <p className="text-white text-xl mt-1/5 self-center">Score</p>
            <p className="text-white text-4xl self-center">{score || ""}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
