"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Coins, Heart, Sword, Star, Trophy, ShoppingCart, Users, Zap } from "lucide-react"

// Korttyper och data
const CARD_TYPES = [
  { id: 1, name: "Flamewyrm", hp: 120, atk: 35, rarity: "common", cost: 50, image: "/images/flamewyrm.png" },
  { id: 2, name: "Aquadragon", hp: 110, atk: 30, rarity: "common", cost: 45, image: "/images/aquadragon.png" },
  { id: 3, name: "Thunderbeast", hp: 100, atk: 40, rarity: "common", cost: 55, image: "/images/thunderbeast.png" },
  { id: 4, name: "Earthguard", hp: 140, atk: 25, rarity: "common", cost: 60, image: "/images/earthguard.png" },
  { id: 5, name: "Windspirit", hp: 90, atk: 45, rarity: "uncommon", cost: 80, emoji: "💨" },
  { id: 6, name: "Icephoenix", hp: 130, atk: 38, rarity: "uncommon", cost: 85, emoji: "❄️" },
  { id: 7, name: "Shadowlord", hp: 150, atk: 42, rarity: "rare", cost: 120, emoji: "🌙" },
  { id: 8, name: "Lightbringer", hp: 160, atk: 40, rarity: "rare", cost: 130, emoji: "☀️" },
  { id: 9, name: "Voidmaster", hp: 180, atk: 50, rarity: "legendary", cost: 200, emoji: "🌌" },
  { id: 10, name: "Cosmicdragon", hp: 200, atk: 55, rarity: "legendary", cost: 250, emoji: "✨" },
]

const STARTER_CARDS = [1, 2, 3] // Flamewyrm, Aquadragon, Thunderbeast

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
}

type GameState = {
  screen: "menu" | "collection" | "shop" | "battle" | "rewards"
  coins: number
  ownedCards: number[]
  matchesWon: number
  selectedCards: number[]
  battleState: any
}

export default function PokemonCardGame() {
  const [gameState, setGameState] = useState<GameState>({
    screen: "menu",
    coins: 100,
    ownedCards: STARTER_CARDS,
    matchesWon: 0,
    selectedCards: [],
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
    const [battlePhase, setBattlePhase] = useState<"select" | "battle" | "victory" | "defeat">("select")
    const [playerCards, setPlayerCards] = useState<GameCard[]>([])
    const [enemyCards, setEnemyCards] = useState<GameCard[]>([])
    const [currentPlayerCard, setCurrentPlayerCard] = useState(0)
    const [currentEnemyCard, setCurrentEnemyCard] = useState(0)
    const [turn, setTurn] = useState<"player" | "enemy">("player")
    const [battleLog, setBattleLog] = useState<string[]>([])
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

      // Skapa motståndare (starkare för boss)
      let enemyDeck: GameCard[]
      if (isBossMatch) {
        // Boss har starkare kort
        const bossCardIds = [7, 8, 9] // Shadowlord, Lightbringer, Voidmaster
        enemyDeck = bossCardIds.map((id) => {
          const card = createCard(id)
          // Boost boss stats
          card.hp = Math.floor(card.hp * 1.3)
          card.maxHp = card.hp
          card.atk = Math.floor(card.atk * 1.2)
          return card
        })
      } else {
        // Vanlig motståndare
        const availableCards = CARD_TYPES.filter((c) => c.rarity === "common" || c.rarity === "uncommon")
        enemyDeck = Array.from({ length: 3 }, () => {
          const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)]
          return createCard(randomCard.id)
        })
      }

      setPlayerCards(playerDeck)
      setEnemyCards(enemyDeck)
      setBattlePhase("battle")
      setBattleLog([`Striden börjar! ${isBossMatch ? "⭐ BOSS MATCH! ⭐" : ""}`])
    }

    const attack = () => {
      if (turn !== "player") return

      const playerCard = playerCards[currentPlayerCard]
      const enemyCard = enemyCards[currentEnemyCard]

      if (!playerCard || !enemyCard) return

      // Spelarens attack
      const newEnemyCards = [...enemyCards]
      newEnemyCards[currentEnemyCard] = {
        ...enemyCard,
        hp: Math.max(0, enemyCard.hp - playerCard.atk),
      }
      setEnemyCards(newEnemyCards)
      setBattleLog((prev) => [...prev, `${playerCard.name} attackerar ${enemyCard.name} för ${playerCard.atk} skada!`])

      // Kontrollera om fiendens kort är besegrat
      if (newEnemyCards[currentEnemyCard].hp <= 0) {
        setBattleLog((prev) => [...prev, `${enemyCard.name} är besegrat!`])

        // Hitta nästa levande fiendekort
        const nextEnemyCard = newEnemyCards.findIndex((card, index) => index > currentEnemyCard && card.hp > 0)
        if (nextEnemyCard !== -1) {
          setCurrentEnemyCard(nextEnemyCard)
        } else {
          // Alla fiendens kort är besegrade
          setBattlePhase("victory")
          return
        }
      }

      setTurn("enemy")

      // Fiendens tur (automatisk efter kort delay)
      setTimeout(() => {
        const currentEnemy = newEnemyCards[currentEnemyCard]
        if (currentEnemy && currentEnemy.hp > 0) {
          const newPlayerCards = [...playerCards]
          newPlayerCards[currentPlayerCard] = {
            ...playerCard,
            hp: Math.max(0, playerCard.hp - currentEnemy.atk),
          }
          setPlayerCards(newPlayerCards)
          setBattleLog((prev) => [
            ...prev,
            `${currentEnemy.name} attackerar ${playerCard.name} för ${currentEnemy.atk} skada!`,
          ])

          // Kontrollera om spelarens kort är besegrat
          if (newPlayerCards[currentPlayerCard].hp <= 0) {
            setBattleLog((prev) => [...prev, `${playerCard.name} är besegrat!`])

            // Hitta nästa levande spelarkort
            const nextPlayerCard = newPlayerCards.findIndex((card, index) => index > currentPlayerCard && card.hp > 0)
            if (nextPlayerCard !== -1) {
              setCurrentPlayerCard(nextPlayerCard)
            } else {
              // Alla spelarens kort är besegrade
              setBattlePhase("defeat")
              return
            }
          }
        }
        setTurn("player")
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
        screen: isBossMatch ? "rewards" : "menu",
      }))
    }

    if (battlePhase === "select") {
      return (
        <div className="min-h-screen bg-gradient-to-b from-red-600 to-orange-700 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white">Välj 3 kort för strid</h2>
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

            <div className="mb-6">
              <p className="text-white mb-2">Valda kort: {gameState.selectedCards.length}/3</p>
              <div className="flex gap-2">
                {gameState.selectedCards.map((cardId, index) => {
                  const card = createCard(cardId)
                  return (
                    <div key={index} className="w-8 h-8 flex items-center justify-center">
                      {card.image ? (
                        <img
                          src={card.image || "/placeholder.svg"}
                          alt={card.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="text-2xl">{card.emoji}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {Array.from(new Set(gameState.ownedCards)).map((cardId) => {
                const card = createCard(cardId)
                const isSelected = gameState.selectedCards.includes(cardId)
                return (
                  <Card
                    key={cardId}
                    className={`cursor-pointer transition-all hover:scale-105 ${isSelected ? "ring-2 ring-yellow-400" : ""}`}
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
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500" />
                          {card.hp}
                        </span>
                        <span className="flex items-center gap-1">
                          <Sword className="w-3 h-3 text-orange-500" />
                          {card.atk}
                        </span>
                      </div>
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

    if (battlePhase === "victory") {
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

    if (battlePhase === "defeat") {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-600 to-red-700 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">💀</div>
              <h2 className="text-3xl font-bold mb-4 text-red-600">Förlust!</h2>
              <p className="text-lg mb-4">Alla dina kort är besegrade.</p>
              <Button onClick={() => setGameState((prev) => ({ ...prev, screen: "menu", selectedCards: [] }))}>
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
          {/* Fiendens kort */}
          <div className="mb-8">
            <h3 className="text-white text-xl mb-4">Motståndare {isBossMatch ? "(BOSS)" : ""}</h3>
            <div className="flex gap-4 justify-center">
              {enemyCards.map((card, index) => (
                <Card
                  key={index}
                  className={`${index === currentEnemyCard ? "ring-2 ring-red-400" : ""} ${card.hp <= 0 ? "opacity-50" : ""}`}
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
                      <div className="flex items-center justify-center gap-1">
                        <Sword className="w-3 h-3 text-orange-500" />
                        {card.atk}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stridslog */}
          <div className="mb-8">
            <Card className="max-h-32 overflow-y-auto">
              <CardContent className="p-4">
                {battleLog.map((log, index) => (
                  <p key={index} className="text-sm mb-1">
                    {log}
                  </p>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Spelarens kort */}
          <div>
            <h3 className="text-white text-xl mb-4">Dina kort</h3>
            <div className="flex gap-4 justify-center mb-6">
              {playerCards.map((card, index) => (
                <Card
                  key={index}
                  className={`${index === currentPlayerCard ? "ring-2 ring-blue-400" : ""} ${card.hp <= 0 ? "opacity-50" : ""}`}
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
                      <div className="flex items-center justify-center gap-1">
                        <Sword className="w-3 h-3 text-orange-500" />
                        {card.atk}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" disabled={turn !== "player"} onClick={attack}>
                {turn === "player" ? "Attackera!" : "Motståndarens tur..."}
              </Button>
            </div>
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
