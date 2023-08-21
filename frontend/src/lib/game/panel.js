import {Canvas} from "@/lib/canvas";

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

    this.canvas.draw_rect_with_lines(
      {
        color: 'rgb(0, 255, 0)',
        start: [this.x_start, this.y_start],
        up: [this.x_start, this.y_start < this.y_end ? this.y_start + this.height : this.y_start - this.height],
        right: [this.x_start < this.x_end ? this.x_start + this.width : this.x_start - this.width, this.y_end],
        bottom: [this.x_end, this.y_start],
        left: [this.x_start, this.y_start]
      }
    )

    this.canvas.draw_line(this.unit_info.width, 0, this.unit_info.width, this.unit_info.height, 'rgb(0, 255, 0)')
    this.canvas.draw_line(0, 100, this.unit_info.width, 100, 'rgb(0, 255, 0)')

    for (let u of this.select_group.units) {
      if (x_offset > Math.floor((this.canvas.width - this.unit_info.width + 5) / 64)) {
        x_offset = 0
        y_offset++
      }

      let x = x_offset++ * 64 + this.unit_info.width + 5
      let y = y_offset * 64

      if (u.is_select) {
        let x = 50
        let y = 0
        let data = [u.sprite.img, u.x_sprite, u.y_sprite, 32, 32, x, y, 96, 96]

        this.canvas.render(data)

        this.canvas.fill_text(`${u.hp}|${u.max_hp}`, 150, 20, '15px Arial', 'rgb(0, 255, 0)')
        this.canvas.fill_text(`${u.mp}|${u.max_mp}`, 150, 40, '15px Arial', 'rgb(0, 0, 255)')
      }

      let data = [u.sprite.img, u.x_sprite, u.y_sprite, u.width, u.height, x, y, u.width, u.height]

      this.canvas.draw_line(x, y + u.height + 5, x + u.width, y + u.height + 5, 'rgba(255, 255, 255, .9)', 5)
      this.canvas.draw_line(x, y + u.height + 5, x + u.width * u.hp_percent, y + u.height + 5, u.hp_color, 5)

      this.canvas.draw_line(x, y + u.height + 11, x + u.width, y + u.height + 11, 'rgba(255, 255, 255, .9)', 5)
      this.canvas.draw_line(x, y + u.height + 11, x + u.width * u.mp_percent, y + u.height + 11, 'rgb(0, 0, 255)', 5)

      this.canvas.render(data)
    }
  }
}