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

export class MissileModel {
  constructor(sprite_map, start_x, start_y, count_img = 1, speed = 4,
              orientation = Common.orientation.horizontal, width = 32, height = 32) {
    this.sprite_map = sprite_map

    this.start_x = start_x
    this.start_y = start_y

    this.speed = speed
    this.count_img = count_img
    this.orientation = orientation

    this.width = width
    this.height = height

    this.frames_left = 0
    this.currrent_img = 1
  }

  get data() {
    let x
    let y
    let offset
    let offset_x = 1
    let offset_y = 1

    if (this.frames_left === 0) {
      if (this.currrent_img < this.count_img) {
        this.currrent_img++
      } else {
        this.currrent_img = 1
      }
      this.frames_left = this.speed
    } else {
      this.frames_left--
    }

    offset = this.currrent_img - 1

    if (this.orientation === Common.orientation.horizontal) {
      offset_x = offset * this.width
    } else {
      offset_y = offset * this.height
    }

    x = this.start_x + offset_x
    y = this.start_y + offset_y

    return [this.sprite_map.img, x, y, this.width, this.height]
  }
}