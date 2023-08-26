import {Element} from "@/lib/units/element";

export class Canvas {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext("2d")

    this.contextmenu_callback = () => {
    }
    this.mousedown_callback = () => {
    }
    this.mousemove_callback = () => {
    }
    this.mouseup_callback = () => {
    }
    this.mouseleave_callback = () => {
    }
    this.mouseenter_callback = () => {
    }
    this.wheel_callback = () => {
    }

    this.add_event_listeners()
  }

  add_event_listeners() {
    this.canvas.addEventListener('contextmenu', (event) => {
      this.contextmenu_callback(event)
    })
    this.canvas.addEventListener('mousedown', (event) => {
      this.mousedown_callback(event)
    })
    this.canvas.addEventListener('mousemove', (event) => {
      this.mousemove_callback(event)
    })
    this.canvas.addEventListener('mouseup', (event) => {
      this.mouseup_callback(event)
    })
    this.canvas.addEventListener('mouseleave', (event) => {
      this.mouseleave_callback(event)
    })
    this.canvas.addEventListener('mouseenter', (event) => {
      this.mouseenter_callback(event)
    })
    this.canvas.addEventListener('wheel', (event) => {
      this.wheel_callback(event)
    })
  }

  contextmenu(func) {
    this.contextmenu_callback = func
  }

  mousedown(func) {
    this.mousedown_callback = func
  }

  mousemove(func) {
    this.mousemove_callback = func
  }

  mouseup(func) {
    this.mouseup_callback = func
  }

  mouseleave(func) {
    this.mouseleave_callback = func
  }

  mouseenter(func) {
    this.mouseenter_callback = func
  }

  wheel(func) {
    this.wheel_callback = func
  }

  get width() {
    return this.canvas.width
  }

  get height() {
    return this.canvas.height
  }


  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  draw_line(x1, y1, x2, y2, color, line_width = 1) {
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = line_width
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()
  }

  draw_rect_with_lines(data) {
    this.ctx.strokeStyle = data.color
    this.ctx.beginPath()
    this.ctx.moveTo(...data.start)
    this.ctx.lineTo(...data.up)
    this.ctx.lineTo(...data.right)
    this.ctx.lineTo(...data.bottom)
    this.ctx.lineTo(...data.left)
    this.ctx.stroke()
  }

  draw_rect_glow(x, y, width, height, glow_size, color_1, color_2) {
    let gradient = this.ctx.createLinearGradient(x - glow_size, y - glow_size,
      x + width + glow_size, y + height + glow_size)
    gradient.addColorStop(0, color_1)
    gradient.addColorStop(1, color_2)

    this.ctx.fillStyle = gradient
    this.ctx.fillRect(x - glow_size, y - glow_size, width + glow_size * 2, height + glow_size * 2)
  }

  fill_text(text, x, y, font, color = 'rgb(255, 2555, 255)') {
    this.ctx.font = font
    this.ctx.fillStyle = color

    this.ctx.fillText(text, x, y)
  }

  render(data) {
    this.ctx.drawImage(...data)
  }

  render_with_angle(e) {
    this.ctx.save()

    this.ctx.translate(e.x_field_central - Element.offset_x, e.y_field_central - Element.offset_y)

    this.ctx.rotate(e.angle * Math.PI / 180)

    this.ctx.drawImage(...e.model.data, -e.width / 2, -e.height / 2, e.width, e.height)

    this.ctx.restore()
  }
}