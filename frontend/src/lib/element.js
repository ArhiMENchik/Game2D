import Common from "@/lib/common";

class Element {
  static id = 0
  static element_type = {
    unit: 1,
    tile: 2,
    dummy: 3,
  }

  constructor(sprite, x_s, y_s, x_f, y_f, type, size_x = 32, size_y = 32) {
    this.id = ++Element.id

    this.sprite = sprite

    this.x_s = x_s
    this.y_s = y_s

    this.x_f = x_f
    this.y_f = y_f

    this.x_c = x_f + size_x / 2
    this.y_c = y_f + size_y / 2

    this.size_x = size_x
    this.size_y = size_y

    this.prevent_action = false

    this.type = type
  }

  prevent_act() {
    this.prevent_action = true
  }

  get data_for_render() {
    this._move()

    let x = this.x_f
    let y = this.y_f

    return [this.sprite.img, this.x_s, this.y_s, this.size_x, this.size_y, x, y, this.size_x, this.size_y]
  }

  _move() {
  }

  click_detection(x, y) {
    return ((this.x_f <= x && this.x_f + this.size_x >= x) &&
      (this.y_f <= y && this.y_f + this.size_y >= y))
  }

  in_area_rect(x, y, width, height) {
    return ((x <= this.x_f && x + width >= this.x_f) &&
      (y <= this.y_f && y + height >= this.y_f))
  }

  in_area_circ(x, y, radius) {
    return false
  }
}

export class Unit extends Element {
  constructor(sprite, x_s, y_s, x_f, y_f, hp = 10, mp = 10, speed = 2) {
    super(sprite, x_s, y_s, x_f, y_f, Element.element_type.unit)
    this.hp = hp
    this.mp = mp

    this.speed = speed

    this.x_m = this.x_f
    this.y_m = this.y_f

    this.x_m_c = this.x_c
    this.y_m_c = this.y_c
  }

  set_new_pos(x, y) {
    this.x_m = x
    this.y_m = y

    this.x_m_c = x + this.size_x / 2
    this.y_m_c = y + this.size_y / 2
  }

  _move() {
    super._move()
    if (this.prevent_action) {
      this.prevent_action = false
      return
    }

    if (this.speed > 0) {
      if (Common.calc_dist(this.x_f, this.y_f, this.x_m, this.y_m) < this.speed) {
        this.x_f = this.x_m
        this.y_f = this.y_m
      }

      if (this.x_f !== this.x_m && this.y_f !== this.y_m) {
        let new_pos = Common.calc_new_pos(this.x_f, this.y_f, this.x_m, this.y_m, this.speed)

        this.x_f += new_pos.new_x
        this.y_f += new_pos.new_y
      }

      this.x_c = this.x_f + this.size_x / 2
      this.y_c = this.y_f + this.size_y / 2
    }
  }

  potential_move() {
    let x_p = this.x_f
    let y_p = this.y_f

    if (Common.calc_dist(this.x_f, this.y_f, this.x_m, this.y_m) < this.speed) {
      x_p = this.x_m
      y_p = this.y_m
    }

    if (x_p !== this.x_m && y_p !== this.y_m) {
      let new_pos = Common.calc_new_pos(this.x_f, this.y_f, this.x_m, this.y_m, this.speed)

      x_p += new_pos.new_x
      y_p += new_pos.new_y
    }

    return {x_p, y_p}
  }
}

export class Tile extends Element {
  constructor(sprite, x_s, y_s, x_f, y_f, is_block = true) {
    super(sprite, x_s, y_s, x_f, y_f, Element.element_type.tile)
    this.is_block = is_block
  }
}

export class Dummy extends Element {
  constructor(sprite, x_s, y_s, x_f, y_f) {
    super(sprite, x_s, y_s, x_f, y_f, Element.element_type.dummy)
  }
}