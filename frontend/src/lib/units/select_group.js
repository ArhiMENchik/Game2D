export class SelectGroup {
  constructor(player) {
    this._units = []
    this.player = player
  }

  add(u) {
    // if (u.is_enemy_for_player(this.player.id)) return

    if (this._units.filter(f_u => f_u.id === u.id).length === 0) {
      this._units.push(u)
      u.is_picked = true
      u.is_select = true
    }
  }

  remove(u) {
    let indexToDelete = this._units.findIndex(f_u => f_u.id === u.id)

    if (indexToDelete !== -1) {
      this._units.splice(indexToDelete, 1)
      u.is_picked = false
      u.is_select = false
    }
  }

  reset() {
    for (let u of this._units) {
      u.is_picked = false
      u.is_select = false
    }

    this._units.splice(0, this._units.length)
  }

  get units() {
    return this._units
  }

  set units(value) {
    if (this._units.length > 0) {
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
    return this._units.length === 0
  }

  on_change(func) {
    this.callback = func
  }
}