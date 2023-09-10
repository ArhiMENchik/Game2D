import Common from "@/lib/common";
import {Player} from "@/lib/player";
import {Element} from "@/lib/units/element";
import {Missile} from "@/lib/units/missile";

export class Unit extends Element {
  constructor(player_id, model, x_field, y_field, size = 1,
              max_hp = 650, max_mp = 100, speed = 2,
              damage = 15, attack_speed = 1000, attack_range = 128, missile_model) {
    super(model, x_field, y_field, Element.element_type.unit, size, speed)
    this.player_id = player_id

    this.max_hp = max_hp
    this.max_mp = max_mp

    this.hp = max_hp
    this.mp = max_mp

    this.damage = damage

    this.attack_speed = attack_speed
    this.attack_range = attack_range ? attack_range : (this.width + this.height) / 2
    this.last_attack = null
    this.missile_model = missile_model

    this.is_select = false

    this.command = Common.command.stop

    this._target = null

    this._death_callback = () => {
    }

    this._attacked_callback = () => {
    }

    this._attacking_callback = () => {
    }

    this._start_casting_callback = () => {
    }

    this._stop_casting_callback = () => {
    }

    this._finish_casting_callback = () => {
    }
  }

  get is_range() {
    return this.attack_range > (this.width + this.height) / 2
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

    if (this.x_field !== this.x_action && this.y_field !== this.y_action) {
      this.command = Common.command.move
    }
  }

  _action() {
    if (this.prevent_action) {
      this.prevent_action = false
      return
    }

    if (this.command === Common.command.attack) {
      if (!this.target) {
        this.last_attack = null
        this.stop()
      }

      this.x_action = this.target.x_field
      this.y_action = this.target.y_field

      let distance = Common.calc_dist(this.x_field_central, this.y_field_central,
        this.target.x_field_central, this.target.y_field_central)

      if (distance <= this.attack_range) {
        if (!this.last_attack) {
          this.refresh_last_attack()
          return
        }

        if ((new Date() - this.last_attack) >= this.attack_speed) {
          if (this.is_range) {
            this._attacking_callback()
            this.create_missile()
          } else {
            this.target.take_damage(this.damage)
          }

          this.refresh_last_attack()

          if (this.target.is_died) {
            this.stop()
          }
        }

        return
      }
    }

    super._action()
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

  create_missile() {
    let missile = new Missile(this.id, this.target.id, this.missile_model,
      this.x_field, this.y_field, 1, 4, this.damage)
  }

  take_damage(damage) {
    this._attacked_callback()
    this.hp -= damage
    if (this.is_died) {
      this.kill()
    }
  }

  get is_died() {
    return this.hp <= 0
  }

  kill() {
    this._death_callback()
    this.destroy()
  }

  stop() {
    this.target = null
    this.x_action = this.x_field
    this.y_action = this.y_field
  }

  get target() {
    return this._target
  }

  set target(value) {
    if (value === this) return

    this._target = value

    if (value) {
      this.command = Common.command.attack
    } else {
      this.command = Common.command.stop
    }
  }

  get color() {
    let color = null

    let player = Player.player_by_id[this.player_id]
    if (player) {
      color = player.color
    }

    return color
  }

  death(func) {
    this._death_callback = func
  }

  attacked(func) {
    this._attacked_callback = func
  }

  attacking(func) {
    this._attacking_callback = func
  }

  start_casting(func) {
    this._start_casting_callback = func
  }

  stop_casting(func) {
    this._stop_casting_callback = func
  }

  finish_casting(func) {
    this._finish_casting_callback = func
  }
}