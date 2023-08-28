export class Sprite {
  constructor(url) {
    this.url = url

    this.callback = null

    this.img = new Image()
    this.img.onload = () => {
      this.callback()
    }
    this.img.src = this.url
  }

  on_ready(func) {
    this.callback = func
  }
}