//=============================================================================
// Lansiny Engine Plugins - Game DemonTower - Enemy Manual
// LEP_Game_DT_EnemyManual.js
//=============================================================================

/*:
 * @target MV
 * @plugindesc LEP游戏系列 魔塔 怪物图鉴
 * @author lansiny
 *
 */
;
(function () {
  let _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args)
    if (command === 'EnemyManual') {
      switch (args[0]) {
        case 'open':
          SceneManager.push(Scene_EnemyManual)
          break
      }
    }
  }

  function Scene_EnemyManual() {
    this.initialize.apply(this, arguments)
  }

  Scene_EnemyManual.prototype = Object.create(Scene_MenuBase.prototype)
  Scene_EnemyManual.prototype.constructor = Scene_EnemyManual

  Scene_EnemyManual.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this)
  }

  Scene_EnemyManual.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this)
    this._ManualWindow = new Window_EnemyManual(0, 0)
    this._ManualWindow.setHandler('cancel', this.popScene.bind(this))
    this.addWindow(this._ManualWindow)
  }

  function Window_EnemyManual() {
    this.initialize.apply(this, arguments)
  }

  Window_EnemyManual.prototype = Object.create(Window_MenuStatus.prototype)
  Window_EnemyManual.prototype.constructor = Window_EnemyManual

  Window_EnemyManual.prototype.initialize = function (x, y) {
    let width = this.windowWidth()
    let height = this.windowHeight()
    Window_Selectable.prototype.initialize.call(this, x, y, width, height)
    this._formationMode = false
    this._pendingIndex = -1
    this.refresh()
  }

  Window_EnemyManual.prototype.maxItems = function () {
    return this._list ? this._list.length : 0
  }

  Window_MenuStatus.prototype.numVisibleRows = function () {
    return 3
  }
  Window_EnemyManual.prototype.itemHeight = function () {
    return this.lineHeight() * 2 + 10
  }

  Window_EnemyManual.prototype.refresh = function () {
    this._list = []
    let nameList = []
    let eventList = {}
    for (let i = 1; i < $gameMap._events.length; i++) {
      if ($gameMap._events[i]) {
        let eventStatus = $gameMap._events[i]
        let eventData = $dataMap.events[eventStatus._eventId]
        if (eventData.meta.enemy && eventStatus._pageIndex === 0) {
          eventList[eventData.name] = {
            data: eventData,
            status: eventStatus
          }
          nameList.push(eventData.name)
        }
      }
    }
    let enemyTypeList = Array.from(new Set(nameList))
    for (let i = 0; i < enemyTypeList.length; i++) {
      this._list.push({
        param: $enemies[enemyTypeList[i]],
        event: eventList[enemyTypeList[i]],
        damage: battleSimulation(enemyTypeList[i], $getActor(), '敌人图鉴')
      })
    }
    this._list.sort(compare())
    this.createContents()
    this.drawAllItems()
  }

  function compare() {
    return function (a, b) {
      let value1 = a.damage
      let value2 = b.damage
      if (value1 === '???' && value2 !== '???') return -1
      else if (value1 !== '???' && value2 === '???') return 1
      else if (value1 === '???' && value2 === '???') {
        let value1 = a.param.hp
        let value2 = b.param.hp
        return value1 - value2
      }
      return value1 - value2
    }
  }

  Window_EnemyManual.prototype.drawItem = function (index) {
    if (this._list[index] !== null) {
      let enemy = this._list[index]
      let rect = this.itemRectForText(index)
      let lineHeight = this.lineHeight()
      let y = rect.y
      let x = rect.x
      let imageInfo = enemy.event.data.pages[0].image
      let bitmap = ImageManager.loadCharacter(imageInfo.characterName)
      let pw = 48
      let ph = 48
      let sx = imageInfo.characterIndex % 4 * 144 + 48
      let sy = (imageInfo.direction / 2) * 48 - 48 + (imageInfo.characterIndex > 3 ? 192 : 0)
        this.contents.blt(bitmap, sx, sy, pw, ph, (x + 140) / 2 - 24, y + 30)
      this.contents.fontSize = 18
      this.changeTextColor(this.normalColor())
      this.drawText(enemy.param.name, x, y, 140, 'center')
      this.contents.fontSize = 20
      let fontWidth = 28
      this.changeTextColor(this.systemColor())
      this.drawText('生命值', x + 140 + 10, y, fontWidth * 3)
      this.drawText('攻击', x + 140 + fontWidth * 7 + 20, y, fontWidth * 2)
      this.drawText('防御', x + 140 + fontWidth * 12 + 30, y, fontWidth * 2)
      this.drawText('经验', x + 140 + fontWidth * 17 + 40, y, fontWidth * 2)
      this.drawText('金币', x + 140 + fontWidth * 21 + 50, y, fontWidth * 2)
      this.drawText('伤害值', x + 140 + 10, y + lineHeight, fontWidth * 3)
      this.drawText(
        '特征',
        x + 140 + fontWidth * 7 + 20,
        y + lineHeight,
        fontWidth * 2
      )
      this.changeTextColor(this.normalColor())
      this.drawText(enemy.param.hp, 140 + fontWidth * 3 + 10, y, fontWidth * 4)
      this.drawText(enemy.param.atk, 140 + fontWidth * 9 + 20, y, fontWidth * 3)
      this.drawText(
        enemy.param.def,
        140 + fontWidth * 14 + 30,
        y,
        fontWidth * 3
      )
      this.drawText(
        enemy.param.exp,
        140 + fontWidth * 19 + 40,
        y,
        fontWidth * 3
      )
      this.drawText(
        enemy.param.gold,
        140 + fontWidth * 23 + 50,
        y,
        fontWidth * 3
      )
      this.drawText(
        enemy.damage,
        140 + fontWidth * 3 + 10,
        y + lineHeight,
        fontWidth * 4
      )
      let ability = enemy.param.ability ? enemy.param.ability + ' ' : ''
      let abilityStr = ability
      if (enemy.param.skill) {
        let beforeBattleSkill = enemy.param.skill.beforeBattle ? enemy.param.skill.beforeBattle + ' ' : ''
        let attackSkill = enemy.param.skill.attack ? enemy.param.skill.attack + ' ' : ''
        let defenseSkill = enemy.param.skill.defense ? enemy.param.skill.defense + ' ' : ''
        let afterBattleSkill = enemy.param.skill.afterBattle ? enemy.param.skill.afterBattle + ' ' : ''
        abilityStr = `${ability}${beforeBattleSkill}${attackSkill}${defenseSkill}${afterBattleSkill}`
      }
      this.drawText(
        abilityStr ? abilityStr : '无',
        x + 140 + fontWidth * 9 + 12,
        y + lineHeight,
        this.width - (x + 140 + fontWidth * 9 + 20)
      )
    }
  }

  Scene_Menu.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this)
    this.createCommandWindow()
    this.createGoldWindow()
    this.createStatusWindow()

    this._ManualWindow = new Window_EnemyManual(this._commandWindow.width, 0)
    this.addWindow(this._ManualWindow)
  }

  Scene_Menu.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this)
    this._ManualWindow.refresh()
  }
})()
