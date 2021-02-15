//=============================================================================
// Lansiny Engine Plugins - Game DemonTower - Map Window
// LEP_Game_DT_MapWindow.js
//=============================================================================

/*:
 * @target MV
 * @plugindesc LEP游戏系列 魔塔 地图显示角色信息
 * @author lansiny
 *
 */

function Window_MapStatus() {
  this.initialize.apply(this, arguments)
}
Window_MapStatus.prototype = Object.create(Window_Base.prototype)
Window_MapStatus.prototype.constructor = Window_MapStatus
Window_MapStatus.prototype.initialize = function (x, y, width, height) {
  Window_Base.prototype.initialize.call(this, x, y, width, height)
  this.opacity = 0
  this.refresh()
}
Game_Actor.prototype.mapWindowRefresh = Game_Actor.prototype.refresh
Game_Actor.prototype.refresh = function () {
  this.mapWindowRefresh
}
Window_MapStatus.prototype.drawGauge = function (
  x,
  y,
  width,
  rate,
  color1,
  color2
) {
  y += 8
  var fillW = Math.floor(width * rate)
  var gaugeY = y + this.lineHeight() - 10
  this.contents.fillRect(x, gaugeY, width, 8, this.gaugeBackColor())
  this.contents.gradientFillRect(x, y + 24, fillW, 6, color1, color2, true)
  this.contents.gradientFillRect(x, y + 30, fillW, 6, color2, color1, true)
  this.contents.fillRect(x, y + 24, width, 2, this.normalColor())
  this.contents.fillRect(x, y + 34, width, 2, this.normalColor())
  this.contents.fillRect(x, y + 26, 2, 8, this.normalColor())
  this.contents.fillRect(x + width - 2, y + 26, 2, 8, this.normalColor())
}
Window_MapStatus.prototype.refresh = function () {
  this.contents.clear()
  this.drawActorFace($gameParty.members()[0], 0, 0)
  this.drawActorName($gameParty.members()[0], 156, 0)
  this.drawActorLevel(150, 48, 80)
  this.drawActorExp($gameParty.members()[0], 0, 150, 288)
  this.drawActorParam(0, 158 + 44, 288, '生 命 值', $getActor().hp)
  this.drawActorParam(0, 158 + 44 * 2, 288, '攻 击', $getActor().atk)
  this.drawActorParam(0, 158 + 44 * 3, 288, '防 御', $getActor().def)
  // this.drawActorParam(0, 158 + 44 * 4, 288, '魔 力', $gameActors.actor(1).mat)
  // this.drawActorParam(0, 158 + 44 * 5, 288, '魔 抗', $gameActors.actor(1).mdf)
  // this.drawActorParam(0, 158 + 44 * 6, 288, '敏 捷', $gameActors.actor(1).agi)
  // this.drawActorParam(0, 158 + 44 * 7, 288, '幸 运', $gameActors.actor(1).luk)
  this.drawIcon(320, 0, 158 + 44 * 4, 144, '黄钥匙', $gameParty._items[2]?$gameParty._items[2]:0)
  this.drawIcon(321, 144, 158 + 44 * 4 , 144, '蓝钥匙', $gameParty._items[3]?$gameParty._items[3]:0)
  this.drawIcon(322, 0, 158 + 44 * 5, 144, '红钥匙', $gameParty._items[4]?$gameParty._items[4]:0)
  this.drawIcon(323, 144, 158 + 44 * 5, 144, '绿钥匙', $gameParty._items[5]?$gameParty._items[5]:0)
  this.drawIcon(330, 0, 158 + 44 * 6, 144, '金币', $gameParty._gold)
  this.drawPosition(0, 158 + 44 * 7, 288, '位置', $dataMapInfos[$gameMap.mapId()].name)
}
Window_MapStatus.prototype.update = function () {
  Window_Base.prototype.update.call(this)
  this.refresh()
}
Game_BattlerBase.prototype.expRate = function () {
  return (this.currentExp() - this.currentLevelExp()) / $expNeedList[this._level]
}
Window_MapStatus.prototype.drawIcon = function (
  iconIndex,
  x,
  y,
  width,
  text,
  item
) {
  var bitmap = ImageManager.loadSystem('IconSet')
  var pw = Window_Base._iconWidth
  var ph = Window_Base._iconHeight
  var sx = (iconIndex % 16) * pw
  var sy = Math.floor(iconIndex / 16) * ph
  this.contents.blt(bitmap, sx, sy, pw, ph, x, y)
  this.contents.fontSize = 24
  this.changeTextColor(this.normalColor())
  this.drawText(item, x + 24 + 8, y, width - 24 - 36 - 8, 'right')
}

Window_MapStatus.prototype.drawActorParam = function (
  x,
  y,
  width,
  text,
  param,
  position = 'right'
) {
  this.contents.fontSize = 24
  this.changeTextColor(this.systemColor())
  this.drawText(text, x, y, 100)
  this.changeTextColor(this.normalColor())
  this.drawText(param, x + 100, y, width - 100 - 36, position)
}

Window_MapStatus.prototype.drawPosition = function (
  x,
  y,
  width,
  text,
  param
) {
  this.contents.fontSize = 24
  this.changeTextColor(this.systemColor())
  this.drawText(text, x, y, 60)
  this.changeTextColor(this.normalColor())
  this.drawText(param, x + 60, y, width - 60 - 36, 'center')
}

Window_MapStatus.prototype.drawActorLevel = function (x, y, width) {
  this.contents.fontSize = 28
  this.changeTextColor(this.systemColor())
  this.drawText('Lv', x, y, 30)
  this.changeTextColor(this.normalColor())
  this.drawText($gameActors.actor(1).level, x + 20, y, width - 8, 'right')
}

Window_MapStatus.prototype.drawActorExp = function (actor, x, y, width) {
  this.contents.fontSize = 24
  width = width - 36 || 288 - 36
  var color1 = this.tpGaugeColor1()
  var color2 = this.tpGaugeColor2()
  this.drawGauge(x, y, width, actor.expRate(), color1, color2)
  this.changeTextColor(this.systemColor())
  this.drawText(TextManager.expA, x, y, 48)
  this.drawCurrentAndMax(
    actor.currentExp() - actor.currentLevelExp(),
    $expNeedList[$gameActors.actor(1).level],
    x,
    y,
    width,
    this.tpColor(actor),
    this.normalColor()
  )
}

Scene_Map.prototype.createDisplayObjects = function () {
  //创建精灵组
  this.createSpriteset()
  //创建地图名称窗口
  this.createMapNameWindow()
  //创建窗口层
  this.createWindowLayer()
  //创建所有窗口
  this.createAllWindows()
  //创建一个显示角色状态的窗口
  this.createStatusWindow()
}
//创建
Scene_Map.prototype.mapWindowCreate = Scene_Map.prototype.create
Scene_Map.prototype.create = function () {
  this.mapWindowCreate()
  var face = ImageManager.loadFace($gameParty.members()[0]._faceName)
  var icons = ImageManager.loadSystem('IconSet')
}

//创建一个显示名字的窗口
Scene_Map.prototype.createStatusWindow = function () {
  this._statusWindow = new Window_MapStatus(0, 0, 289, 720)
  this.addWindow(this._statusWindow) //窗口添加到窗口层
}
