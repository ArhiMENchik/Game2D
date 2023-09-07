import {Canvas} from "@/lib/canvas";
import {Element} from "@/lib/units/element";

export class Minimap {
  constructor(canvas, g_f_width, g_f_height, screen, select_group) {
    this.canvas = new Canvas(canvas)

    this.scale_x = g_f_width / canvas.width
    this.scale_y = g_f_height / canvas.height

    this.screen = screen
    this.select_group = select_group

    this.is_move = false

    this.canvas.mousedown(this.move_screen_on.bind(this))
    this.canvas.mousemove(this.move_screen.bind(this))
    this.canvas.mouseup(this.move_screen_off.bind(this))
    this.canvas.mouseleave(this.move_screen_off.bind(this))
    this.canvas.contextmenu(this.move_unit.bind(this))
  }

  move_screen_on(event) {
    if (event.button !== 0) return

    this.is_move = true
    this.move_screen(event)
  }

  move_screen(event) {
    if (event.button !== 0) return
    if (!this.is_move) return

    let rect = this.canvas.canvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    this.screen.x_start = (x * this.scale_x) - this.screen.width / 2
    this.screen.y_start = (y * this.scale_y) - this.screen.height / 2

    this.screen.set_element_offset()
  }

  move_screen_off(event) {
    if (event.button !== 0) return
    this.is_move = false
  }

  move_unit(event) {
    let rect = this.canvas.canvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    x = x * this.scale_x
    y = y * this.scale_y

    for (let u_id of this.select_group.units_id) {
      let u = Element.get_element(u_id)
      if (!u) {
        this.select_group.units_id.delete(u_id)
        continue
      }
      u.set_new_pos(x, y)
    }
  }

  screen_logic() {
    let [_x_start, _y_start, _width, _height] = this.screen.data_for_render

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