export class SelectionArea {
  constructor(color = 'rgb(0, 255, 0)') {
    this.x_start = 0
    this.y_start = 0

    this.x_end = 0
    this.y_end = 0

    this.is_start = false

    this.color = color
  }

  get is_clear() {
    return (this.width === 0 && this.height === 0)
  }

  reset_pos() {
    this.x_start = 0
    this.y_start = 0

    this.x_end = 0
    this.y_end = 0

    this.is_start = false
  }

  set_start_pos(x, y) {
    this.x_start = x
    this.y_start = y

    this.is_start = true
  }

  set_end_pos(x, y) {
    this.x_end = x
    this.y_end = y
  }

  get highest_x() {
    return Math.min(this.x_start, this.x_end)
  }

  get highest_y() {
    return Math.min(this.y_start, this.y_end)
  }

  get width() {
    let width = 0

    if (this.x_start > this.x_end) {
      width = this.x_start - this.x_end
    } else if (this.x_end > this.x_start) {
      width = this.x_end - this.x_start
    }

    return width
  }

  get height() {
    let height = 0

    if (this.y_start > this.y_end) {
      height = this.y_start - this.y_end
    } else if (this.y_end > this.y_start) {
      height = this.y_end - this.y_start
    }

    return height
  }

  in_selection_area(x, y) {
    return ((this.highest_x <= x && this.highest_x + this.width >= x) &&
      (this.highest_y <= y && this.highest_y + this.height >= y))
  }

  get data_for_render() {
    return {
      color: this.color,
      start: [this.x_start, this.y_start],
      up: [this.x_start, this.y_start < this.y_end ? this.y_start + this.height : this.y_start - this.height],
      right: [this.x_start < this.x_end ? this.x_start + this.width : this.x_start - this.width, this.y_end],
      bottom: [this.x_end, this.y_start],
      left: [this.x_start, this.y_start]
    }
  }
}