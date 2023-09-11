export class Cell {
  constructor(x_start, y_start, size = 10, color = 'rgb(0, 0, 0)') {
    this.x_start = x_start
    this.y_start = y_start

    this.size = size

    this.color = color
  }
}