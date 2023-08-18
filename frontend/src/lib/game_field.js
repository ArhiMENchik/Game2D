import src from '@/assets/image/game/game_full_sprites.png'
import {Sprite} from "@/lib/sprite"
import {Unit} from "@/lib/element"
import Common from "@/lib/common"
import {SelectGroup, SelectionArea} from "@/lib/auxiliary"
import {ControlGroups} from "@/lib/control_group";

export class GameField2D {
  constructor(canvas) {
    this.field = canvas
    this.ctx = this.field.getContext("2d")
    this.sprites = new Sprite(src) // x: 63 y: 93
    this.selection_area = new SelectionArea()

    this.add_event_listener()

    this.units = []
    this.tiles = []
    this.dummies = []

    this.select_group = new SelectGroup()
    this.control_groups = new ControlGroups()
    this.ctrl_press = false
  }

  add_event_listener() {
    this.field.addEventListener('contextmenu', (event) => {
      let rect = this.field.getBoundingClientRect()
      let x = event.clientX - rect.left
      let y = event.clientY - rect.top

      this.move_logic(x, y)
    })

    this.field.addEventListener('mousedown', (event) => {
      if (event.button === 0) {
        let rect = this.field.getBoundingClientRect()
        let x = event.clientX - rect.left
        let y = event.clientY - rect.top

        this.selection_area.set_start_pos(x, y)
        this.selection_area.set_end_pos(x, y)
      }
    })

    this.field.addEventListener('mousemove', (event) => {
      if (event.button === 0 && !this.selection_area.is_clear) {
        let rect = this.field.getBoundingClientRect()
        let x = event.clientX - rect.left
        let y = event.clientY - rect.top

        this.selection_area.set_end_pos(x, y)
      }
    })

    this.field.addEventListener('mouseup', (event) => {
      if (event.button === 0) {
        let rect = this.field.getBoundingClientRect()
        let x = event.clientX - rect.left
        let y = event.clientY - rect.top

        this.click_logic(x, y, event.shiftKey)

        if (!this.selection_area.is_clear) {
          this.selection_area.reset_pos()
        }
      }
    })

    this.field.addEventListener('mouseleave', (event) => {
      this.selection_area.reset_pos()
    })

    document.addEventListener('keyup', (event) => {
    })

    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey || event.altKey) {
        event.preventDefault()
      }

      this.control_groups_logic(event)
    })
  }

  move_logic(x, y) {
    for (let u of this.select_group.units) {
      u.set_new_pos(x, y)
    }
  }

  click_logic(x, y, shift_key) {
    for (let u of this.units) {
      if (u.click_detection(x, y)) {
        if (!u.is_picked) {
          this.select_group.add(u)
        }
        break
      }
    }
  }

  control_groups_logic(event) {
    if (event.keyCode >= 49 && event.keyCode <= 57) {
      if (event.ctrlKey) {
        this.control_groups.add(event.keyCode, this.select_group.units)
      } else {
        let control_group = this.control_groups.get_group(event.keyCode)
        if (control_group) {
          this.select_group.units = control_group.units
        }
      }
    }
  }

  init() {
    this.create_start_units()

    this.main()
  }

  create_start_units() {
    for (let i = 1; i < 15; i++) {
      let x_s = 5 * 32
      let y_s = 76 * 32

      let x_f = Math.floor(Math.random() * (i * 32 - i * 16 + 1)) + i * 16
      let y_f = Math.floor(Math.random() * (i * 32 - i * 16 + 1)) + i * 16

      let unit = new Unit(this.sprites, x_s, y_s, x_f, y_f)

      this.units.push(unit)
    }
  }

  main() {
    this.ctx.clearRect(0, 0, this.field.width, this.field.height)

    this.draw_selection_area()

    this.unit_logic()

    this.render()

    setTimeout(this.main.bind(this), 1000 / 60)
  }

  draw_selection_area() {
    let data = this.selection_area.data_for_render
    this.ctx.strokeStyle = this.selection_area.color
    this.ctx.beginPath()
    this.ctx.moveTo(...data.start)
    this.ctx.lineTo(...data.up)
    this.ctx.lineTo(...data.right)
    this.ctx.lineTo(...data.bottom)
    this.ctx.lineTo(...data.left)
    this.ctx.stroke()
  }

  unit_logic() {
    for (let u of this.units) {
      this.check_collision(u)

      this.check_in_area(u)

      if (u.is_picked) {
        this.draw_glow(u)
      }

      this.draw_path(u)
    }
  }

  check_collision(u) {
    for (let e of [...this.tiles, ...this.dummies]) {
      // todo update block logic
      let potential_pos = u.potential_move()
      let collision = Common.check_collision(potential_pos.x_p - 16, potential_pos.y_p - 16, e.x_f, e.y_f)
      if (collision && e.type === Element.element_type.tile && e.is_block) {
        u.prevent_act()
      }
    }
  }

  check_in_area(u) {
    let a_x = this.selection_area.highest_x
    let a_y = this.selection_area.highest_y
    let width = this.selection_area.width
    let height = this.selection_area.height

    if (u.in_area_rect(a_x, a_y, width, height)) {
      this.select_group.add(u)
    } else if (!this.selection_area.is_clear) {
      this.select_group.remove(u)
    }
  }

  draw_glow(u) {
    let glowSize = 1;
    let gradient = this.ctx.createLinearGradient(u.x_f - glowSize, u.y_f - glowSize, u.x_f + u.size_x + glowSize, u.y_f + u.size_y + glowSize);
    gradient.addColorStop(0, 'rgba(119,255,0,0.4)');
    gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(u.x_f - glowSize, u.y_f - glowSize, u.size_x + glowSize * 2, u.size_y + glowSize * 2);
  }

  draw_path(u) {
    this.ctx.strokeStyle = 'rgb(0, 255, 0)'
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.moveTo(u.x_c, u.y_c)
    this.ctx.lineTo(u.x_m_c, u.y_m_c)
    this.ctx.stroke()
  }

  render() {
    for (let e of [...this.units, ...this.tiles, ...this.dummies]) {
      this.ctx.drawImage(...e.data_for_render)
    }
  }
}