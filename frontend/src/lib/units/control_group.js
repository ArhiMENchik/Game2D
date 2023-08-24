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

  add(keycode, units_id) {
    this._control_groups[keycode] = new ControlGroup(keycode, units_id)
  }
}

class ControlGroup {
  constructor(keycode, units_id) {
    this.keycode = keycode
    this.units_id = units_id
  }
}