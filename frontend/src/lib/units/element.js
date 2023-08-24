import Common from "@/lib/common";
import {Player} from "@/lib/player";

export class Element {
  static id = 0

  static offset_x = 0
  static offset_y = 0

  static element_type = {
    unit: 1,
    tile: 2,
    dummy: 3,
  }

  static set_offset(x, y) {
    Element.offset_x = x
    Element.offset_y = y
  }

  static elements_by_id = {}

  constructor(sprite, x_sprite, y_sprite, x_field, y_field, type, width = 32, height = 32) {
    this.id = ++Element.id

    this.sprite = sprite

    this.x_sprite = x_sprite
    this.y_sprite = y_sprite

    this.x_field = x_field
    this.y_field = y_field

    this.width = width
    this.height = height

    this.prevent_action = false

    this.type = type

    Element.elements_by_id[this.id] = this
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

    return [this.sprite.img, this.x_sprite, this.y_sprite, this.width, this.height, x, y, this.width, this.height]
  }

  _action() {
  }

  click_detection(x, y) {
    return ((this.x_field <= x && this.x_field + this.width >= x) &&
      (this.y_field <= y && this.y_field + this.height >= y))
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
}

export class Tile extends Element {
  constructor(sprite, x_sprite, y_sprite, x_field, y_filed, is_block = true) {
    super(sprite, x_sprite, y_sprite, x_field, y_filed, Element.element_type.tile)
    this.is_block = is_block
  }
}

export class Dummy extends Element {
  constructor(sprite, x_sprite, y_sprite, x_field, y_filed, offset_x, offset_y) {
    super(sprite, x_sprite, y_sprite, x_field, y_filed, Element.element_type.dummy)
  }
}