import {Element} from "@/lib/units/element";
import {Screen} from "@/lib/field/screen";
import {Sprite} from "@/lib/sprite";
import src from "@/assets/image/game/game_full_sprites.png";
import {Unit} from "@/lib/units/element";
import {FullField} from "@/lib/field/full_field";
import {Canvas} from "@/lib/field/canvas";
import {SelectionArea} from "@/lib/selection_area";
import {SelectGroup} from "@/lib/units/select_group";
import {ControlGroups} from "@/lib/units/control_group";
import Common from "@/lib/common";

export class Game {
  constructor(canvas) {
    this.canvas = new Canvas(canvas)

    this.full_field = new FullField(canvas.width, canvas.height, 5)
    this.screen = new Screen(...this.full_field.central_rect_pos)

    Element.offset_x = this.screen.x_start
    Element.offset_y = this.screen.y_start

    this.selection_area = new SelectionArea()
    this.select_group = new SelectGroup()
    this.control_groups = new ControlGroups()

    this.units = []
    this.tiles = []
    this.dummies = []

    this.sprites = new Sprite(src)
    this.sprites.on_ready(this.init.bind(this))
  }

  init() {
    this.create_start_units()

    this.main()

    this.canvas.canvas.addEventListener('contextmenu', (event) => {
      let rect = this.canvas.canvas.getBoundingClientRect()
      let x = event.clientX - rect.left
      let y = event.clientY - rect.top

      this.move_logic(x, y)
    })

    this.canvas.canvas.addEventListener('mousedown', (event) => {
      if (event.button === 0) {
        let rect = this.canvas.canvas.getBoundingClientRect()
        let x = event.clientX - rect.left
        let y = event.clientY - rect.top

        this.selection_area.set_start_pos(x, y)
        this.selection_area.set_end_pos(x, y)
      }
    })

    this.canvas.canvas.addEventListener('mousemove', (event) => {
      if (event.button === 0 && this.selection_area.is_start) {
        let rect = this.canvas.canvas.getBoundingClientRect()
        let x = event.clientX - rect.left
        let y = event.clientY - rect.top

        this.selection_area.set_end_pos(x, y)
      }
    })

    this.canvas.canvas.addEventListener('mouseup', (event) => {
      if (event.button === 0) {
        let rect = this.canvas.canvas.getBoundingClientRect()
        let x = event.clientX - rect.left
        let y = event.clientY - rect.top

        this.click_logic(x, y, event.shiftKey)

        this.selection_area.reset_pos()
      }
    })

    this.canvas.canvas.addEventListener('mouseleave', () => {
      this.selection_area.reset_pos()
    })

    document.addEventListener('keyup', () => {
    })

    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey || event.altKey) {
        event.preventDefault()
      }

      this.control_groups_logic(event)
      this.screen_move_logic(event)
    })
  }

  create_start_units() {
    for (let i = 1; i < 2; i++) {
      let x_sprite = 5 * 32
      let y_sprite = 76 * 32

      let x_screen = Math.floor(Math.random() * (i * 32 - i * 16 + 1)) + i * 16
      let y_screen = Math.floor(Math.random() * (i * 32 - i * 16 + 1)) + i * 16

      let pos_field = this.screen.pos_in_world(x_screen, y_screen)

      let unit = new Unit(this.sprites, x_sprite, y_sprite, pos_field.x, pos_field.y)

      this.units.push(unit)
    }
  }

  main() {
    this.canvas.clear()

    this.canvas.draw_rect_with_lines(this.selection_area.data_for_render)

    this.unit_logic([...this.units])

    this.render()

    setTimeout(this.main.bind(this), 1000 / 60)
  }

  move_logic(x, y) {
    for (let u of this.select_group.units) {
      let pos_field = this.screen.pos_in_world(x, y)
      u.set_new_pos(pos_field.x, pos_field.y)
    }
  }

  click_logic(x, y, shift_key) {
    for (let u of this.units) {
      let pos_field = this.screen.pos_in_world(x, y)
      if (u.click_detection(pos_field.x, pos_field.y)) {
        if (shift_key) {
          if (u.is_picked) {
            this.select_group.remove(u)
          } else {
            this.select_group.add(u)
          }
        } else {
          this.select_group.units = [u]
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

  screen_move_logic(event) {
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      if (event.key === 'ArrowUp') {
        this.screen.decrease_y()
      } else if (event.key === 'ArrowLeft') {
        this.screen.decrease_x()
      } else if (event.key === 'ArrowRight') {
        this.screen.increase_x()
      } else if (event.key === 'ArrowDown') {
        this.screen.increase_y()
      }

      Element.offset_x = this.screen.x_start
      Element.offset_y = this.screen.y_start
    }
  }

  unit_logic(units) {
    for (let u of units) {
      this.check_collision(u)

      this.check_in_area(u)

      if (u.is_picked && this.screen.in_screen(u.x_field_central, u.y_field_central)) {
        this.canvas.draw_rect_glow(u.x_screen, u.y_screen, u.width, u.height,
          1, 'rgba(119, 255, 0, 0.4)', 'rgba(255, 255, 0, 0)')
      }

      if (u.x_field !== u.x_move && u.y_field !== u.y_move) {
        this.canvas.draw_line(u.x_screen_central, u.y_screen_central, u.x_screen_move_central, u.y_screen_move_central, 'rgb(119, 255, 0)')
      }

      u._move()
    }
  }

  check_collision(u) {
    for (let e of [...this.tiles, ...this.dummies]) {
      // todo update block logic
      let potential_pos = u.potential_move()
      let pos_field = this.screen.pos_in_world(potential_pos.x_p, potential_pos.y_p)
      let collision = Common.check_collision(pos_field.x - 16, pos_field.y - 16, e.x_field, e.y_field)
      if (collision && e.type === Element.element_type.tile && e.is_block) {
        u.prevent_act()
      }
    }
  }

  check_in_area(u) {
    if (this.selection_area.in_selection_area(u.x_screen_central, u.y_screen_central)) {
      this.select_group.add(u)
    } else if (!this.selection_area.is_clear) {
      this.select_group.remove(u)
    }
  }

  render() {
    for (let e of [...this.units, ...this.dummies, ...this.tiles]) {
      if (this.screen.in_screen(e.x_field_central, e.y_field_central))
        this.canvas.render(e)
    }
  }
}