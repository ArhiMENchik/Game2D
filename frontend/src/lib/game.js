import {GameField2D} from "@/lib/game_field";

export class Game {
  constructor(game_field) {
    this.game_field = new GameField2D(game_field)
    this.game_field.sprites.on_ready(this.game_field.init.bind(this.game_field))
  }
}