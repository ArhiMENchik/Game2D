export class SelectGroup {
  constructor() {
    this._units = []
  }

  add(u) {
    if (this._units.filter(f_u => f_u.id === u.id).length === 0) {
      this._units.push(u)
      u.is_picked = true
    }
  }

  remove(u) {
    this._units = this._units.filter(f_u => f_u.id !== u.id)
    u.is_picked = false
  }

  reset() {
    for (let u of this._units) {
      u.is_picked = false
    }

    this._units = []
  }

  get units() {
    return this._units ? this._units : []
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
      this._units = []
    }
  }

  get is_empty() {
    return !(this._units.length > 0)
  }
}