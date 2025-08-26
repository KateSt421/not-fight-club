import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  getCharacter,
  setCharacter,
  getBattleState,
  setBattleState,
  clearBattleState,
  addBattleToHistory,
} from "../utils/storage";
import { monsters, attackZones } from "../data/monsters";
import styles from "../styles/Fight.module.css";
import FightHeader from "../components/fight/FightHeader";
import HealthBars from "../components/fight/HealthBars";
import PlayerActions from "../components/fight/PlayerActions";
import MonsterActions from "../components/fight/MonsterActions";
import BattleControls from "../components/fight/BattleControls";
import BattleInfo from "../components/fight/BattleInfo";
import GameOver from "../components/fight/GameOver";
import BattleLog from "../components/fight/BattleLog";

export default function Fight() {
  const navigate = useNavigate();
  const [char, setChar] = useState(getCharacter());
  const [playerHP, setPlayerHP] = useState(100);
  const [monster, setMonster] = useState(null);
  const [monsterHP, setMonsterHP] = useState(0);
  const [log, setLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(1);

  const [playerAttack, setPlayerAttack] = useState([]);
  const [playerDefense, setPlayerDefense] = useState([]);
  const [monsterAttack, setMonsterAttack] = useState([]);
  const [monsterDefense, setMonsterDefense] = useState([]);

  const startNewBattle = useCallback(() => {
    clearBattleState();

    setPlayerHP(100);
    setMonsterHP(0);
    setGameOver(false);
    setRound(1);
    setPlayerAttack([]);
    setPlayerDefense([]);
    setMonsterAttack([]);
    setMonsterDefense([]);

    const randomMonster = monsters[Math.floor(Math.random() * monsters.length)];
    setMonster(randomMonster);
    setMonsterHP(randomMonster.health);

    setLog([
      `🎮 НОВЫЙ БОЙ: ${char.name} vs ${randomMonster.name}`,
      `❤️ ${char.name}: 100 HP | ${randomMonster.name}: ${randomMonster.health} HP`,
    ]);
  }, [char.name]);

  const generateMonsterTurn = useCallback(() => {
    if (!monster) return;

    const attackZonesCopy = [...attackZones];
    const monsterAttackZones = [];

    for (let i = 0; i < monster.attackZones; i++) {
      if (attackZonesCopy.length === 0) break;
      const randomIndex = Math.floor(Math.random() * attackZonesCopy.length);
      monsterAttackZones.push(attackZonesCopy[randomIndex].id);
      attackZonesCopy.splice(randomIndex, 1);
    }

    const defenseZonesCopy = [...attackZones];
    const monsterDefenseZones = [];

    for (let i = 0; i < monster.defenseZones; i++) {
      if (defenseZonesCopy.length === 0) break;
      const randomIndex = Math.floor(Math.random() * defenseZonesCopy.length);
      monsterDefenseZones.push(defenseZonesCopy[randomIndex].id);
      defenseZonesCopy.splice(randomIndex, 1);
    }

    setMonsterAttack(monsterAttackZones);
    setMonsterDefense(monsterDefenseZones);
  }, [monster]);

  useEffect(() => {
    if (!char.name) {
      navigate("/", { replace: true });
      return;
    }

    const savedBattle = getBattleState();
    if (savedBattle) {
      setPlayerHP(savedBattle.playerHP);
      setMonster(savedBattle.monster);
      setMonsterHP(savedBattle.monsterHP);
      setLog(savedBattle.log);
      setRound(savedBattle.round);
      setPlayerAttack(savedBattle.playerAttack || []);
      setPlayerDefense(savedBattle.playerDefense || []);
      setMonsterAttack(savedBattle.monsterAttack || []);
      setMonsterDefense(savedBattle.monsterDefense || []);
      setGameOver(savedBattle.gameOver || false);
    } else {
      startNewBattle();
    }
  }, [char.name, navigate, startNewBattle]);

  useEffect(() => {
    if (monster && char.name) {
      const battleState = {
        playerHP,
        monster,
        monsterHP,
        log,
        round,
        playerAttack,
        playerDefense,
        monsterAttack,
        monsterDefense,
        gameOver,
        timestamp: new Date().toISOString(),
      };
      setBattleState(battleState);
    }
  }, [
    playerHP,
    monster,
    monsterHP,
    log,
    round,
    playerAttack,
    playerDefense,
    monsterAttack,
    monsterDefense,
    gameOver,
    char.name,
  ]);

  useEffect(() => {
    if (monster) {
      generateMonsterTurn();
    }
  }, [playerAttack, playerDefense, round, monster, generateMonsterTurn]);

  const addLog = (msg) => setLog((prev) => [msg, ...prev]);

  const handleZoneSelect = (zoneId, type) => {
    if (type === "attack") {
      setPlayerAttack((prev) =>
        prev.includes(zoneId)
          ? prev.filter((z) => z !== zoneId)
          : prev.length < 1
          ? [...prev, zoneId]
          : prev
      );
    } else {
      setPlayerDefense((prev) =>
        prev.includes(zoneId)
          ? prev.filter((z) => z !== zoneId)
          : prev.length < 2
          ? [...prev, zoneId]
          : prev
      );
    }
  };

  const isAttackButtonDisabled =
    playerAttack.length !== 1 || playerDefense.length !== 2;

  const fight = () => {
    if (gameOver || isAttackButtonDisabled) return;

    let playerDamageTaken = 0;
    let monsterDamageTaken = 0;
    let playerHits = 0;
    let playerBlocks = 0;
    let monsterHits = 0;
    let monsterBlocks = 0;

    addLog(`🥊 РАУНД ${round} НАЧАЛСЯ!`);

    addLog(
      `🗺️ ${char.name} атакует: ${playerAttack
        .map((z) => getZoneName(z))
        .join(", ")}`
    );
    addLog(
      `🗺️ ${char.name} защищает: ${playerDefense
        .map((z) => getZoneName(z))
        .join(", ")}`
    );
    addLog(
      `🗺️ ${monster.name} атакует: ${monsterAttack
        .map((z) => getZoneName(z))
        .join(", ")}`
    );
    addLog(
      `🗺️ ${monster.name} защищает: ${monsterDefense
        .map((z) => getZoneName(z))
        .join(", ")}`
    );

    playerAttack.forEach((attackZone) => {
      const zoneName = getZoneName(attackZone);
      if (!monsterDefense.includes(attackZone)) {
        monsterDamageTaken += 10;
        playerHits++;
        addLog(
          `⚔️ АТАКА: ${char.name} → ${monster.name} в ${zoneName} → 10 УРОНА`
        );
      } else {
        playerBlocks++;
        addLog(
          `🛡️ БЛОК: ${monster.name} блокирует атаку ${char.name} в ${zoneName}`
        );
      }
    });

    monsterAttack.forEach((attackZone) => {
      const zoneName = getZoneName(attackZone);
      if (!playerDefense.includes(attackZone)) {
        playerDamageTaken += monster.damage;
        monsterHits++;
        addLog(
          `⚔️ АТАКА: ${monster.name} → ${char.name} в ${zoneName} → ${monster.damage} УРОНА`
        );
      } else {
        monsterBlocks++;
        addLog(
          `🛡️ БЛОК: ${char.name} блокирует атаку ${monster.name} в ${zoneName}`
        );
      }
    });

    addLog(`📈 РЕЗУЛЬТАТ РАУНДА ${round}:`);
    addLog(
      `   ${char.name}: ${playerHits} попаданий, ${playerBlocks} атак заблокировано`
    );
    addLog(
      `   ${monster.name}: ${monsterHits} попаданий, ${monsterBlocks} атак заблокировано`
    );

    if (monsterDamageTaken > 0) {
      addLog(`   💢 ${char.name} нанес ${monsterDamageTaken} урона`);
    }

    if (playerDamageTaken > 0) {
      addLog(`   💢 ${monster.name} нанес ${playerDamageTaken} урона`);
    }

    const newMonsterHP = Math.max(monsterHP - monsterDamageTaken, 0);
    const newPlayerHP = Math.max(playerHP - playerDamageTaken, 0);

    setMonsterHP(newMonsterHP);
    setPlayerHP(newPlayerHP);
    setPlayerAttack([]);
    setPlayerDefense([]);
    setRound((prev) => prev + 1);

    addLog(`❤️ ТЕКУЩЕЕ ЗДОРОВЬЕ:`);
    addLog(`   ${char.name}: ${newPlayerHP}/100 HP`);
    addLog(`   ${monster.name}: ${newMonsterHP}/${monster.health} HP`);

    if (newPlayerHP <= 0) {
      addLog(`💀 ${char.name} ПОТЕРЯЛ СОЗНАНИЕ!`);
      endFight(false);
    } else if (newMonsterHP <= 0) {
      addLog(`🎯 ${monster.name} ПОБЕЖДЕН!`);
      endFight(true);
    } else {
      addLog(`🔜 ПОДГОТОВКА К РАУНДУ ${round + 1}...`);
    }
  };

  const getZoneName = (zoneId) => {
    const zone = attackZones.find((z) => z.id === zoneId);
    return zone ? zone.name : zoneId;
  };

  const getZoneIcon = (zoneId) => {
    const zone = attackZones.find((z) => z.id === zoneId);
    return zone ? zone.icon : "❓";
  };

  const surrender = () => {
    if (gameOver) return;
    addLog(`🏳️ ${char.name} ДОБРОВОЛЬНО СДАЕТСЯ!`);
    addLog(`💔 Бой завершен досрочно`);
    addLog(
      `📊 Итоговое здоровье: ${char.name} - ${playerHP} HP, ${monster.name} - ${monsterHP} HP`
    );
    endFight(false);
  };

  const endFight = (won) => {
    setGameOver(true);
    const updated = { ...char };

    addBattleToHistory({
      character: char.name,
      monster: monster.name,
      result: won ? "win" : "lose",
      playerHP,
      monsterHP: won ? 0 : monsterHP,
      rounds: round,
    });

    if (won) {
      updated.wins++;
      addLog(
        `🎉 ПОБЕДА! ${char.name} одолел ${monster.name} за ${round} раундов!`
      );
      addLog(`🏆 Новый счет побед: ${updated.wins}`);
    } else {
      updated.loses++;
      addLog(`💀 ПОРАЖЕНИЕ! ${monster.name} оказался сильнее...`);
      addLog(`📉 Новый счет поражений: ${updated.loses}`);
    }

    setChar(updated);
    setCharacter(updated);
    clearBattleState();
  };

  const continueBattle = () => {
    startNewBattle();
  };

  if (!monster) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <FightHeader char={char} monster={monster} round={round} />

      <HealthBars
        char={char}
        playerHP={playerHP}
        monster={monster}
        monsterHP={monsterHP}
      />

      {!gameOver && (
        <>
          <div className={styles.battleInterface}>
            <PlayerActions
              attackZones={attackZones}
              playerAttack={playerAttack}
              playerDefense={playerDefense}
              onZoneSelect={handleZoneSelect}
            />

            <MonsterActions
              monster={monster}
              monsterAttack={monsterAttack}
              monsterDefense={monsterDefense}
              attackZones={attackZones}
              getZoneName={getZoneName}
              getZoneIcon={getZoneIcon}
            />
          </div>

          <BattleControls
            onAttack={fight}
            onSurrender={surrender}
            isAttackDisabled={isAttackButtonDisabled}
            round={round}
          />

          <BattleInfo monster={monster} />
        </>
      )}

      {gameOver && (
        <div className={styles.gameOver}>
          <h2>{playerHP > 0 ? "🎉 Победа!" : "💀 Поражение"}</h2>
          <p>Раундов: {round}</p>
          <button onClick={() => navigate("/main")} className={styles.back}>
            На главную
          </button>
          <button onClick={continueBattle} className={styles.continueButton}>
            Новый бой
          </button>
        </div>
      )}

      <BattleLog log={log} />
    </div>
  );
}
