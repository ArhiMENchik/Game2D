<template>
  <div class="game">
    <div class="game-wrapper">
      <canvas id="game-field" height="640" width="1280" class="game-field"/>
      <canvas id="minimap" height="320" width="440" class="minimap"/>
      <canvas id="game-panel" height="320" width="840" class="game-panel"/>
    </div>
  </div>
</template>

<script>
import {Game} from "@/lib/game/game";

export default {
  name: "Game",
  data() {
    return {
      game: null,
    }
  },
  mounted() {
    let game_field = document.getElementById('game-field')
    let minimap = document.getElementById('minimap')
    let game_panel = document.getElementById('game-panel')

    this.game = new Game(game_field, minimap, game_panel)
  },
  methods() {
  },
}
</script>

<style scoped>

</style>