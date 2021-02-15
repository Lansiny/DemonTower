//=============================================================================
// Lansiny Engine Plugins - Game DemonTower - Test
// LEP_Game_DT_Test.js
//=============================================================================

/*:
 * @target MV
 * @plugindesc LEP游戏系列 魔塔 测试用函数, 用于计算线路是否合理
 * @author lansiny
 *
 */

const $events = [
  { type: 'potion', lv: 2 },
  { type: 'gem', lv: 1, param: 'atk' },
  {
    type: 'enemy',
    name: '绿色史莱姆'
  }
]

function test(events) {
  const testActor = $getActor()
  let status = `hp: ${testActor.hp}, atk: ${testActor.atk}, def: ${testActor.def}`
  let log = '\n'
  for (let i = 0; i < events.length; i++) {
    status = `hp: ${testActor.hp}, atk: ${testActor.atk}, def: ${testActor.def}`
    if (events[i].type === 'enemy') {
      let damage = battleSimulation(events[i].name, testActor)
      if (damage === '???' || damage >= testActor.hp) {
        log += `${status} \t无法战胜 ${events[i].name}, 游戏结束 \n`
      } else {
        testActor.hp -= damage
        log += `${status} \t战胜 ${events[i].name} , 受到 ${damage} 伤害, 剩余生命值 ${testActor.hp} \n`
      }
    } else if (events[i].type === 'potion') {
      testActor.hp += $potionList[events[i].lv]
      log += `${status} \t生命值上升 ${$potionList[events[i].lv]} 点 \n`
    } else if (events[i].type === 'gem') {
      testActor[events[i].param] += $gemList[events[i].lv]
      log += `${status} \t${events[i].param} 上升 ${
        $gemList[events[i].lv]
      } 点 \n`
    }
  }
  log += `${status} \t流程结束 \n`
  return log
}

function move() {
  var commonEvent = $dataCommonEvents[this._params[0]];
  if (commonEvent) {
      var eventId = 0;
      this.setupChild(commonEvent.list, eventId);
  }
}
