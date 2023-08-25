import {Element} from '@/lib/units/element';

export class SelectGroup {
  constructor(player_id) {
    this._units_id = []
    this.player_id = player_id
  }

  add(u) {
    // if (u.is_enemy_for_player(this.player.id)) return

    if (this._units_id.filter(u_id => u_id === u.id).length === 0) {
      console.log(u)
      this._units_id.push(u.id)
      u.is_picked = true
      u.is_select = true
    }
  }

  remove(u) {
    let indexToDelete = this._units_id.findIndex(u_id => u_id === u.id)

    if (indexToDelete !== -1) {
      this._units_id.splice(indexToDelete, 1)
      u.is_picked = false
      u.is_select = false
    }
  }

  reset() {
    for (let u_id of this._units_id) {
      let u = Element.elements_by_id[u_id]

      u.is_picked = false
      u.is_select = false
    }

    this._units_id.splice(0, this._units_id.length)
  }

  get units_id() {
    return this._units_id
  }

  set units_id(value) {
    if (this._units_id.length > 0) {
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
    return this._units_id.length === 0
  }

  on_change(func) {
    this.callback = func
  }
}