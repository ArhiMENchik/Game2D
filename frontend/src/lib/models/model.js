import Common from "@/lib/common";

export class Model {
  constructor(sprite_map, x, y, width = 32, height = 32) {
    this.sprite_map = sprite_map
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this._stand = null
  }

  get stand() {
    if (!this.stand) {
      return this.data
    }
  }

  set_stand(sprite_map, x_start, y_start,
              width = 32, height = 32,
              count, orientation = Common.orientation.horizontal) {
    this._stand = new Animation(sprite_map, x_start, y_start, width, height, count, orientation)
  }

  get data() {
    return [this.sprite_map.img, this.x, this.y, this.width, this.height]
  }
}

class Animation {
  constructor(sprite_map, x_start, y_start,
              width = 32, height = 32,
              count, orientation = Common.orientation.horizontal) {
    this.sprite_map = sprite_map
    this.x_start = x_start
    this.y_start = y_start
    this.width = width
    this.height = height
    this.count = count
    this.orientation = orientation
    this.current_animation = 1
  }

  _get_pos(count) {
    let x = this.x_start
    let y = this.y_start

    if (this.orientation === Common.orientation.horizontal) {
      x += this.width * count
    } else {
      y += this.height * count
    }

    return [x, y]
  }

  get start() {
    return [this.sprite_map.img, this.x_start, this.y_start, this.width, this.height]
  }

  get current() {
    return [this.sprite_map.img, ...this._get_pos(this.current_animation), this.width, this.height]
  }

  get next() {
    let count = this.current_animation === this.count ? 1 : ++this.current_animation

    return [this.sprite_map.img, ...this._get_pos(count), this.width, this.height]
  }

  get end() {
    return [this.sprite_map.img, ...this._get_pos(this.count), this.width, this.height]
  }
}