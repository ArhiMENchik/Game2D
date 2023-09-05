import {Element} from "@/lib/units/element";
import {Screen} from "@/lib/field/screen";
import {Sprite} from "@/lib/models/sprite";
import src from "@/assets/image/game/game_full_sprites.png";
import {Unit} from "@/lib/units/unit";
import {FullField} from "@/lib/field/full_field";
import {Canvas} from "@/lib/canvas";
import {SelectionArea} from "@/lib/selection_area";
import {SelectGroup} from "@/lib/units/select_group";
import {ControlGroups} from "@/lib/units/control_group";
import Common from "@/lib/common";
import {Minimap} from "@/lib/game/minimap";
import {Panel} from "@/lib/game/panel";
import {Player} from "@/lib/player";
import {Missile} from "@/lib/units/missile";
import {Model} from "@/lib/models/model";

export class Game {
  constructor(game_field, minimap, game_panel, player) {
    this.game_field = new Canvas(game_field)

    this.selection_area = new SelectionArea()
    this.select_group = new SelectGroup(player.id)
    this.control_groups = new ControlGroups()

    this.full_field = new FullField(game_field.width, game_field.height, 5)
    this.screen = new Screen(...this.full_field.central_rect_pos)

    this.minimap = new Minimap(minimap, this.full_field.width, this.full_field.height, this.screen, this.select_group)
    this.game_panel = new Panel(game_panel, this.select_group)

    this.players = [player]

    this.main_player = player

    this.sprites = new Sprite(src)
    this.sprites.on_ready(this.init.bind(this))
  }

  init() {
    this.create_player()

    this.create_start_units()

    this.main()

    this.game_field.contextmenu((event) => {
      let rect = this.game_field.canvas.getBoundingClientRect()
      let x = event.clientX - rect.left
      let y = event.clientY - rect.top

      this.action_logic(x, y)
    })

    this.game_field.mousedown((event) => {
      if (event.button === 0) {
        let rect = this.game_field.canvas.getBoundingClientRect()
        let x = event.clientX - rect.left
        let y = event.clientY - rect.top

        this.selection_area.set_start_pos(x, y)
        this.selection_area.set_end_pos(x, y)
      }
    })

    this.game_field.mousemove((event) => {
      if (event.button === 0 && this.selection_area.is_start) {
        let rect = this.game_field.canvas.getBoundingClientRect()
        let x = event.clientX - rect.left
        let y = event.clientY - rect.top

        this.selection_area.set_end_pos(x, y)
      }
    })

    this.game_field.mouseup((event) => {
      if (event.button === 0) {
        let rect = this.game_field.canvas.getBoundingClientRect()
        let x = event.clientX - rect.left
        let y = event.clientY - rect.top

        this.click_logic(x, y, event.shiftKey)

        this.selection_area.reset_pos()
      }
    })

    this.game_field.mouseleave(() => {
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

  create_player(count = 2) {
    for (let i = 1; i <= count; i++) {
      this.players.push(new Player())
    }
  }

  create_start_units() {
    for (let i = 1; i < 15; i++) {
      let x_sprite = 5 * 32
      let y_sprite = 76 * 32

      let x_screen = Math.floor(Math.random() * (i * 32 - i * 16 + 1)) + i * 16
      let y_screen = Math.floor(Math.random() * (i * 32 - i * 16 + 1)) + i * 16

      let pos_field = this.screen.pos_in_world(x_screen, y_screen)

      let unit_model = new Model(this.sprites, x_sprite, y_sprite)
      let missile_model = new Model(this.sprites, 45 * 32, 25 * 32)

      let unit = new Unit(Common.get_random_int(1, Player.player_count), unit_model, pos_field.x, pos_field.y)
        .kwargs({missile_model: missile_model})
    }
  }

  main() {
    this.game_field.clear()

    this.game_field.draw_rect_with_lines(this.selection_area.data_for_render)

    this.minimap.screen_logic()


    for (let e_id of Element.elements_id) {
      let e = Element.elements_by_id[e_id]
      if (!e) {
        Element.elements_id.delete(e_id)
        return
      }

      if (e.type === Element.element_type.unit) {
        let u = e
        this.unit_logic(u)
        this.minimap.unit_draw(u)
      }

      e._action()
    }

    this.render()

    setTimeout(this.main.bind(this), 1000 / 60)
  }

  action_logic(x, y) {
    let pos_field = this.screen.pos_in_world(x, y)

    let target = null

    for (let e_id of Element.elements_id) {
      let e = Element.elements_by_id[e_id]
      if (!e) {
        Element.elements_id.delete(e_id)
        return
      }

      if (e.type === Element.element_type.unit) {
        let u = e

        if (u.click_detection(pos_field.x, pos_field.y) && u.is_enemy_for_player(this.main_player.id)) {
          target = u
          break
        }
      }
    }

    for (let u_id of this.select_group.units_id) {
      let u = Element.elements_by_id[u_id]
      if (!u) {
        this.select_group.units_id.delete(u_id)
        return
      }

      target ? u.target = target : u.set_new_pos(pos_field.x, pos_field.y)
    }
  }

  click_logic(x, y, shift_key) {
    for (let e_id of Element.elements_id) {
      let e = Element.elements_by_id[e_id]
      if (!e) {
        Element.elements_id.delete(e_id)
        return
      }

      if (e.type === Element.element_type.unit) {
        let u = e

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
  }

  control_groups_logic(event) {
    if (event.keyCode >= 49 && event.keyCode <= 57) {
      if (event.ctrlKey) {
        this.control_groups.add(event.keyCode, this.select_group.units_id.clone())
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
      let dist = event.shiftKey ? 15 : 5
      if (event.key === 'ArrowUp') {
        this.screen.decrease_y(dist)
      } else if (event.key === 'ArrowLeft') {
        this.screen.decrease_x(dist)
      } else if (event.key === 'ArrowRight') {
        this.screen.increase_x(dist)
      } else if (event.key === 'ArrowDown') {
        this.screen.increase_y(dist)
      }
    }
  }

  unit_logic(u) {
    this.check_collision(u)

    this.check_in_area(u)

    if (u.is_picked && this.screen.in_screen(u.x_field_central, u.y_field_central)) {
      this.game_field.draw_rect_glow(u.x_screen, u.y_screen, u.width, u.height,
        1, 'rgba(119, 255, 0, 0.4)', 'rgba(255, 255, 0, 0)')
    }

    if (u.x_field !== u.x_action && u.y_field !== u.y_action) {
      this.game_field.draw_line(u.x_screen_central, u.y_screen_central, u.x_screen_action_central, u.y_screen_action_central, 'rgb(119, 255, 0)')
    }
  }

  check_collision(u) {
    for (let e_id of Element.elements_id) {
      // todo update block logic
      let e = Element.elements_by_id[e_id]
      if (!e) {
        Element.elements_id.delete(e_id)
        return
      }

      if (e.type === Element.element_type.dummy || e.type === Element.element_type.tile) {
        let potential_pos = u.potential_action()
        let pos_field = this.screen.pos_in_world(potential_pos.x_p, potential_pos.y_p)
        let collision = Common.check_collision(pos_field.x - 16, pos_field.y - 16, e.x_field, e.y_field,
          u.width, u.height, e.width, e.height)
        if (collision) {
          u.prevent_act()
        }
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
    for (let e_id of Element.elements_id) {
      let e = Element.elements_by_id[e_id]
      if (!e) {
        Element.elements_id.delete(e_id)
        return
      }

      if (this.screen.in_screen(e.x_field_central, e.y_field_central)) {
        if (e.type === Element.element_type.missile) {
          switch (e.animation) {
            case Missile.animation.none:
              this.game_field.render(e.data_for_render)
              break
            case Missile.animation.spin:
              this.game_field.render_with_angle(e)
              break
          }

        } else {
          this.game_field.render(e.data_for_render)
        }
        if (e.type === Element.element_type.unit) {

          let offset = e.hp < e.max_hp ? 15 : 5

          if (e.hp < e.max_hp) {
            let x = e.x_screen
            let y = e.y_screen - e.height - 10

            this.game_field.draw_line(x, y + e.height + 5, x + e.width, y + e.height + 5, 'rgba(255, 255, 255, .9)', 3)
            this.game_field.draw_line(x, y + e.height + 5, x + e.width * e.hp_percent, y + e.height + 5, e.color, 3)
          }

          this.game_field.fill_text(e.player_name, e.x_screen, e.y_screen - offset, '10px Arial')
        }
      }
    }

    this.game_panel.draw_panel()
  }
}