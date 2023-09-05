import {Element} from "@/lib/units/element";

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

  get units() {
    let units = []

    for (let u_id of this.units_id) {
      let u = Element.elements_by_id[u_id]
      if (!u) {
        Element.elements_id.delete(u_id)
      } else {
        units.push(u)
      }
    }

    return units
  }
}