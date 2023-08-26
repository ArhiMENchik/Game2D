import {Element} from "@/lib/units/element";
import Common from "@/lib/common";

export class Missile extends Element {
  static animation = {
    none: 0,
    spin: 1,
  }

  constructor(owner_id, target_id, model, x_field, y_field, size = 1, speed = 4, animation = Missile.animation.none) {
    super(model, x_field, y_field, Element.element_type.missile, size, speed)
    this.owner_id = owner_id
    this.target_id = target_id

    this.last_pos_x = null
    this.last_pos_y = null

    this.animation = animation
    this.angle = 0
  }

  _action() {
    let owner = Element.elements_by_id[this.owner_id]
    let target = Element.elements_by_id[this.target_id]

    if (!owner) {
      this.destroy()
    }

    let x
    let y

    if (target) {
      x = target.x_field_central
      y = target.y_field_central

      this.last_pos_x = target.x_field_central
      this.last_pos_y = target.y_field_central

    } else {
      if (this.last_pos_x && this.last_pos_y) {
        x = this.last_pos_x
        y = this.last_pos_y
      } else {
        this.destroy()
      }
    }

    let distance = Common.calc_dist(this.x_field, this.y_field, x, y)

    if (distance < this.speed) {
      if (target) target.take_damage(owner.damage)
      this.destroy()
    }

    this.animate()

    this.x_action = x
    this.y_action = y

    super._action()
  }

  animate() {
    switch (this.animation) {
      case Missile.animation.none:
        break
      case Missile.animation.spin:
        this.angle + 36 > 360 ? this.angle = 36 : this.angle += 36
        break
    }
  }
}