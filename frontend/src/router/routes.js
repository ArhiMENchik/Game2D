import Main from "@/views/Main.vue";
import Game from "@/views/Game.vue";

const routes = [
  {
    path: '/',
    name: 'main',
    component: Main
  },
  {
    path: '/game',
    name: 'game',
    component: Game
  },
]

export default routes