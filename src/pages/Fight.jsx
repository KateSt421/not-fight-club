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
      const randomMonster =
        monsters[Math.floor(Math.random() * monsters.length)];
      setMonster(randomMonster);
      setMonsterHP(randomMonster.health);
      generateMonsterTurn();
    }
  }, [char.name, navigate]);

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

    playerAttack.forEach((attackZone) => {
      if (!monsterDefense.includes(attackZone)) {
        monsterDamageTaken += 10;
        addLog(`⚔️ ${char.name} попал в ${getZoneName(attackZone)}! (-10 HP)`);
      } else {
        addLog(
          `🛡️ ${monster.name} заблокировал атаку в ${getZoneName(attackZone)}`
        );
      }
    });

    monsterAttack.forEach((attackZone) => {
      if (!playerDefense.includes(attackZone)) {
        playerDamageTaken += monster.damage;
        addLog(
          `⚔️ ${monster.name} попал в ${getZoneName(attackZone)}! (-${
            monster.damage
          } HP)`
        );
      } else {
        addLog(
          `🛡️ ${char.name} заблокировал атаку в ${getZoneName(attackZone)}`
        );
      }
    });

    const newMonsterHP = Math.max(monsterHP - monsterDamageTaken, 0);
    const newPlayerHP = Math.max(playerHP - playerDamageTaken, 0);

    setMonsterHP(newMonsterHP);
    setPlayerHP(newPlayerHP);
    setPlayerAttack([]);
    setPlayerDefense([]);
    setRound((prev) => prev + 1);

    if (newPlayerHP <= 0) endFight(false);
    else if (newMonsterHP <= 0) endFight(true);
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
    addLog(`🏳️ ${char.name} сдался`);
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
      addLog(`🎉 ${char.name} победил ${monster.name}!`);
    } else {
      updated.loses++;
      addLog(`💀 ${char.name} проиграл против ${monster.name}...`);
    }

    setChar(updated);
    setCharacter(updated);
    clearBattleState();
  };

  const continueBattle = () => {
    clearBattleState();
    navigate("/fight");
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
