//=============================================================================
// Lansiny Engine Plugins - Game DemonTower - Main
// LEP_Game_DT_Main.js
//=============================================================================

/*:
 * @target MV
 * @plugindesc LEP游戏系列 魔塔 主要逻辑函数
 * @author lansiny
 *
 */

function initActor() {
  $gameActors.actor(1)._hp = 1
  $gameActors.actor(1)._skill = {
    beforeBattle: '',
    attack: '普通攻击',
    defense: '无防御',
    afterBattle: ''
  }
  $gameActors.actor(1)._status = []
  addParam('atk', -1)
  addParam('def', -1)
}

function setDifficulty(rank) {
  switch (rank) {
    case 0:
      $gameActors.actor(1)._hp = 10000
      break
    case 1:
      $gameActors.actor(1)._hp = 1000
      break
    case 2:
      $gameActors.actor(1)._hp = 100
      break
    case 3:
      $gameActors.actor(1)._hp = 10
      break
  }
}

function $saveActor(actor) {
  addParam('atk', actor.atk - $gameActors.actor(1).atk)
  addParam('def', actor.def - $gameActors.actor(1).def)
  $gameActors.actor(1)._hp = actor.hp
  $gameParty._gold = actor.gold
  $gameActors.actor(1).changeExp(actor.exp, false)
  $gameActors.actor(1)._skill = actor.skill
  return true
}

function $getActor() {
  return {
    atk: $gameActors.actor(1).atk,
    def: $gameActors.actor(1).def,
    hp: $gameActors.actor(1)._hp,
    level: $gameActors.actor(1).level,
    gold: $gameParty._gold,
    exp: $gameActors.actor(1).currentExp(),
    skill: $gameActors.actor(1)._skill,
    status: $gameActors.actor(1)._status
  }
}

function $getActorExp() {
  let actor = $gameActors.actor(1)
  let currentExp = actor.currentExp() - actor.currentLevelExp()
  let nextLevelNeedExp = $expNeedList[actor.level]
  return `${currentExp}/${nextLevelNeedExp}`
}

function getBattleResult(actor, enemy) {
  actor.shield = 0
  actor.turnTimer = 0
  actor.battleStatus = []
  enemy.shield = 0
  enemy.turnTimer = 0
  enemy.battleStatus = []
  let damage = 0
  let isContinue = true
  // 玩家 战前技能
  if (actor.skill.beforeBattle !== '') {
    const result = $skill.beforeBattle[actor.skill.beforeBattle](actor, enemy)
    actor = result.a
    enemy = result.b
    damage += result.damageReceivedByA
    if (enemy.hp <= 0) {
      isContinue = false
      enemy.hp = 0
    }
    if (actor.hp <= 0) actor.hp = 0
  }

  // 敌人 战前技能
  if (isContinue && enemy.skill.beforeBattle !== '') {
    const result = $skill.beforeBattle[enemy.skill.beforeBattle](enemy, actor)
    enemy = result.a
    actor = result.b
    damage += result.damageReceivedByB
    if (enemy.hp <= 0) {
      isContinue = false
      enemy.hp = 0
    }
    if (actor.hp <= 0) actor.hp = 0
  }
  // 攻击循环
  let isActorTurn = true // true 攻击时玩家先手， false 攻击时敌人先手
  let isCanUseAfterBattleSkill = false
  while (isContinue) {
    // 判断攻击方
    let a = isActorTurn ? actor : enemy // a为攻击方
    let b = !isActorTurn ? actor : enemy
    // 被攻击方 防御技能
    const result = $skill.defense[b.skill.defense](
      a,
      b,
      $skill.attack[a.skill.attack](a, b)
    )
    a = result.a
    b = result.b
    b.hp -= result.damage
    // 攻击次数增加
    a.turnTimer += 1
    // 重新赋值
    actor = isActorTurn ? a : b
    enemy = !isActorTurn ? a : b
    // 玩家伤害计算
    if (!isActorTurn) damage += result.damage
    //判断是否可结束战斗
    if (enemy.hp <= 0) {
      isContinue = false
      isCanUseAfterBattleSkill = true
      enemy.hp = 0
      break
    }
    if (actor.hp <= 0) actor.hp = 0
    // 轮换攻击方
    isActorTurn = !isActorTurn
  }
  // 敌人 战后技能
  if (
    isCanUseAfterBattleSkill &&
    isContinue &&
    enemy.skill.afterBattle !== ''
  ) {
    const result = $skill.afterBattle[enemy.skill.afterBattle](enemy, actor)
    actor = result.b
    damage += result.damage
    if (actor.hp <= 0) {
      actor.hp = 0
    }
  }
  // 玩家 战后技能
  if (isContinue && actor.skill.afterBattle !== '') {
    const result = $skill.afterBattle[actor.skill.afterBattle](actor, enemy)
    actor = result.a
    damage += result.damage
    if (actor.hp <= 0) {
      actor.hp = 0
    }
  }
  // 返回角色与伤害数据
  return { actor, damage }
}

function battle(character) {
  let enemy = $enemies[$dataMap.events[character._eventId].name]
  let actor = $getActor()
  let level = actor.level
  if (enemy.def < actor.atk) {
    const battleResult = getBattleResult(
      Object.assign({}, actor),
      Object.assign({}, enemy)
    ).actor
    if (battleResult.hp > 0) {
      actor = battleResult
      actor.gold += enemy.gold
      actor.exp += enemy.exp
      $saveActor(actor)
      actor = $getActor()
      if (actor.level > level) levelUp(actor)
      $saveActor(actor)
      return true
    } else {
      actor.hp = 0
      $saveActor(actor)
      return false
    }
  } else {
    actor.hp = 0
    $saveActor(actor)
    return false
  }
}

function battleSimulation(enemyName, actor = $getActor()) {
  let enemy = $enemies[enemyName]
  if (enemy.def < actor.atk)
    return getBattleResult(Object.assign({}, actor), Object.assign({}, enemy))
      .damage
  else return '???'
}

function pickUpPotion(character) {
  let level = parseInt($dataMap.events[character._eventId].meta.potion, 10)
  $gameActors.actor(1)._hp += $potionList[level]
}

function pickUpGem(character) {
  let nameList = {
    红宝石: 'atk',
    蓝宝石: 'def'
  }
  let name = $dataMap.events[character._eventId].name
  let level = parseInt($dataMap.events[character._eventId].meta.gem, 10)
  addParam(nameList[name], $gemList[level])
}

function addParam(paramName, num) {
  let actorParamList = {
    atk: 2,
    def: 3,
    mat: 4,
    mdf: 5,
    agi: 6,
    luk: 7
  }
  $gameActors.actor(1)._paramPlus[actorParamList[paramName]] += num
}
