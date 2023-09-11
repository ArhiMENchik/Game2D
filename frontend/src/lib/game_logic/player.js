import Common from "@/lib/game_logic/common";

export class Player {
  static id = 0

  static player_by_id = {}

  static get player_count() {
    return Object.keys(Player.player_by_id).length
  }

  constructor(name = '') {
    this.id = ++Player.id

    this.name = name === '' ? `Player ${this.id}` : name

    this.color = Common.generate_color()

    Player.player_by_id[this.id] = this
  }
}