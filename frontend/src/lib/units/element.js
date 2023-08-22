import Common from "@/lib/common";
import {Player} from "@/lib/player";

export class Element {
  static id = 0

  static offset_x = 0
  static offset_y = 0

  static element_type = {
    unit: 1,
    tile: 2,
    dummy: 3,
  }

  static set_offset(x, y) {
    Element.offset_x = x
    Element.offset_y = y
  }

  static elements_by_id = {}

  constructor(sprite, x_sprite, y_sprite, x_field, y_field, type, width = 32, height = 32) {
    this.id = ++Element.id

    this.sprite = sprite

    this.x_sprite = x_sprite
    this.y_sprite = y_sprite

    this.x_field = x_field
    this.y_field = y_field

    this.width = width
    this.height = height

    this.prevent_action = false

    this.type = type

    Element.elements_by_id[this.id] = this
  }

  get x_field_central() {
    return this.x_field + this.width / 2
  }

  get y_field_central() {
    return this.y_field + this.height / 2
  }

  prevent_act() {
    this.prevent_action = true
  }

  get data_for_render() {
    let x = this.x_field - Element.offset_x
    let y = this.y_field - Element.offset_y

    return [this.sprite.img, this.x_sprite, this.y_sprite, this.width, this.height, x, y, this.width, this.height]
  }

  _action() {
  }

  click_detection(x, y) {
    return ((this.x_field <= x && this.x_field + this.width >= x) &&
      (this.y_field <= y && this.y_field + this.height >= y))
  }

  get x_screen() {
    return this.x_field - Element.offset_x
  }

  get y_screen() {
    return this.y_field - Element.offset_y
  }

  get x_screen_central() {
    return this.x_field - Element.offset_x + this.width / 2
  }

  get y_screen_central() {
    return this.y_field - Element.offset_y + this.height / 2
  }
}

export class Unit extends Element {
  static command = {
    stop: 'stop',
    move: 'move',
    attack: 'attack'
  }

  constructor(sprite, x_sprite, y_sprite, x_field, y_filed, player_id, max_hp = 10, max_mp = 10, speed = 2) {
    super(sprite, x_sprite, y_sprite, x_field, y_filed, Element.element_type.unit)
    this.player_id = player_id

    this.max_hp = max_hp
    this.max_mp = max_mp

    this.hp = max_hp
    this.mp = max_mp

    this.speed = speed

    this.x_action = this.x_field
    this.y_action = this.y_field

    this.is_select = false

    this.command = Unit.command.stop

    let target = null
  }

  get x_screen_action_central() {
    return this.x_action - Element.offset_x + this.width / 2
  }

  get y_screen_action_central() {
    return this.y_action - Element.offset_y + this.height / 2
  }

  set_new_pos(x_action, y_action) {
    this.x_action = x_action
    this.y_action = y_action
  }

  _action() {
    super._action()
    if (this.prevent_action) {
      this.prevent_action = false
      return
    }

    if (this.target) {
      this.command = Unit.command.attack

      this.x_action = this.target.x_field
      this.y_action = this.target.y_field

    } else {
      this.command = Unit.command.move
    }

    if (this.speed > 0) {
      let dist

      dist = Common.calc_dist(this.x_field, this.y_field, this.x_action, this.y_action)

      if (dist < this.speed) {
        this.x_field = this.x_action
        this.y_field = this.y_action

        this.command = Unit.command.stop
      }

      if (this.x_field !== this.x_action && this.y_field !== this.y_action) {
        let new_pos = Common.calc_new_pos(this.x_field, this.y_field, this.x_action, this.y_action, this.speed)

        this.x_field += new_pos.new_x
        this.y_field += new_pos.new_y
      }
    }
  }

  potential_action() {
    let x_p = this.x_field
    let y_p = this.y_field

    if (Common.calc_dist(this.x_field, this.y_field, this.x_action, this.y_action) < this.speed) {
      x_p = this.x_action
      y_p = this.y_action
    }

    if (x_p !== this.x_action && y_p !== this.y_action) {
      let new_pos = Common.calc_new_pos(this.x_field, this.y_field, this.x_action, this.y_action, this.speed)

      x_p += new_pos.new_x
      y_p += new_pos.new_y
    }

    return {x_p, y_p}
  }

  get hp_color() {
    let red = 255 - (((this.hp * 100) / this.max_hp) * 255) / 100
    let green = (((this.hp * 100) / this.max_hp) * 255) / 100

    return `rgb(${red}, ${green}, 0)`
  }

  get hp_percent() {
    return this.hp / this.max_hp
  }

  get mp_percent() {
    return this.hp / this.max_hp
  }

  get player_name() {
    return Player.player_by_id[this.player_id].name
  }

  is_enemy_for_player(player_id) {
    return this.player_id !== player_id
  }
}

export class Tile extends Element {
  constructor(sprite, x_sprite, y_sprite, x_field, y_filed, is_block = true) {
    super(sprite, x_sprite, y_sprite, x_field, y_filed, Element.element_type.tile)
    this.is_block = is_block
  }
}

export class Dummy extends Element {
  constructor(sprite, x_sprite, y_sprite, x_field, y_filed, offset_x, offset_y) {
    super(sprite, x_sprite, y_sprite, x_field, y_filed, Element.element_type.dummy)
  }
}