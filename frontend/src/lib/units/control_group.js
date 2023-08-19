export class ControlGroups {
  constructor() {
    this._control_groups = {}
  }

  get_group(keycode) {
    return this._control_groups[keycode]
  }

  reset() {
    this._control_groups = {}
  }

  add(keycode, units) {
    this._control_groups[keycode] = new ControlGroup(keycode, units)
  }
}

class ControlGroup {
  constructor(keycode, units) {
    this.keycode = keycode
    this.units = units
  }
}