export class Screen {
  constructor(x_start, y_start, width, height) {
    this.x_start = x_start
    this.y_start = y_start

    this.width = width
    this.height = height
  }

  get x_end() {
    return this.x_start + this.width
  }

  get y_end() {
    return this.y_start + this.height
  }

  increase_x(value = 5) {
    this.x_start += value
  }

  decrease_x(value = 5) {
    this.x_start -= value
  }

  increase_y(value = 5) {
    this.y_start += value
  }

  decrease_y(value = 5) {
    this.y_start -= value
  }

  pos_in_world(x, y) {
    return {x: x + this.x_start, y: y + this.y_start}
  }

  pos_in_screen(x, y) {
    return {x: x - this.x_start, y: y - this.y_start}
  }

  in_screen(x, y) {
    return ((this.x_start <= x && this.x_start + this.width >= x) &&
      (this.y_start <= y && this.y_start + this.height >= y))
  }
}