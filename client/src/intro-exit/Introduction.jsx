import React, { useEffect, useState } from "react"
import { Button } from "../components/Button"
import { usePlayer, useGame } from "@empirica/core/player/classic/react"
import { Loading } from "@empirica/core/player/react"

export function Introduction({ next }) {
  const player = usePlayer()
  const game = useGame()
  const [charId, setCharId] = useState("")
  if (!game || !player) {
    return <Loading />
  }

  function handleSubmit() {
    const { idMap } = game.get("treatment")
    const idMapObj = JSON.parse(idMap.slice(1, -1))

    if (!Object.keys(idMapObj).includes(charId)) {
      alert(
        "It looks like you've entered an invalid unique id, please check and try again!"
      )
      return
    }

    const characterIndex = idMapObj[`${charId}`]
    player.set("characterIndex", characterIndex)
    next()
  }

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h3>Please enter your unique player reference.</h3>
      <div className="ml-2 mt-2 space-y-1">
        <input
          className="mb-5 appearance-none block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-empirica-500 focus:border-empirica-500 sm:text-sm"
          type="textarea"
          id="charIdInput"
          data-test="inputCharId"
          onChange={(e) => setCharId(e.target.value)}
        />
      </div>
      <div className="flex space-x-1 justify-center items-center ">
        <button
          className="px-2 py-1 bg-teal-500 text-white"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  )
}
