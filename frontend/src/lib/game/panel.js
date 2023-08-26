import {Canvas} from "@/lib/canvas";
import {Element} from "@/lib/units/element";

export class Panel {
  constructor(canvas, select_group) {
    this.canvas = new Canvas(canvas)

    this.select_group = select_group
    this.select_group.on_change(this.select_group_logic.bind(this))

    this.unit_info = {
      width: 200,
      height: 320
    }
  }

  select_group_logic() {

  }

  draw_panel() {
    this.canvas.clear()

    let x_offset = 0
    let y_offset = 0

    this.canvas.draw_line(this.unit_info.width, 0, this.unit_info.width, this.unit_info.height, 'rgb(0, 255, 0)')
    this.canvas.draw_line(0, 100, this.unit_info.width, 100, 'rgb(0, 255, 0)')

    for (let u_id of this.select_group.units_id) {
      let u = Element.elements_by_id[u_id]
      if (!u) {
        this.select_group.units_id.delete(u_id)
        return
      }

      if (x_offset > Math.floor((this.canvas.width - this.unit_info.width + 5) / 64)) {
        x_offset = 0
        y_offset++
      }

      let x = x_offset++ * 64 + this.unit_info.width + 5
      let y = y_offset * 64

      if (u.is_select) {
        let x = 50
        let y = 0
        let size_x = u.width * 3 <= 96 ? u.width * 3 : 96
        let size_y = u.height * 3 <= 128 ? u.height * 3 : 128
        let data = [...u.model.data, x, y, size_x, size_y]

        this.canvas.render(data)

        this.canvas.fill_text(`${u.hp}|${u.max_hp}`, 150, 20, '15px Arial', 'rgb(0, 255, 0)')
        this.canvas.fill_text(`${u.mp}|${u.max_mp}`, 150, 40, '15px Arial', 'rgb(0, 0, 255)')
      }

      let data = [...u.model.data, x, y, u.width, u.height]

      this.canvas.draw_line(x, y + u.height + 5, x + u.width, y + u.height + 5, 'rgba(255, 255, 255, .9)', 5)
      this.canvas.draw_line(x, y + u.height + 5, x + u.width * u.hp_percent, y + u.height + 5, u.hp_color, 5)

      this.canvas.draw_line(x, y + u.height + 11, x + u.width, y + u.height + 11, 'rgba(255, 255, 255, .9)', 5)
      this.canvas.draw_line(x, y + u.height + 11, x + u.width * u.mp_percent, y + u.height + 11, 'rgb(0, 0, 255)', 5)

      this.canvas.render(data)
    }
  }
}