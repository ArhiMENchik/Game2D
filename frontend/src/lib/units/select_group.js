export class SelectGroup {
  constructor() {
    this._units = []

    this.callback = () => {
    }

    const self = this

    this._proxy_units = new Proxy(self._units, {
      set(target, p, newValue, receiver) {
        Reflect.set(target, p, newValue, receiver)

        if (target.length > 0) {
          target[0].is_select = true
          console.log(true)
        }

        self.callback()

        return true
      }
    })
  }

  add(u) {
    if (this._proxy_units.filter(f_u => f_u.id === u.id).length === 0) {
      this._proxy_units.push(u)
      u.is_picked = true
    }
  }

  remove(u) {
    let indexToDelete = this._proxy_units.findIndex(f_u => f_u.id === u.id)

    if (indexToDelete !== -1) {
      this._proxy_units.splice(indexToDelete, 1)
      u.is_picked = false
      u.is_select = false
    }
  }

  reset() {
    for (let u of this._proxy_units) {
      u.is_picked = false
      u.is_select = false
    }

    this._proxy_units.splice(0, this._proxy_units.length)
  }

  get units() {
    return this._proxy_units
  }

  set units(value) {
    if (this._proxy_units.length > 0) {
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
    return this._proxy_units.length === 0
  }

  on_change(func) {
    this.callback = func
  }
}