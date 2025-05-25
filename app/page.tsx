"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Coins, Heart, Sword, Star, Trophy, ShoppingCart, Users, Zap } from "lucide-react"

// Korttyper och data
const CARD_TYPES = [
  {
    id: 1,
    name: "Flamewyrm",
    hp: 120,
    atk: 35,
    rarity: "common",
    cost: 50,
    image: "/images/flamewyrm.png",
    attacks: [{ name: "Flame Burst", damage: 35, description: "En kraftfull eldattack" }],
  },
  {
    id: 2,
    name: "Aquadragon",
    hp: 110,
    atk: 30,
    rarity: "common",
    cost: 45,
    image: "/images/aquadragon.png",
    attacks: [{ name: "Water Pulse", damage: 30, description: "En våg av vatten träffar fienden" }],
  },
  {
    id: 3,
    name: "Thunderbeast",
    hp: 100,
    atk: 40,
    rarity: "common",
    cost: 55,
    image: "/images/thunderbeast.png",
    attacks: [{ name: "Thunder Strike", damage: 40, description: "Blixten slår ner med kraft" }],
  },
  {
    id: 4,
    name: "Earthguard",
    hp: 140,
    atk: 25,
    rarity: "common",
    cost: 60,
    image: "/images/earthguard.png",
    attacks: [{ name: "Stone Slam", damage: 25, description: "Krossar fienden med sten" }],
  },
  {
    id: 5,
    name: "Windspirit",
    hp: 90,
    atk: 45,
    rarity: "uncommon",
    cost: 80,
    emoji: "💨",
    attacks: [
      { name: "Wind Slash", damage: 35, description: "Skärande vindblad" },
      { name: "Tornado", damage: 55, description: "En kraftfull virvelstorm" },
    ],
  },
  {
    id: 6,
    name: "Icephoenix",
    hp: 130,
    atk: 38,
    rarity: "uncommon",
    cost: 85,
    emoji: "❄️",
    attacks: [
      { name: "Ice Beam", damage: 30, description: "En stråle av is" },
      { name: "Blizzard", damage: 50, description: "En isande snöstorm" },
    ],
  },
  {
    id: 7,
    name: "Shadowlord",
    hp: 150,
    atk: 42,
    rarity: "rare",
    cost: 120,
    emoji: "🌙",
    attacks: [
      { name: "Shadow Strike", damage: 35, description: "Anfall från skuggorna" },
      { name: "Dark Pulse", damage: 50, description: "Mörk energi exploderar" },
      { name: "Nightmare", damage: 65, description: "En mardrömsattack" },
    ],
  },
  {
    id: 8,
    name: "Lightbringer",
    hp: 160,
    atk: 40,
    rarity: "rare",
    cost: 130,
    emoji: "☀️",
    attacks: [
      { name: "Light Ray", damage: 35, description: "En stråle av rent ljus" },
      { name: "Solar Flare", damage: 50, description: "Solens kraft exploderar" },
      { name: "Divine Light", damage: 70, description: "Gudomligt ljus renar allt" },
    ],
  },
  {
    id: 9,
    name: "Voidmaster",
    hp: 180,
    atk: 50,
    rarity: "legendary",
    cost: 200,
    emoji: "🌌",
    attacks: [
      { name: "Void Slash", damage: 40, description: "Klyver verkligheten" },
      { name: "Black Hole", damage: 60, description: "Suger in allt ljus" },
      { name: "Reality Tear", damage: 80, description: "River sönder själva rymden" },
    ],
  },
  {
    id: 10,
    name: "Cosmicdragon",
    hp: 200,
    atk: 55,
    rarity: "legendary",
    cost: 250,
    emoji: "✨",
    attacks: [
      { name: "Cosmic Breath", damage: 45, description: "Andas stjärnstoft" },
      { name: "Galaxy Storm", damage: 65, description: "En storm av galaxer" },
      { name: "Big Bang", damage: 90, description: "Skapar ett nytt universum" },
    ],
  },
]

const STARTER_CARDS = [1, 2, 3] // Flamewyrm, Aquadragon, Thunderbeast

type Attack = {
  name: string
  damage: number
  description: string
}

type GameCard = {
  id: number
  name: string
  hp: number
  maxHp: number
  atk: number
  rarity: string
  cost: number
  emoji?: string
  image?: string
  attacks: Attack[]
}

type GameState = {
  screen: "menu" | "collection" | "shop" | "battle" | "rewards"
  coins: number
  ownedCards: number[]
  matchesWon: number
  selectedCards: number[]
  activeCardIndex: number
  battlePhase: "select" | "choose-active" | "battle" | "victory" | "defeat"
  playerCards: GameCard[]
  enemyCards: GameCard[]
  currentEnemyCard: number
  turn: "player" | "enemy"
  battleLog: string[]
  battleState: any
}

export default function PokemonCardGame() {
  const [gameState, setGameState] = useState<GameState>({
    screen: "menu",
    coins: 100,
    ownedCards: STARTER_CARDS,
    matchesWon: 0,
    selectedCards: [],
    activeCardIndex: 0,
    battlePhase: "select",
    playerCards: [],
    enemyCards: [],
    currentEnemyCard: 0,
    turn: "player",
    battleLog: [],
    battleState: null,
  })

  // Ladda sparat spel
  useEffect(() => {
    const saved = localStorage.getItem("pokemon-card-game")
    if (saved) {
      setGameState(JSON.parse(saved))
    }
  }, [])

  // Spara spel
  useEffect(() => {
    localStorage.setItem("pokemon-card-game", JSON.stringify(gameState))
  }, [gameState])

  const createCard = (cardId: number, currentHp?: number): GameCard => {
    const template = CARD_TYPES.find((c) => c.id === cardId)!
    return {
      ...template,
      maxHp: template.hp,
      hp: currentHp ?? template.hp,
      attacks: template.attacks,
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500"
      case "uncommon":
        return "bg-green-500"
      case "rare":
        return "bg-blue-500"
      case "legendary":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const MenuScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-purple-700 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4">⚡ CardMaster ⚡</h1>
        <p className="text-blue-100 text-lg">Samla kort och bli mästare!</p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        <Button
          size="lg"
          className="h-16 text-lg"
          onClick={() => setGameState((prev) => ({ ...prev, screen: "battle" }))}
        >
          <Sword className="mr-2" /> Strid
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-16 text-lg"
          onClick={() => setGameState((prev) => ({ ...prev, screen: "collection" }))}
        >
          <Users className="mr-2" /> Kortsamling
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-16 text-lg"
          onClick={() => setGameState((prev) => ({ ...prev, screen: "shop" }))}
        >
          <ShoppingCart className="mr-2" /> Shop
        </Button>
      </div>

      <div className="mt-8 text-center text-white">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="flex items-center gap-1">
            <Coins className="w-5 h-5" />
            <span>{gameState.coins}</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-5 h-5" />
            <span>{gameState.matchesWon}</span>
          </div>
        </div>
        {gameState.matchesWon > 0 && (gameState.matchesWon + 1) % 5 === 0 && (
          <Badge className="bg-yellow-500">
            <Star className="w-4 h-4 mr-1" />
            Nästa match: BOSS!
          </Badge>
        )}
      </div>
    </div>
  )

  const CollectionScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-blue-700 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Kortsamling</h2>
          <Button variant="outline" onClick={() => setGameState((prev) => ({ ...prev, screen: "menu" }))}>
            Tillbaka
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {CARD_TYPES.map((card) => {
            const owned = gameState.ownedCards.filter((id) => id === card.id).length
            return (
              <Card
                key={card.id}
                className={`${owned > 0 ? "opacity-100" : "opacity-50"} transition-all hover:scale-105`}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-16 h-16 mb-2 mx-auto flex items-center justify-center">
                    {card.image ? (
                      <img
                        src={card.image || "/placeholder.svg"}
                        alt={card.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-4xl">{card.emoji}</div>
                    )}
                  </div>
                  <h3 className="font-bold text-sm mb-2">{card.name}</h3>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500" />
                      {card.hp}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sword className="w-3 h-3 text-orange-500" />
                      {card.atk}
                    </span>
                  </div>
                  <Badge className={`${getRarityColor(card.rarity)} text-white text-xs`}>{card.rarity}</Badge>
                  {owned > 0 && <div className="mt-2 text-xs font-bold">Äger: {owned}st</div>}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )

  const ShopScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-pink-700 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Kortshop</h2>
            <div className="flex items-center gap-2 text-yellow-300">
              <Coins className="w-5 h-5" />
              <span className="text-xl font-bold">{gameState.coins}</span>
            </div>
          </div>
          <Button variant="outline" onClick={() => setGameState((prev) => ({ ...prev, screen: "menu" }))}>
            Tillbaka
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARD_TYPES.map((card) => (
            <Card key={card.id} className="transition-all hover:scale-105">
              <CardContent className="p-4 text-center">
                <div className="w-16 h-16 mb-2 mx-auto flex items-center justify-center">
                  {card.image ? (
                    <img
                      src={card.image || "/placeholder.svg"}
                      alt={card.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-4xl">{card.emoji}</div>
                  )}
                </div>
                <h3 className="font-bold mb-2">{card.name}</h3>
                <div className="flex justify-between text-sm mb-3">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    {card.hp}
                  </span>
                  <span className="flex items-center gap-1">
                    <Sword className="w-4 h-4 text-orange-500" />
                    {card.atk}
                  </span>
                </div>
                <Badge className={`${getRarityColor(card.rarity)} text-white mb-3`}>{card.rarity}</Badge>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-yellow-600 font-bold">
                    <Coins className="w-4 h-4" />
                    {card.cost}
                  </span>
                  <Button
                    size="sm"
                    disabled={gameState.coins < card.cost}
                    onClick={() => {
                      if (gameState.coins >= card.cost) {
                        setGameState((prev) => ({
                          ...prev,
                          coins: prev.coins - card.cost,
                          ownedCards: [...prev.ownedCards, card.id],
                        }))
                      }
                    }}
                  >
                    Köp
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  const BattleScreen = () => {
    const [isBossMatch, setIsBossMatch] = useState(false)

    useEffect(() => {
      // Kontrollera om det är en boss-match
      const nextMatch = gameState.matchesWon + 1
      setIsBossMatch(nextMatch % 5 === 0)
    }, [gameState.matchesWon])

    const selectCard = (cardId: number) => {
      if (gameState.selectedCards.includes(cardId)) {
        setGameState((prev) => ({
          ...prev,
          selectedCards: prev.selectedCards.filter((id) => id !== cardId),
        }))
      } else if (gameState.selectedCards.length < 3) {
        setGameState((prev) => ({
          ...prev,
          selectedCards: [...prev.selectedCards, cardId],
        }))
      }
    }

    const startBattle = () => {
      const playerDeck = gameState.selectedCards.map((id) => createCard(id))

      // Create enemy deck (same logic as before)
      let enemyDeck: GameCard[]
      if (isBossMatch) {
        const bossCardIds = [7, 8, 9]
        enemyDeck = bossCardIds.map((id) => {
          const card = createCard(id)
          card.hp = Math.floor(card.hp * 1.3)
          card.maxHp = card.hp
          card.atk = Math.floor(card.atk * 1.2)
          return card
        })
      } else {
        const availableCards = CARD_TYPES.filter((c) => c.rarity === "common" || c.rarity === "uncommon")
        enemyDeck = Array.from({ length: 3 }, () => {
          const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)]
          return createCard(randomCard.id)
        })
      }

      setGameState((prev) => ({
        ...prev,
        playerCards: playerDeck,
        enemyCards: enemyDeck,
        battlePhase: "choose-active",
        currentEnemyCard: 0,
        turn: "player",
        battleLog: [`Striden börjar! ${isBossMatch ? "⭐ BOSS MATCH! ⭐" : ""}`],
      }))
    }

    const chooseActiveCard = (index: number) => {
      setGameState((prev) => ({
        ...prev,
        activeCardIndex: index,
        battlePhase: "battle",
        battleLog: [...prev.battleLog, `${prev.playerCards[index].name} träder fram som aktiv kämpe!`],
      }))
    }

    const switchActiveCard = (index: number) => {
      if (gameState.playerCards[index].hp > 0) {
        setGameState((prev) => ({
          ...prev,
          activeCardIndex: index,
        }))
      }
    }

    const performAttack = (attack: Attack) => {
      if (gameState.turn !== "player") return

      const activeCard = gameState.playerCards[gameState.activeCardIndex]
      if (!activeCard || activeCard.hp <= 0) return

      const enemyCard = gameState.enemyCards[gameState.currentEnemyCard]
      if (!enemyCard) return

      // Player's attack
      const newEnemyCards = [...gameState.enemyCards]
      newEnemyCards[gameState.currentEnemyCard] = {
        ...enemyCard,
        hp: Math.max(0, enemyCard.hp - attack.damage),
      }

      const newBattleLog = [
        ...gameState.battleLog,
        `${activeCard.name} använder ${attack.name} för ${attack.damage} skada!`,
      ]

      // Check if enemy card is defeated
      if (newEnemyCards[gameState.currentEnemyCard].hp <= 0) {
        newBattleLog.push(`${enemyCard.name} är besegrat!`)

        const nextEnemyCard = newEnemyCards.findIndex(
          (card, index) => index > gameState.currentEnemyCard && card.hp > 0,
        )
        if (nextEnemyCard !== -1) {
          setGameState((prev) => ({
            ...prev,
            enemyCards: newEnemyCards,
            currentEnemyCard: nextEnemyCard,
            turn: "enemy",
            battleLog: newBattleLog,
          }))
        } else {
          setGameState((prev) => ({
            ...prev,
            enemyCards: newEnemyCards,
            battlePhase: "victory",
            battleLog: newBattleLog,
          }))
          return
        }
      } else {
        setGameState((prev) => ({
          ...prev,
          enemyCards: newEnemyCards,
          turn: "enemy",
          battleLog: newBattleLog,
        }))
      }

      // Enemy turn
      setTimeout(() => {
        const currentEnemy = newEnemyCards[gameState.currentEnemyCard]
        if (currentEnemy && currentEnemy.hp > 0) {
          const randomAttack = currentEnemy.attacks[Math.floor(Math.random() * currentEnemy.attacks.length)]

          const newPlayerCards = [...gameState.playerCards]
          newPlayerCards[gameState.activeCardIndex] = {
            ...activeCard,
            hp: Math.max(0, activeCard.hp - randomAttack.damage),
          }

          const enemyBattleLog = [
            ...newBattleLog,
            `${currentEnemy.name} använder ${randomAttack.name} för ${randomAttack.damage} skada!`,
          ]

          // Check if player's active card is defeated
          if (newPlayerCards[gameState.activeCardIndex].hp <= 0) {
            enemyBattleLog.push(`${activeCard.name} är besegrat!`)

            // Find next alive card
            const nextAliveCard = newPlayerCards.findIndex((card) => card.hp > 0)
            if (nextAliveCard !== -1) {
              setGameState((prev) => ({
                ...prev,
                playerCards: newPlayerCards,
                activeCardIndex: nextAliveCard,
                turn: "player",
                battleLog: enemyBattleLog,
              }))
            } else {
              setGameState((prev) => ({
                ...prev,
                playerCards: newPlayerCards,
                battlePhase: "defeat",
                battleLog: enemyBattleLog,
              }))
              return
            }
          } else {
            setGameState((prev) => ({
              ...prev,
              playerCards: newPlayerCards,
              turn: "player",
              battleLog: enemyBattleLog,
            }))
          }
        }
      }, 1500)
    }

    const handleVictory = () => {
      const baseReward = isBossMatch ? 100 : 50
      const bonusReward = isBossMatch ? 50 : 0

      setGameState((prev) => ({
        ...prev,
        coins: prev.coins + baseReward + bonusReward,
        matchesWon: prev.matchesWon + 1,
        selectedCards: [],
        activeCardIndex: 0,
        battlePhase: "select",
        playerCards: [],
        enemyCards: [],
        currentEnemyCard: 0,
        turn: "player",
        battleLog: [],
        screen: isBossMatch ? "rewards" : "menu",
      }))
    }

    if (gameState.battlePhase === "select") {
      return (
        <div className="min-h-screen bg-gradient-to-b from-red-600 to-orange-700 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white">Välj din karaktär</h2>
                {isBossMatch && (
                  <Badge className="bg-yellow-500 mt-2">
                    <Star className="w-4 h-4 mr-1" />
                    BOSS MATCH!
                  </Badge>
                )}
              </div>
              <Button variant="outline" onClick={() => setGameState((prev) => ({ ...prev, screen: "menu" }))}>
                Avbryt
              </Button>
            </div>

            {gameState.selectedCards.length > 0 && (
              <div className="mb-6 text-center">
                <p className="text-white mb-2">Valda karaktärer:</p>
                <div className="flex justify-center gap-4">
                  {gameState.selectedCards.map((cardId) => {
                    const card = createCard(cardId)
                    return (
                      <div key={cardId} className="text-white font-bold">
                        {card.image ? (
                          <img
                            src={card.image || "/placeholder.svg"}
                            alt={card.name}
                            className="w-16 h-16 object-cover rounded-lg mx-auto mb-2"
                          />
                        ) : (
                          <div className="text-4xl mb-2">{card.emoji}</div>
                        )}
                        {card.name}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {Array.from(new Set(gameState.ownedCards)).map((cardId) => {
                const card = createCard(cardId)
                const isSelected = gameState.selectedCards.includes(cardId)
                return (
                  <Card
                    key={cardId}
                    className={`cursor-pointer transition-all hover:scale-105 ${isSelected ? "ring-4 ring-yellow-400 bg-yellow-50" : ""}`}
                    onClick={() => selectCard(cardId)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-16 h-16 mb-2 mx-auto flex items-center justify-center">
                        {card.image ? (
                          <img
                            src={card.image || "/placeholder.svg"}
                            alt={card.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-4xl">{card.emoji}</div>
                        )}
                      </div>
                      <h3 className="font-bold text-sm mb-2">{card.name}</h3>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500" />
                          {card.hp}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-blue-500" />
                          {card.attacks.length}
                        </span>
                      </div>
                      <Badge className={`${getRarityColor(card.rarity)} text-white text-xs`}>{card.rarity}</Badge>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {gameState.selectedCards.length === 3 && (
              <div className="text-center">
                <Button size="lg" onClick={startBattle}>
                  <Zap className="mr-2" />
                  Starta strid!
                </Button>
              </div>
            )}
          </div>
        </div>
      )
    }

    if (gameState.battlePhase === "choose-active") {
      return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-700 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Välj ditt aktiva kort</h2>
              <p className="text-indigo-100">Klicka på kortet du vill börja strida med</p>
            </div>

            <div className="flex gap-6 justify-center">
              {gameState.playerCards.map((card, index) => (
                <Card
                  key={index}
                  className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
                  onClick={() => chooseActiveCard(index)}
                >
                  <CardContent className="p-4 text-center w-48">
                    <div className="w-24 h-24 mb-3 mx-auto flex items-center justify-center">
                      {card.image ? (
                        <img
                          src={card.image || "/placeholder.svg"}
                          alt={card.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-5xl">{card.emoji}</div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{card.name}</h3>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        {card.hp}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-blue-500" />
                        {card.attacks.length}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {card.attacks.map((attack, attackIndex) => (
                        <div key={attackIndex} className="text-xs bg-gray-100 rounded p-1">
                          {attack.name} ({attack.damage})
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (gameState.battlePhase === "victory") {
      return (
        <div className="min-h-screen bg-gradient-to-b from-green-600 to-blue-700 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold mb-4 text-green-600">Seger!</h2>
              <p className="text-lg mb-4">
                Du vann {isBossMatch ? 150 : 50} mynt!
                {isBossMatch && (
                  <>
                    <br />
                    <span className="text-yellow-600 font-bold">Boss besegrat!</span>
                  </>
                )}
              </p>
              <Button onClick={handleVictory}>{isBossMatch ? "Välj belöning" : "Fortsätt"}</Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (gameState.battlePhase === "defeat") {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-600 to-red-700 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">💀</div>
              <h2 className="text-3xl font-bold mb-4 text-red-600">Förlust!</h2>
              <p className="text-lg mb-4">Din karaktär är besegrad.</p>
              <Button
                onClick={() => {
                  setGameState((prev) => ({
                    ...prev,
                    screen: "menu",
                    selectedCards: [],
                    activeCardIndex: 0,
                    battlePhase: "select",
                    playerCards: [],
                    enemyCards: [],
                    currentEnemyCard: 0,
                    turn: "player",
                    battleLog: [],
                  }))
                }}
              >
                Tillbaka till menyn
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    // Battle screen
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-red-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Enemy cards */}
          <div className="mb-8">
            <h3 className="text-white text-xl mb-4">Motståndare {isBossMatch ? "(BOSS)" : ""}</h3>
            <div className="flex gap-4 justify-center">
              {gameState.enemyCards.map((card, index) => (
                <Card
                  key={index}
                  className={`${index === gameState.currentEnemyCard ? "ring-2 ring-red-400" : ""} ${card.hp <= 0 ? "opacity-50" : ""}`}
                >
                  <CardContent className="p-4 text-center w-32">
                    <div className="w-12 h-12 mb-2 mx-auto flex items-center justify-center">
                      {card.image ? (
                        <img
                          src={card.image || "/placeholder.svg"}
                          alt={card.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-3xl">{card.emoji}</div>
                      )}
                    </div>
                    <h4 className="font-bold text-sm mb-2">{card.name}</h4>
                    <Progress value={(card.hp / card.maxHp) * 100} className="mb-2" />
                    <div className="text-xs">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Heart className="w-3 h-3 text-red-500" />
                        {card.hp}/{card.maxHp}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Battle log */}
          <div className="mb-8">
            <Card className="max-h-32 overflow-y-auto">
              <CardContent className="p-4">
                {gameState.battleLog.map((log, index) => (
                  <p key={index} className="text-sm mb-1">
                    {log}
                  </p>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-8 justify-center">
            {/* Player's 3 cards */}
            <div className="flex gap-4">
              {gameState.playerCards.map((card, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    index === gameState.activeCardIndex ? "ring-4 ring-blue-400" : "ring-2 ring-gray-400"
                  } ${card.hp <= 0 ? "opacity-50" : ""}`}
                  onClick={() => switchActiveCard(index)}
                >
                  <CardContent className="p-3 text-center w-24">
                    <div className="w-12 h-12 mb-2 mx-auto flex items-center justify-center">
                      {card.image ? (
                        <img
                          src={card.image || "/placeholder.svg"}
                          alt={card.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-2xl">{card.emoji}</div>
                      )}
                    </div>
                    <h4 className="font-bold text-xs mb-1">{card.name}</h4>
                    <div className="text-xs">
                      <Heart className="w-3 h-3 text-red-500 inline mr-1" />
                      {card.hp}/{card.maxHp}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Active card large display */}
            {gameState.playerCards[gameState.activeCardIndex] && (
              <div className="relative w-80 h-96 rounded-xl overflow-hidden shadow-2xl">
                {/* Background image */}
                <div className="absolute inset-0">
                  {gameState.playerCards[gameState.activeCardIndex].image ? (
                    <img
                      src={gameState.playerCards[gameState.activeCardIndex].image || "/placeholder.svg"}
                      alt={gameState.playerCards[gameState.activeCardIndex].name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-blue-500 to-purple-600 flex items-center justify-center text-8xl">
                      {gameState.playerCards[gameState.activeCardIndex].emoji}
                    </div>
                  )}
                </div>

                {/* Semi-transparent overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40" />

                {/* Health in top right corner */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-70 rounded-lg p-2">
                  <Progress
                    value={
                      (gameState.playerCards[gameState.activeCardIndex].hp /
                        gameState.playerCards[gameState.activeCardIndex].maxHp) *
                      100
                    }
                    className="mb-1 w-20"
                  />
                  <div className="flex items-center justify-center gap-1 text-white text-sm">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="font-bold">
                      {gameState.playerCards[gameState.activeCardIndex].hp}/
                      {gameState.playerCards[gameState.activeCardIndex].maxHp}
                    </span>
                  </div>
                </div>

                {/* Card content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                  {/* Top - Name */}
                  <div>
                    <h2 className="text-2xl font-bold text-center">
                      {gameState.playerCards[gameState.activeCardIndex].name}
                    </h2>
                  </div>

                  {/* Bottom - Attacks */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-center mb-3">Attacker</h3>
                    {gameState.playerCards[gameState.activeCardIndex].attacks.map((attack, index) => (
                      <button
                        key={index}
                        onClick={() => performAttack(attack)}
                        disabled={gameState.turn !== "player"}
                        className="w-full bg-black bg-opacity-60 hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-3 transition-all hover:scale-105 border border-white border-opacity-30"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold">{attack.name}</span>
                          <span className="flex items-center gap-1">
                            <Sword className="w-4 h-4 text-orange-400" />
                            {attack.damage}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{attack.description}</p>
                      </button>
                    ))}

                    {gameState.turn === "enemy" && (
                      <div className="text-center text-yellow-300 font-bold">Motståndarens tur...</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const RewardsScreen = () => {
    const [selectedReward, setSelectedReward] = useState<string | null>(null)

    const rewards = [
      {
        id: "cards",
        title: "Kraftfulla kort",
        description: "Få 3 sällsynta kort",
        emoji: "🎴",
        action: () => {
          const rareCards = CARD_TYPES.filter((c) => c.rarity === "rare" || c.rarity === "legendary")
          const newCards = Array.from({ length: 3 }, () => {
            const randomCard = rareCards[Math.floor(Math.random() * rareCards.length)]
            return randomCard.id
          })
          setGameState((prev) => ({
            ...prev,
            ownedCards: [...prev.ownedCards, ...newCards],
            screen: "menu",
          }))
        },
      },
      {
        id: "coins",
        title: "Guldskatt",
        description: "Få 200 extra mynt",
        emoji: "💰",
        action: () => {
          setGameState((prev) => ({
            ...prev,
            coins: prev.coins + 200,
            screen: "menu",
          }))
        },
      },
      {
        id: "legendary",
        title: "Legendariskt kort",
        description: "Få ett garanterat legendariskt kort",
        emoji: "⭐",
        action: () => {
          const legendaryCards = CARD_TYPES.filter((c) => c.rarity === "legendary")
          const randomLegendary = legendaryCards[Math.floor(Math.random() * legendaryCards.length)]
          setGameState((prev) => ({
            ...prev,
            ownedCards: [...prev.ownedCards, randomLegendary.id],
            screen: "menu",
          }))
        },
      },
    ]

    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-600 to-orange-700 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">🏆 Boss Besegrat! 🏆</h2>
            <p className="text-yellow-100 text-xl">Välj din belöning:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <Card
                key={reward.id}
                className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
                onClick={() => reward.action()}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">{reward.emoji}</div>
                  <h3 className="text-2xl font-bold mb-2">{reward.title}</h3>
                  <p className="text-gray-600">{reward.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Rendera rätt skärm
  switch (gameState.screen) {
    case "collection":
      return <CollectionScreen />
    case "shop":
      return <ShopScreen />
    case "battle":
      return <BattleScreen />
    case "rewards":
      return <RewardsScreen />
    default:
      return <MenuScreen />
  }
}
