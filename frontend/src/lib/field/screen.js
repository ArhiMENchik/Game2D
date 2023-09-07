import {Element} from "@/lib/units/element";

export class Screen {
  constructor(x_start, y_start, width, height) {
    this.x_start = x_start
    this.y_start = y_start

    this.width = width
    this.height = height

    this.set_element_offset()
  }

  set_element_offset() {
    Element.set_offset(this.x_start, this.y_start)
  }

  get x_end() {
    return this.x_start + this.width
  }

  get y_end() {
    return this.y_start + this.height
  }

  increase_x(value = 5) {
    this.x_start += value
    this.set_element_offset()
  }

  decrease_x(value = 5) {
    this.x_start -= value
    this.set_element_offset()
  }

  increase_y(value = 5) {
    this.y_start += value
    this.set_element_offset()
  }

  decrease_y(value = 5) {
    this.y_start -= value
    this.set_element_offset()
  }

  pos_in_field(x, y) {
    return {x: x + this.x_start, y: y + this.y_start}
  }

  pos_in_screen(x, y) {
    return {x: x - this.x_start, y: y - this.y_start}
  }

  in_screen(x, y) {
    return ((this.x_start <= x && this.x_start + this.width >= x) &&
      (this.y_start <= y && this.y_start + this.height >= y))
  }

  get data_for_render() {
    return [this.x_start, this.y_start, this.width, this.height]
  }
}