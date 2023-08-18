export default class Common {

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

  static check_collision(x1, y1, x2, y2) {
    let r1 = x1 + 32
    let b1 = y1 + 32

    let r2 = x2 + 32
    let b2 = y2 + 32

    return !(r1 <= x2 || x1 > r2 ||
      b1 <= y2 || y1 > b2)
  }
}