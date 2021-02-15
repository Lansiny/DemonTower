//=============================================================================
// Lansiny Engine Plugins - Game DemonTower - ExpList
// LEP_Game_DT_ExpList.js
//=============================================================================

/*:
 * @target MV
 * @plugindesc LEP游戏系列 魔塔 升级所需经验列表
 * @author lansiny
 *
 */

window.$expNeedList = {
  0: 0,
  1: 10,
  2: 30,
  3: 50,
  4: 80,
  5: 120,
  6: 160,
  7: 200,
  8: 250,
  9: 300,
  10: 350
}

// window.$levelUpParmaList = {
//   1: {
//     hp: 0,
//     atk: 0,
//     def: 0
//   },
//   2: {
//     hp: 200,
//     atk: 2,
//     def: 2
//   },
// }

function levelUp(actor) {
  // actor.hp += $levelUpParmaList[actor.level]['hp']
  // actor.atk += $levelUpParmaList[actor.level]['atk']
  // actor.def += $levelUpParmaList[actor.level]['def']

  actor.hp += actor.level * 200 + Math.floor((actor.hp * 20) / 100)
  actor.atk += actor.level * 1 + Math.floor((actor.atk * 10) / 100)
  actor.def += actor.level * 1 + Math.floor((actor.def * 10) / 100)

}

Game_Actor.prototype.expForLevel = function (level) {
  let expTotal = 0
  for (let i = 0; i < level; i++) {
    expTotal += $expNeedList[i]
  }
  return expTotal
}
