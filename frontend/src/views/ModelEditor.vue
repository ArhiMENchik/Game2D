<template>
  <div class="model-editor">
    <div class="model-editor-wrapper">
      <canvas id="model-editor" class="model-editor-canvas"/>
    </div>
  </div>
</template>

<script>
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

    this.model_editor = null
  },
  methods: {
    resize_canvas() {
      let canvas = document.getElementById('model-editor')

      canvas.width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * 0.9
      canvas.height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.9
    }
  },
}
</script>

<style scoped>

</style>