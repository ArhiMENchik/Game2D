import {GameField2D} from "@/lib/game_field";

export class Game {
  constructor(canvas) {
    this.game_field = new GameField2D(canvas)
    this.game_field.sprites.on_ready(this.game_field.init.bind(this.game_field))
  }
}