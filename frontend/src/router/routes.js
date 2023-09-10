import Main from "@/views/Main.vue";
import Game from "@/views/Game.vue";
import ModelEditor from "@/views/ModelEditor.vue";

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
    {
    path: '/model_editor',
    name: 'model_editor',
    component: ModelEditor
  },
]

export default routes