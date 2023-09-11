<template>
  <div class="model-editor">
    <div class="model-editor-wrapper">
      <canvas id="model-editor" class="model-editor-canvas"/>
    </div>
  </div>
</template>

<script>
import {ModelEditor} from "@/lib/model_editor_logic/model_editor";

export default {
  name: "ModelEditor",
  data() {
    return {
      model_editor: null,
    }
  },
  mounted() {
    this.resize_canvas()
    window.addEventListener('resize', this.resize_canvas)

    let canvas = document.getElementById('model-editor')

    this.model_editor = new ModelEditor(canvas)
  },
  methods: {
    resize_canvas() {
      let canvas = document.getElementById('model-editor')

      canvas.width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * 0.5
      canvas.height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.9
    }
  },
}
</script>

<style scoped>

</style>