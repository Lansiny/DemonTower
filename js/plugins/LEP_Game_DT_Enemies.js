/*
 * @Description:
 * @Version: 1.0
 * @Autor: Lansiny
 * @LastEditors: Lansiny
 * @Date: 2021-03-03 11:43:35
 * @LastEditTime: 2021-03-06 15:35:28
 */
//=============================================================================
// Lansiny Engine Plugins - Game DemonTower - Enemies
// LEP_Game_DT_Enemies.js
//=============================================================================

/*:
 * @target MV
 * @plugindesc LEP游戏系列 魔塔 敌人参数列表
 * @author lansiny
 *
 */

// 敌人
window.$enemies = {
  自定义敌人: {
    hp: 10,
    atk: 1,
    def: 0,
    exp: 0,
    gold: 0
  },
  小型史莱姆: {
    hp: 10,
    atk: 6,
    def: 0,
    exp: 1,
    gold: 0
  },
  灰色史莱姆: {
    hp: 25,
    atk: 7,
    def: 0,
    exp: 1,
    gold: 0
  },
  粉色史莱姆: {
    hp: 80,
    atk: 15,
    def: 0,
    exp: 1,
    gold: 0
  },
  小蝙蝠: {
    hp: 100,
    atk: 18,
    def: 3,
    exp: 1,
    gold: 0
  },
  黑暗史莱姆: {
    hp: 70,
    atk: 20,
    def: 0,
    exp: 1,
    gold: 0,
    skill: {
      attack: '魔法攻击'
    }
  },
  骷髅: {
    hp: 200,
    atk: 20,
    def: 5,
    exp: 1,
    gold: 0
  },
  白银史莱姆_15F1: {
    hp: 550,
    atk: 25,
    def: 6,
    exp: 5,
    gold: 0,
    ability: '精英'
  },
  白银史莱姆_14F4: {
    hp: 800,
    atk: 35,
    def: 25,
    exp: 5,
    gold: 0,
    ability: '精英',
    skill: {
      beforeBattle: '史莱姆冲击'
    }
  }
}

for (const enemyName in window.$enemies) {
  window.$enemies[enemyName].name = enemyName.split('_')[0]
}
