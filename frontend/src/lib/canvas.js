export class Canvas {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext("2d")
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

  fill_text(text, x, y, font, color) {
    this.ctx.font = font
    this.ctx.fillStyle = color

    this.ctx.fillText(text, x, y)
  }

  render(data) {
    this.ctx.drawImage(...data)
  }
}