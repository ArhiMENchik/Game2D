export class ModelEditor {
  constructor(canvas) {
    this.canvas = canvas

    this.init()
  }

  init() {
    this.main()
  }

  main() {


    setTimeout(this.main.bind(this), 1000 / 60)
  }

  draw_cells() {

  }
}