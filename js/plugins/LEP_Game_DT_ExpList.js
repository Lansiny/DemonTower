/*
 * @Description:
 * @Version: 1.0
 * @Autor: Lansiny
 * @LastEditors: Lansiny
 * @Date: 2021-03-03 11:43:35
 * @LastEditTime: 2021-03-03 11:53:32
 */
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
  1: 15,
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

function levelUp(actor) {
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
