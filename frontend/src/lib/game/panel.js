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

    for (let u of this.select_group.units) {

      if (x_offset > (this.canvas.width - this.unit_info.width) / 64 ) {
        x_offset = 0
        y_offset++
      }

      let x = x_offset++ * 64 + this.unit_info.width
      let y = y_offset * 64

      let data = [u.sprite.img, u.x_sprite, u.y_sprite, u.width, u.height, x, y, u.width, u.height]

      this.canvas.draw_line(x, y + u.height + 5, x + u.width, y + u.height + 5, u.hp_color, 5)
      this.canvas.draw_line(x, y + u.height + 11, x + u.width, y + u.height + 11, 'rgb(0, 0, 255)', 5)
      this.canvas.render(data)
    }
  }
}