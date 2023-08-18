export class SelectionArea {
  constructor(color = 'rgb(0, 255, 0)') {
    this.x_s = 0
    this.y_s = 0

    this.x_e = 0
    this.y_e = 0

    this.is_start = false

    this.color = color
  }

  get is_clear() {
    return (this.width === 0 && this.height === 0)
  }

  reset_pos() {
    this.x_s = 0
    this.y_s = 0

    this.x_e = 0
    this.y_e = 0

    this.is_start = false
  }

  set_start_pos(x, y) {
    this.x_s = x
    this.y_s = y

    this.is_start = true
  }

  set_end_pos(x, y) {
    this.x_e = x
    this.y_e = y
  }

  get highest_x() {
    return Math.min(this.x_s, this.x_e)
  }

  get highest_y() {
    return Math.min(this.y_s, this.y_e)
  }

  get width() {
    let width = 0

    if (this.x_s > this.x_e) {
      width = this.x_s - this.x_e
    } else if (this.x_e > this.x_s) {
      width = this.x_e - this.x_s
    }

    return width
  }

  get height() {
    let height = 0

    if (this.y_s > this.y_e) {
      height = this.y_s - this.y_e
    } else if (this.y_e > this.y_s) {
      height = this.y_e - this.y_s
    }

    return height
  }

  get data_for_render() {
    return {
      start: [this.x_s, this.y_s],
      up: [this.x_s, this.y_s < this.y_e ? this.y_s + this.height : this.y_s - this.height],
      right: [this.x_s < this.x_e ? this.x_s + this.width : this.x_s - this.width, this.y_e],
      bottom: [this.x_e, this.y_s],
      left: [this.x_s, this.y_s],
    }
  }
}