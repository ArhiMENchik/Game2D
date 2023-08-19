export class FullField {
  constructor(c_width, c_height, n) {
    this.width = c_width * n
    this.height = c_height * n
    this.n = n
  }

  get central_rect_pos() {
    let x_c_full = this.width / 2
    let y_c_full = this.height / 2

    let width_small = this.width / this.n
    let height_small = this.height / this.n

    let x_s_small = x_c_full - (width_small / 2)
    let y_s_small = y_c_full - (height_small / 2)

    return [x_s_small, y_s_small, width_small, height_small]
  }
}