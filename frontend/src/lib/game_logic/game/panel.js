import {Canvas} from "@/lib/canvas";
import {Element} from "@/lib/game_logic/units/element";

export class Panel {
  constructor(canvas, select_group) {
    this.canvas = new Canvas(canvas)
    this._sprite_map = null

    this.select_group = select_group

    this.unit_info = {
      width: 200,
      height: 320
    }

    this.canvas.mouseup((event) => {
      if (event.button === 0) {
        let rect = this.canvas.canvas.getBoundingClientRect()
        let x = event.clientX - rect.left
        let y = event.clientY - rect.top

        this.click_logic(x, y)
      }
    })
  }

  click_logic(x, y) {
    for (let u_id of this.select_group.units_id) {
      let u = Element.get_element(u_id)
      if (!u) {
        this.select_group.units_id.delete(u_id)
        continue
      }

      if (u.on_panel_click_detection(x, y)) {
        this.select_group.select_unit_id = u.id
      }
    }
  }

  get sprite_map() {
    return this._sprite_map
  }

  set sprite_map(value) {
    this._sprite_map = value
  }

  draw_panel() {
    this.canvas.clear()

    let x_offset = 0
    let y_offset = 0

    this.canvas.draw_line(this.unit_info.width, 0, this.unit_info.width, this.unit_info.height, 'rgb(0, 255, 0)')
    this.canvas.draw_line(0, 100, this.unit_info.width, 100, 'rgb(0, 255, 0)')

    for (let u_id of this.select_group.units_id) {
      let u = Element.get_element(u_id)
      if (!u) {
        this.select_group.units_id.delete(u_id)
        continue
      }

      if (x_offset > Math.floor((this.canvas.width - this.unit_info.width + 5) / 64)) {
        x_offset = 0
        y_offset++
      }

      let x = x_offset++ * 64 + this.unit_info.width + 5
      let y = y_offset * 64

      if (u.id === this.select_group.select_unit_id) {
        let x_select = 0
        let y_select = 0
        let size_x = u.width * 3 <= 96 ? u.width * 3 : 96
        let size_y = u.height * 3 <= 128 ? u.height * 3 : 128
        let data = [...u.model.data, x_select, y_select, size_x, size_y]

        this.canvas.render(data)

        this.canvas.fill_text(`${u.hp}|${u.max_hp}`, 100, 20, '15px Arial', 'rgb(0, 255, 0)')
        this.canvas.fill_text(`${u.mp}|${u.max_mp}`, 100, 40, '15px Arial', 'rgb(0, 0, 255)')



        this.canvas.draw_rect_glow(x, y, u.width, u.height, 1, 'orange', 'orange')
      }

      u.x_panel = x
      u.y_panel = y

      let data = [...u.model.data, x, y, u.width, u.height]

      this.canvas.draw_line(x, y + u.height + 5, x + u.width, y + u.height + 5, 'rgba(255, 255, 255, .9)', 5)
      this.canvas.draw_line(x, y + u.height + 5, x + u.width * u.hp_percent, y + u.height + 5, u.hp_color, 5)

      this.canvas.draw_line(x, y + u.height + 11, x + u.width, y + u.height + 11, 'rgba(255, 255, 255, .9)', 5)
      this.canvas.draw_line(x, y + u.height + 11, x + u.width * u.mp_percent, y + u.height + 11, 'rgb(0, 0, 255)', 5)

      this.canvas.render(data)
    }
  }
}