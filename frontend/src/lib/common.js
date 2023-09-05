export default class Common {

  static command = {
    stop: 1,
    move: 2,
    attack: 3,
    move_attack: 4,
    cast: 5,
  }

  static orientation = {
    vertical: 1,
    horizontal: 2
  }

  static get_random_int(min, max) {
    min = Math.floor(min)
    max = Math.ceil(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  static calc_dist(x1, y1, x2, y2) {
    let deltaX = x2 - x1
    let deltaY = y2 - y1

    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  }

  static calc_new_pos(x1, y1, x2, y2, dist) {
    let angle = Math.atan2(y2 - y1, x2 - x1)

    let new_x = dist * Math.cos(angle)
    let new_y = dist * Math.sin(angle)

    return {new_x, new_y}
  }

  static check_collision(x1, y1, x2, y2, width_1, height_1, width_2, height_2) {
    let r1 = x1 + width_1
    let b1 = y1 + height_1

    let r2 = x2 + width_2
    let b2 = y2 + height_2

    return !(r1 <= x2 || x1 > r2 ||
      b1 <= y2 || y1 > b2)
  }

  static delete_element_from_array(array, elem) {
    let indexToDelete = array.findIndex(f_e => f_e === elem)

    if (indexToDelete !== -1) {
      array.splice(indexToDelete, 1)
    }
  }

  static generate_color() {
    let letters = '0123456789abcdef'
    let color = '#'

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }

    return color
  }
}

Array.prototype.delete = function (elem) {
  let indexToDelete = this.findIndex(f_e => f_e === elem)
  if (indexToDelete !== -1) {
    this.splice(indexToDelete, 1)
  }
}

Array.prototype.clone = function () {
  return this.slice(0)
}