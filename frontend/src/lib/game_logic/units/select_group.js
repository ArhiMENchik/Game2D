import {Element} from '@/lib/game_logic/units/element';

export class SelectGroup {
  constructor(player_id) {
    this.__units_id = []

    this.player_id = player_id

    this.select_unit_id = 0
    this.select_unit_type = null

    let self = this
    this._units_id = new Proxy(self.__units_id, {
      set(target, p, newValue, receiver) {
        Reflect.set(target, p, newValue, receiver)

        if (target.length > 0) {
          let u = Element.get_element(target[0])
          if (!u) {
            target.delete(target[0])
            return
          }

          self.select_unit_id = target[0]
        }

        return true
      }
    })
  }

  set_select_unit(u_id) {
    if (this.units_id.length === 0) return
    if (this.select_unit_id === u_id) return
    if (this.units_id) return
  }

  set_next_select_unit() {
    if (this.units_id.length < 2) return

    let next = this.units_id.next(this.select_unit_id)
    if (next) {
      this.select_unit_id = next
    }
  }

  add(u) {
    // if (u.is_enemy_for_player(this.player.id)) return

    if (this.units_id.not(u.id)) {
      this.units_id.push(u.id)
      u.is_picked = true
    }
  }

  remove(u) {
    if (this.units_id.delete(u.id)) {
      u.is_picked = false
      u.x_panel = 0
      u.y_panel = 0
    }
  }

  reset() {
    for (let u_id of this.units_id) {
      let u = Element.get_element(u_id)
      if (!u) {
        this.units_id.delete(u_id)
        continue
      }

      u.is_picked = false
    }

    this.units_id.clear()
  }

  get units_id() {
    return this._units_id
  }

  set units(value) {
    if (this.units_id.length > 0) {
      this.reset()
    }

    if (value) {
      for (let u of value) {
        this.add(u)
      }
    } else {
      this.reset()
    }
  }

  get is_empty() {
    return this.units_id.length === 0
  }
}