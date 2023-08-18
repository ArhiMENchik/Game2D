<template>
  <div class="game">
    <canvas id="game-field" width="960" height="960" class="game-field"/>
  </div>
</template>

<script>
import {Game} from "@/lib/game";

export default {
  name: "Game",
  data() {
    return {
      game: null,
    }
  },
  mounted() {
    this.game = new Game(document.getElementById('game-field'))
  },
  methods() {
  },
}
</script>

<style scoped>

</style>