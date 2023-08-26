import Common from "@/lib/common";
import {Player} from "@/lib/player";
import {Element} from "@/lib/units/element";

export class Unit extends Element {
  static command = {
    stop: 'stop',
    move: 'move',
    attack: 'attack'
  }

  constructor(sprite, x_sprite, y_sprite, x_field, y_filed,
              player_id, max_hp = 10, max_mp = 10, damage = 2,
              speed = 2, attack_speed = 1000, attack_range = 32) {
    super(sprite, x_sprite, y_sprite, x_field, y_filed, Element.element_type.unit)
    this.player_id = player_id

    this.max_hp = max_hp
    this.max_mp = max_mp

    this.hp = max_hp
    this.mp = max_mp

    this.damage = damage

    this.attack_speed = attack_speed
    this.attack_range = attack_range
    this.last_attack = null

    this.speed = speed

    this.x_action = this.x_field
    this.y_action = this.y_field

    this.is_select = false

    this.command = Unit.command.stop

    this.target = null
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

      let distance = Common.calc_dist(this.x_field_central, this.y_field_central,
        this.target.x_field_central, this.target.y_field_central)

      if (distance <= this.attack_range) {
        if (!this.last_attack) {
          this.refresh_last_attack()
          return
        }

        if ((new Date() - this.last_attack) >= this.attack_speed) {
          this.target.take_damage(this.damage)
          this.refresh_last_attack()

          if (this.target.is_died) {
            this.last_attack = null
            this.stop()
          }
        }

        return
      }

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
    return this.mp / this.max_mp
  }

  get player_name() {
    return Player.player_by_id[this.player_id].name
  }

  is_enemy_for_player(player_id) {
    return this.player_id !== player_id
  }

  refresh_last_attack() {
    this.last_attack = new Date()
  }

  take_damage(damage) {
    this.hp -= damage
    if (this.is_died) {
      this.kill()
    }
  }

  get is_died() {
    return this.hp <= 0
  }

  kill() {
    Element.elements_by_id[this.id] = null
    delete Element.elements_by_id[this.id]
  }

  stop() {
    this.target = null
    this.x_action = this.x_field
    this.y_action = this.y_field
    this.command = Unit.command.stop
  }
}