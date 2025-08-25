import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCharacter, setCharacter } from "../utils/storage";
import { monsters, attackZones } from "../data/monsters";
import styles from "../styles/Fight.module.css";

export default function Fight() {
  const navigate = useNavigate();
  const [char, setChar] = useState(getCharacter());
  const [playerHP, setPlayerHP] = useState(100);
  const [monster, setMonster] = useState(null);
  const [monsterHP, setMonsterHP] = useState(0);
  const [log, setLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  
  // Выбор игрока
  const [playerAttack, setPlayerAttack] = useState([]);
  const [playerDefense, setPlayerDefense] = useState([]);
  
  // Выбор монстра (генерируется каждый ход)
  const [monsterAttack, setMonsterAttack] = useState([]);
  const [monsterDefense, setMonsterDefense] = useState([]);

  // Редирект если нет персонажа
  useEffect(() => {
    if (!char.name) {
      navigate("/", { replace: true });
    }
  }, [char.name, navigate]);

  // Выбираем случайного монстра при загрузке
  useEffect(() => {
    const randomMonster = monsters[Math.floor(Math.random() * monsters.length)];
    setMonster(randomMonster);
    setMonsterHP(randomMonster.health);
  }, []);

  // Генерируем ход монстра
  const generateMonsterTurn = () => {
    if (!monster) return;
    
    // Атака монстра
    const attackZonesCopy = [...attackZones];
    const monsterAttackZones = [];
    
    for (let i = 0; i < monster.attackZones; i++) {
      if (attackZonesCopy.length === 0) break;
      const randomIndex = Math.floor(Math.random() * attackZonesCopy.length);
      monsterAttackZones.push(attackZonesCopy[randomIndex].id);
      attackZonesCopy.splice(randomIndex, 1);
    }
    
    // Защита монстра
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
  };

  const addLog = (msg) => setLog((prev) => [msg, ...prev]);

  const handleZoneSelect = (zoneId, type) => {
    if (type === 'attack') {
      if (playerAttack.includes(zoneId)) {
        setPlayerAttack(playerAttack.filter(z => z !== zoneId));
      } else if (playerAttack.length < 1) {
        setPlayerAttack([...playerAttack, zoneId]);
      }
    } else {
      if (playerDefense.includes(zoneId)) {
        setPlayerDefense(playerDefense.filter(z => z !== zoneId));
      } else if (playerDefense.length < 2) {
        setPlayerDefense([...playerDefense, zoneId]);
      }
    }
  };

  const isAttackButtonDisabled = playerAttack.length !== 1 || playerDefense.length !== 2;

  const fight = () => {
    if (gameOver || isAttackButtonDisabled) return;

    // Генерируем ход монстра
    generateMonsterTurn();

    // Задержка для визуализации
    setTimeout(() => {
      // Логика боя
      let playerDamageTaken = 0;
      let monsterDamageTaken = 0;

      // Игрок атакует
      playerAttack.forEach(attackZone => {
        if (!monsterDefense.includes(attackZone)) {
          monsterDamageTaken += 10; // Урон игрока
          addLog(`⚔️ ${char.name} попал в ${getZoneName(attackZone)}!`);
        } else {
          addLog(`🛡️ Монстр заблокировал атаку в ${getZoneName(attackZone)}`);
        }
      });

      // Монстр атакует
      monsterAttack.forEach(attackZone => {
        if (!playerDefense.includes(attackZone)) {
          playerDamageTaken += monster.damage;
          addLog(`⚔️ ${monster.name} попал в ${getZoneName(attackZone)}!`);
        } else {
          addLog(`🛡️ ${char.name} заблокировал атаку в ${getZoneName(attackZone)}`);
        }
      });

      // Применяем урон
      setMonsterHP(hp => Math.max(hp - monsterDamageTaken, 0));
      setPlayerHP(hp => Math.max(hp - playerDamageTaken, 0));

      // Сбрасываем выбор
      setPlayerAttack([]);
      setPlayerDefense([]);

      // Проверяем конец боя
      if (playerHP - playerDamageTaken <= 0) {
        endFight(false);
      } else if (monsterHP - monsterDamageTaken <= 0) {
        endFight(true);
      }
    }, 500);
  };

  const getZoneName = (zoneId) => {
    const zone = attackZones.find(z => z.id === zoneId);
    return zone ? zone.name : zoneId;
  };

  const getZoneIcon = (zoneId) => {
    const zone = attackZones.find(z => z.id === zoneId);
    return zone ? zone.icon : '❓';
  };

  const surrender = () => {
    if (gameOver) return;
    addLog(`🏳️ ${char.name} сдался`);
    endFight(false);
  };

  const endFight = (won) => {
    setGameOver(true);
    const updated = { ...char };
    if (won) {
      updated.wins++;
      addLog(`🎉 ${char.name} победил ${monster.name}!`);
    } else {
      updated.loses++;
      addLog(`💀 ${char.name} проиграл против ${monster.name}...`);
    }
    setChar(updated);
    setCharacter(updated);
  };

  const handleImageError = (e) => {
    console.error("Image not found:", e.target.src);
    e.target.style.display = 'none';
  };

  if (!monster) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Бой: {char.name} vs {monster.name}</h2>

      <div className={styles.hpWrapper}>
        <div className={styles.box}>
          <img 
            src={char.avatar} 
            alt="Player avatar" 
            className={styles.avatar}
            onError={handleImageError}
          />
          <p className={styles.bold}>{char.name}</p>
          <div className={styles.healthBar}>
            <div 
              className={styles.healthFill} 
              style={{ width: `${(playerHP / 100) * 100}%` }}
            />
            <span>HP: {playerHP}</span>
          </div>
        </div>
        
        <div className={styles.vs}>VS</div>
        
        <div className={styles.box}>
          <img 
            src={monster.avatar} 
            alt="Monster avatar" 
            className={styles.avatar}
            onError={handleImageError}
          />
          <p className={styles.bold}>{monster.name}</p>
          <div className={styles.healthBar}>
            <div 
              className={styles.healthFill} 
              style={{ width: `${(monsterHP / monster.health) * 100}%` }}
            />
            <span>HP: {monsterHP}</span>
          </div>
        </div>
      </div>

      {!gameOver && (
        <>
          <div className={styles.battleInterface}>
            <div className={styles.playerSection}>
              <h3>Ваши действия:</h3>
              
              <div className={styles.zoneSelection}>
                <h4>Атака (выберите 1 зону):</h4>
                <div className={styles.zones}>
                  {attackZones.map(zone => (
                    <button
                      key={zone.id}
                      className={`${styles.zoneButton} ${
                        playerAttack.includes(zone.id) ? styles.selected : ''
                      }`}
                      onClick={() => handleZoneSelect(zone.id, 'attack')}
                      disabled={playerAttack.length >= 1 && !playerAttack.includes(zone.id)}
                    >
                      {zone.icon} {zone.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.zoneSelection}>
                <h4>Защита (выберите 2 зоны):</h4>
                <div className={styles.zones}>
                  {attackZones.map(zone => (
                    <button
                      key={zone.id}
                      className={`${styles.zoneButton} ${
                        playerDefense.includes(zone.id) ? styles.selected : ''
                      }`}
                      onClick={() => handleZoneSelect(zone.id, 'defense')}
                      disabled={playerDefense.length >= 2 && !playerDefense.includes(zone.id)}
                    >
                      {zone.icon} {zone.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.monsterSection}>
              <h3>Действия монстра:</h3>
              <div className={styles.monsterActions}>
                <p>Атака: {monsterAttack.map(z => getZoneIcon(z)).join(' ')}</p>
                <p>Защита: {monsterDefense.map(z => getZoneIcon(z)).join(' ')}</p>
              </div>
            </div>
          </div>

          <div className={styles.buttons}>
            <button 
              onClick={fight} 
              className={styles.attack}
              disabled={isAttackButtonDisabled}
            >
              Attack ({playerAttack.length}/1 атака, {playerDefense.length}/2 защиты)
            </button>
            <button onClick={surrender} className={styles.surrender}>
              Surrender
            </button>
          </div>
        </>
      )}

      {gameOver && (
        <button onClick={() => navigate("/main")} className={styles.back}>
          Back to Main
        </button>
      )}

      <div className={styles.log}>
        <h3>Battle Log</h3>
        {log.map((entry, idx) => (
          <p key={idx}>{entry}</p>
        ))}
      </div>
    </div>
  );
}
