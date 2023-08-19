import {Canvas} from "@/lib/canvas";

export class Minimap {
  constructor(canvas, g_f_width, g_f_height) {
    this.canvas = new Canvas(canvas)

    this.scale_x = g_f_width / canvas.width
    this.scale_y = g_f_height / canvas.height
  }

  screen_logic(_x_start, _y_start, _width, _height) {
    let x_start = _x_start / this.scale_x
    let y_start = _y_start / this.scale_y

    let x_end = (_x_start + _width) / this.scale_x
    let y_end = (_y_start + _height) / this.scale_y

    let width = _width / this.scale_x
    let height = _height / this.scale_y

    this.canvas.clear()

    this.canvas.draw_rect_with_lines({
      color: 'rgb(0, 255, 0)',
      start: [x_start, y_start],
      up: [x_start, y_start < y_end ? y_start + height : y_start - height],
      right: [x_start < x_end ? x_start + width : x_start - width, y_end],
      bottom: [x_end, y_start],
      left: [x_start, y_start]
    })
  }

  unit_draw(u) {
    let x = u.x_field / this.scale_x
    let y = u.y_field / this.scale_y

    let width = u.width / this.scale_x
    let height = u.height / this.scale_y

    this.canvas.ctx.fillStyle = 'rgb(0, 255, 0)'
    this.canvas.ctx.fillRect(x, y, width, height)
  }
}