import Common from "@/lib/game_logic/common";
import {Player} from "@/lib/game_logic/player";

export class Element {
  static id = 0

  static offset_x = 0
  static offset_y = 0

  static element_type = {
    unit: 1,
    missile: 2,
  }

  static set_offset(x, y) {
    Element.offset_x = x
    Element.offset_y = y
  }

  static elements_by_id = {}

  static get elements_id() {
    return Object.keys(Element.elements_by_id)
  }

  static get_element(id) {
    let e = Element.elements_by_id[id]

    if (!e) {
      Element.elements_id.delete(id)
      return null
    }

    return e
  }

  constructor(model, x_field, y_field, type, size = 1, speed = 0) {
    this.id = ++Element.id

    this.model = model

    this.x_field = x_field
    this.y_field = y_field

    this.x_action = this.x_field
    this.y_action = this.y_field

    this.prevent_action = false

    this.type = type

    this.size = size

    this.speed = speed

    this.x_panel = 0
    this.y_panel = 0

    Element.elements_by_id[this.id] = this
  }

  kwargs(kwargs) {
    for (let k in kwargs) {
      if (k in this) {
        this[k] = kwargs[k]
      }
    }

    return this
  }

  get width() {
    return this.model.width * this.size
  }

  get height() {
    return this.model.height * this.size
  }

  get x_field_central() {
    return this.x_field + this.width / 2
  }

  get y_field_central() {
    return this.y_field + this.height / 2
  }

  prevent_act() {
    this.prevent_action = true
  }

  get data_for_render() {
    let x = this.x_field - Element.offset_x
    let y = this.y_field - Element.offset_y

    return [...this.model.data, x, y, this.width, this.height]
  }

  _action() {
    if (this.speed > 0) {
      let dist = Common.calc_dist(this.x_field, this.y_field, this.x_action, this.y_action)

      if (dist < this.speed) {
        this.x_field = this.x_action
        this.y_field = this.y_action

        this.command = Common.command.stop
      }

      if (this.x_field !== this.x_action && this.y_field !== this.y_action) {
        let new_pos = Common.calc_new_pos(this.x_field, this.y_field, this.x_action, this.y_action, this.speed)

        this.x_field += new_pos.new_x
        this.y_field += new_pos.new_y
      }
    }
  }

  // todo add mouse move event logic

  click_detection(x, y) {
    return ((this.x_field <= x && this.x_field + this.width >= x) &&
      (this.y_field <= y && this.y_field + this.height >= y))
  }

  on_panel_click_detection(x, y) {
    return ((this.x_panel <= x && this.x_panel + this.width >= x) &&
      (this.y_panel <= y && this.y_panel + this.height >= y))
  }

  get x_screen() {
    return this.x_field - Element.offset_x
  }

  get y_screen() {
    return this.y_field - Element.offset_y
  }

  get x_screen_central() {
    return this.x_field - Element.offset_x + this.width / 2
  }

  get y_screen_central() {
    return this.y_field - Element.offset_y + this.height / 2
  }

  destroy() {
    Element.elements_by_id[this.id] = null
    delete Element.elements_by_id[this.id]
  }
}